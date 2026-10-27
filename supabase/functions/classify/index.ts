// Mesaj risk sınıflandırması (T18, rapor 2.10 katman 1-2). Deterministik liste ve Haiku sınıflandırıcı
// birlikte karar verir (`decide`); risk varsa `safety_event` kaydı düşer. Sohbet (T17) aynı adımları
// yanıt üretmeden önce kendi içinde çalıştıracak; bu uç tek başına sınıflandırma ve eval içindir.
// Mesaj metni hiçbir yere yazılmaz ve loglanmaz; LLM'e PII maskelenmiş hâli gider.
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { decide, SAFETY_TEXT_VERSION, screenText } from '@yks/safety';
import { z } from 'zod';

import { classifyRisk } from '../_shared/classify.ts';

// Kota dolunca sınıflandırıcı atlanır, liste yine çalışır (güvenlik kotaya takılmaz). Sınır tahmin.
const DAILY_LIMIT = 100;
// Sohbet mesajı sınırı (rapor 2.9).
const MAX_LENGTH = 1000;

const RequestSchema = z.object({ text: z.string().trim().min(1).max(MAX_LENGTH) });

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json(401, { error: 'unauthorized' });

  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: 'bad_request' });
  const { text } = parsed.data;

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  // Değişmez kural: onaysız 18 yaş altı öğrencinin mesajı sunucuda işlenmez, LLM'e gitmez.
  const { data: consentOk, error: consentError } = await supabase.rpc('my_consent_ok');
  if (consentError) return json(401, { error: 'unauthorized' });
  if (!consentOk) return json(403, { error: 'consent_required' });

  const list = screenText(text);
  const { data: allowed } = await supabase.rpc('consume_ai_quota', {
    p_kind: 'safety',
    p_limit: DAILY_LIMIT,
  });
  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
  const decision = decide(list, allowed ? await classifyRisk(anthropic, text) : null);

  if (decision.level !== 'yok') {
    const { error } = await supabase.rpc('record_safety_event', {
      p_level: decision.level,
      p_category: decision.category,
      p_sources: decision.sources,
      p_action: decision.action === 'fixed' ? 'fixed' : 'support',
      p_text_version: SAFETY_TEXT_VERSION,
    });
    // Kayıt düşmese de öğrenciye karar döner; güvenli yanıt kayda bağlı değil.
    if (error) console.error('classify record', error.code);
  }

  return json(200, {
    level: decision.level,
    category: decision.category,
    action: decision.action,
    safeMode: decision.safeMode,
  });
});
