// Koç sohbeti (T17, rapor 2.9 ve 2.10). Her öğrenci mesajı yanıttan önce deterministik liste ve Haiku
// sınıflandırıcıyla taranır (`decide`); sınıflandırıcı listeyi düşüremez.
//   akut        → LLM yanıt üretmez, sabit metin (PDR onayı bekliyor)
//   yüksek      → güvenli mod, yalnız destekleyici ton
//   yalnız deyim → yanıta nazik kontrol sorusu eklenir
//   sınıflandırıcı yok → mesaj LLM'e gitmez
// Yanıt akışlı değil: çıktı denetimi (katman 6) yanıtın tamamını öğrenciden önce görür (DECISION TO TEST).
// LLM'e giden her metin PII maskelenmiş; mesaj metni loglanmaz. Sohbet veliye hiçbir yoldan açılmaz.
import Anthropic from '@anthropic-ai/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  buildCoachContext,
  CHAT_DAILY_LIMIT,
  CHAT_HISTORY_MESSAGES,
  CHAT_MAX_LENGTH,
  COACH_EFFORT,
  COACH_MAX_TOKENS,
  COACH_MODEL,
  COACH_PROMPT,
  type CoachTask,
  maskPii,
} from '@yks/ai';
import {
  addDays,
  diffDays,
  isDayComplete,
  isSafeMode,
  istanbulDate,
  type Reason,
  SAFE_MODE_DAYS,
} from '@yks/plan-engine';
import {
  ACUTE_RESPONSE,
  CHECK_QUESTION,
  checkOutput,
  decide,
  OUTPUT_FALLBACK,
  type RiskLevel,
  SAFETY_TEXT_VERSION,
  screenText,
  UNAVAILABLE_RESPONSE,
} from '@yks/safety';
import { z } from 'zod';

import { loadBooks } from '../_shared/books.ts';
import { classifyRisk } from '../_shared/classify.ts';

const RequestSchema = z.object({
  /** Öğrenci mesajının kimliği; telefonda üretilir. */
  id: z.uuid(),
  text: z.string().trim().min(1).max(CHAT_MAX_LENGTH),
  /** Telefondaki güvenli mod ("planımı hafiflet", önceki risk sinyali). Yalnız tonu yumuşatabilir. */
  safeMode: z.boolean().optional(),
});

type Action = 'reply' | 'check' | 'support' | 'fixed' | 'unavailable' | 'replaced';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json(401, { error: 'unauthorized' });
  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: 'bad_request' });
  const { id, text } = parsed.data;

  const url = Deno.env.get('SUPABASE_URL')!;
  const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: auth } = await asUser.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return json(401, { error: 'unauthorized' });

  // Değişmez kural: onaysız 18 yaş altı öğrencinin mesajı sunucuda işlenmez, LLM'e gitmez.
  const { data: consentOk, error: consentError } = await asUser.rpc('my_consent_ok');
  if (consentError) return json(401, { error: 'unauthorized' });
  if (!consentOk) return json(403, { error: 'consent_required' });

  const { data: allowed } = await asUser.rpc('consume_ai_quota', {
    p_kind: 'chat',
    p_limit: CHAT_DAILY_LIMIT,
  });
  if (!allowed) return json(429, { error: 'quota_exceeded' });

  const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await db.rpc('purge_chat_messages', { p_user: userId });

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
  const decision = decide(screenText(text), await classifyRisk(anthropic, text));

  const { error: insertError } = await db.from('chat_message').insert({
    id,
    user_id: userId,
    role: 'user',
    content: text,
    risk_level: decision.level,
  });
  if (insertError) {
    return json(insertError.code === '23505' ? 409 : 500, { error: 'store_failed' });
  }

  const recordEvent = async (
    level: Exclude<RiskLevel, 'yok'>,
    sources: string[],
    action: string,
  ) => {
    const { error } = await asUser.rpc('record_safety_event', {
      p_level: level,
      p_category: decision.category ?? 'diger',
      p_sources: sources,
      p_action: action,
      p_text_version: SAFETY_TEXT_VERSION,
      p_message_id: id,
    });
    // Kayıt düşmese de öğrenciye güvenli yanıt gider.
    if (error) console.error('chat record', error.code);
  };
  if (decision.level !== 'yok') {
    await recordEvent(
      decision.level,
      decision.sources,
      decision.action === 'fixed' ? 'fixed' : 'support',
    );
  }

  let reply: string;
  let action: Action;
  if (decision.action === 'fixed') {
    reply = ACUTE_RESPONSE;
    action = 'fixed';
  } else if (decision.action === 'unavailable') {
    reply = UNAVAILABLE_RESPONSE;
    action = 'unavailable';
  } else {
    const generated = await generate({
      db,
      anthropic,
      userId,
      messageId: id,
      text,
      safeMode: parsed.data.safeMode === true || decision.safeMode,
    });
    if (generated === null) {
      reply = UNAVAILABLE_RESPONSE;
      action = 'unavailable';
    } else if (checkOutput(generated).length > 0) {
      reply = OUTPUT_FALLBACK;
      action = 'replaced';
      await recordEvent(
        decision.level === 'yok' ? 'yuksek' : decision.level,
        ['output'],
        'replaced',
      );
    } else if (decision.action === 'check') {
      reply = `${generated}\n\n${CHECK_QUESTION}`;
      action = 'check';
    } else {
      reply = generated;
      action = decision.action === 'support' ? 'support' : 'reply';
    }
  }

  const assistantId = crypto.randomUUID();
  const { error: replyError } = await db.from('chat_message').insert({
    id: assistantId,
    user_id: userId,
    role: 'assistant',
    content: reply,
    action,
  });
  if (replyError) console.error('chat store reply', replyError.code);

  return json(200, {
    id: assistantId,
    reply,
    action,
    level: decision.level,
    // Yeni risk sinyali: telefon güvenli modu başlatır (72 saat).
    startSafeMode: decision.safeMode,
  });
});

/** Koç yanıtı; model ret verir ya da hata olursa null. */
async function generate(args: {
  db: SupabaseClient;
  anthropic: Anthropic;
  userId: string;
  messageId: string;
  text: string;
  safeMode: boolean;
}): Promise<string | null> {
  const { db, anthropic, userId, messageId } = args;
  const today = istanbulDate(Date.now());
  const weekAgo = addDays(today, -7);

  const [profile, tasks, books, events, history] = await Promise.all([
    db.from('profile').select('exam_date').eq('user_id', userId).maybeSingle(),
    db
      .from('plan_task')
      .select('day, status, est_seconds, library_item_id, kind, range_first, range_last, reason')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gte('day', weekAgo)
      .lte('day', today),
    loadBooks(db, userId),
    db
      .from('safety_event')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - SAFE_MODE_DAYS * 86_400_000).toISOString())
      .limit(1),
    db
      .from('chat_message')
      .select('role, content')
      .eq('user_id', userId)
      .neq('id', messageId)
      .order('created_at', { ascending: false })
      .limit(CHAT_HISTORY_MESSAGES),
  ]);
  if (profile.error || tasks.error || !books || events.error || history.error) return null;

  const titles = new Map(books.map((b) => [b.id, b.title]));
  const rows = tasks.data;
  const todayTasks: CoachTask[] = rows
    .filter((t) => t.day === today)
    .map((t) => ({
      title: titles.get(t.library_item_id) ?? '',
      kind: t.kind,
      first: t.range_first,
      last: t.range_last,
      minutes: Math.round(t.est_seconds / 60),
      status: t.status,
    }));
  const pastDays = new Map<string, { status: CoachTask['status']; seconds: number }[]>();
  for (const t of rows) {
    if (diffDays(t.day, today) >= 0) continue;
    pastDays.set(t.day, [
      ...(pastDays.get(t.day) ?? []),
      { status: t.status, seconds: t.est_seconds },
    ]);
  }
  const reasonEvents = rows
    .filter((t) => t.reason)
    .map((t) => ({ day: t.day, reason: t.reason as Reason, unitId: '' }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const context = buildCoachContext({
    today,
    daysToExam: profile.data ? Math.max(0, diffDays(profile.data.exam_date, today)) : 0,
    todayTasks,
    last7: {
      planned: pastDays.size,
      complete: [...pastDays.values()].filter((d) => isDayComplete(d)).length,
    },
    reasons: reasonEvents.map((e) => e.reason),
    safeMode: args.safeMode || events.data.length > 0 || isSafeMode(reasonEvents, today),
  });

  // Geçmiş eskiden yeniye; ilk mesaj öğrenciden olmalı. Öğrenci mesajları maskelenir.
  const past = [...history.data].reverse();
  while (past.length > 0 && past[0]!.role !== 'user') past.shift();
  const messages: Anthropic.MessageParam[] = [
    ...past.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.role === 'user' ? maskPii(m.content) : m.content,
    })),
    { role: 'user', content: maskPii(args.text) },
  ];

  try {
    const response = await anthropic.messages.create({
      model: COACH_MODEL,
      max_tokens: COACH_MAX_TOKENS,
      // Sabit istem önbellekte; değişen bağlam ondan sonra.
      system: [
        { type: 'text', text: COACH_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: context },
      ],
      output_config: { effort: COACH_EFFORT },
      messages,
    });
    if (response.stop_reason === 'refusal') return null;
    const reply = response.content
      .flatMap((b) => (b.type === 'text' ? [b.text] : []))
      .join('')
      .trim();
    return reply.length > 0 ? reply : null;
  } catch (error) {
    console.error('chat generate', error instanceof Error ? error.name : 'unknown');
    return null;
  }
}
