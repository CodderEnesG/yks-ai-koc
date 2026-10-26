// İçindekiler fotoğrafını okur (T11, rapor 2.8). Görüntü hiçbir yere yazılmaz: istek gövdesinden alınır,
// modele gönderilir, yanıt dönünce bellekten düşer. Yalnız girişli kullanıcı; günlük kota consume_ai_quota.
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { createClient } from '@supabase/supabase-js';
import { TOC_MODEL, TOC_PROMPT, TocSchema, validateToc } from '@yks/ai';
import { z } from 'zod';

const DAILY_LIMIT = 20;
// Telefonda 1600 px'e küçültülmüş JPEG ≈ 300-600 KB; base64 ile 4 MB üst sınır bol.
const MAX_BASE64_LENGTH = 4_000_000;

const RequestSchema = z.object({
  image: z.string().min(100).max(MAX_BASE64_LENGTH),
  mediaType: z.enum(['image/jpeg', 'image/png']),
  pageCount: z.number().int().positive().max(5000).optional(),
});

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json(401, { error: 'unauthorized' });

  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: 'bad_request' });

  // Kullanıcının kendi oturumuyla: kota fonksiyonu auth.uid() ile çalışır.
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: allowed, error: quotaError } = await supabase.rpc('consume_ai_quota', {
    p_kind: 'toc',
    p_limit: DAILY_LIMIT,
  });
  if (quotaError) return json(401, { error: 'unauthorized' });
  if (!allowed) return json(429, { error: 'quota_exceeded' });

  const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
  try {
    const response = await client.messages.parse({
      model: TOC_MODEL,
      max_tokens: 16000,
      output_config: { format: zodOutputFormat(TocSchema) },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: parsed.data.mediaType,
                data: parsed.data.image,
              },
            },
            { type: 'text', text: TOC_PROMPT },
          ],
        },
      ],
    });
    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      return json(422, { error: 'unreadable' });
    }
    const toc = response.parsed_output;
    return json(200, { birimler: toc.birimler, sorunlar: validateToc(toc, parsed.data.pageCount) });
  } catch (error) {
    // Görüntü ya da içerik loglanmaz; yalnız hata türü.
    console.error('toc-extract', error instanceof Error ? error.name : 'unknown');
    return json(502, { error: 'model_error' });
  }
});
