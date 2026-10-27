// Sohbet kuralları (T20): saf, vitest ile test edilir. Sınırlar sunucuyla aynı kaynaktan (packages/ai).
import { CHAT_MAX_LENGTH } from '@yks/ai/limits';

export type ChatTextIssue = 'empty' | 'too_long';

/** Gönderilecek metin: kırpılmış hâli ya da sorun. Yalnız metin; ek, görsel yok (değişmez kural). */
export function checkChatText(text: string): { text: string } | { issue: ChatTextIssue } {
  const trimmed = text.trim();
  if (trimmed.length === 0) return { issue: 'empty' };
  if (trimmed.length > CHAT_MAX_LENGTH) return { issue: 'too_long' };
  return { text: trimmed };
}

export type ChatError = 'quota' | 'consent' | 'auth' | 'network';

/** Edge Function HTTP durumundan öğrenciye gösterilecek hata. */
export function chatError(status: number | undefined): ChatError {
  if (status === 429) return 'quota';
  if (status === 403) return 'consent';
  if (status === 401) return 'auth';
  return 'network';
}
