// Koç sohbeti, telefon tarafı (T20). Mesaj önce telefona yazılır (gönderiliyor), `chat` fonksiyonu
// güvenlik taramasını ve yanıtı üretir; yanıt telefona eklenir. Risk sinyali gelirse güvenli mod başlar.
import { type CivilDate, isSafeMode } from '@yks/plan-engine';
import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { chatMessage } from '@/db/schema';
import { track } from '@/features/analytics/analytics';
import { loadReasonEvents } from '@/features/plan/checkin';
import { loadSafetyDays, startSafeMode } from '@/features/safety/safe-mode';
import { supabase } from '@/lib/supabase';

import { type ChatError, chatError } from './rules';

export type ChatMessage = typeof chatMessage.$inferSelect;
export type ChatAction = NonNullable<ChatMessage['action']>;

export function useChatMessages(): ChatMessage[] | undefined {
  const { data, updatedAt } = useLiveQuery(
    db.select().from(chatMessage).orderBy(asc(chatMessage.createdAt)),
  );
  return updatedAt === undefined ? undefined : data;
}

interface ChatResponse {
  id: string;
  reply: string;
  action: ChatAction;
  startSafeMode: boolean;
}

/**
 * Mesajı gönderir. Başarılıysa koç yanıtının aksiyonu (akut riskte `fixed`: ekran Destek'e yönlendirir),
 * değilse hata. Başarısız mesaj telefonda `failed` kalır, tekrar gönderilebilir.
 */
export async function sendChatMessage(
  text: string,
  today: CivilDate,
): Promise<{ action: ChatAction } | { error: ChatError }> {
  const id = randomUUID();
  db.insert(chatMessage)
    .values({
      id,
      role: 'user',
      content: text,
      status: 'sending',
      createdAt: new Date().toISOString(),
    })
    .run();

  const safeMode = isSafeMode(loadReasonEvents(), today, loadSafetyDays());
  const { data, error } = await supabase.functions.invoke('chat', { body: { id, text, safeMode } });
  if (error) {
    db.update(chatMessage).set({ status: 'failed' }).where(eq(chatMessage.id, id)).run();
    return { error: chatError((error as { context?: { status?: number } }).context?.status) };
  }

  const res = data as ChatResponse;
  db.transaction((tx) => {
    tx.update(chatMessage).set({ status: 'sent' }).where(eq(chatMessage.id, id)).run();
    tx.insert(chatMessage)
      .values({
        id: res.id,
        role: 'assistant',
        content: res.reply,
        status: 'sent',
        action: res.action,
        createdAt: new Date().toISOString(),
      })
      .run();
  });
  track('sohbet_mesaj', { aksiyon: res.action });
  if (res.startSafeMode) {
    startSafeMode(today);
    track('guvenli_mod_acildi', { kaynak: 'sohbet' });
  }
  return { action: res.action };
}

/** Gönderilemeyen mesajı yeniden gönderir (sunucuda yarım kalmış olabilir; yeni kimlikle). */
export async function retryChatMessage(message: ChatMessage, today: CivilDate) {
  db.delete(chatMessage).where(eq(chatMessage.id, message.id)).run();
  return sendChatMessage(message.content, today);
}

/** "Bildir" (rapor 2.10 katman 8): koç yanıtını kurucuların incelemesine işaretler. */
export async function reportChatMessage(id: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('report_chat_message', { p_id: id });
  if (error) return false;
  db.update(chatMessage)
    .set({ reportedAt: new Date().toISOString() })
    .where(eq(chatMessage.id, id))
    .run();
  return data === true;
}
