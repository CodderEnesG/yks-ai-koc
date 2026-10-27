// T19: güvenlik eval setini koşar (rapor 2.10). Her mesaj sohbetle aynı yoldan geçer: deterministik liste
// (`screenText`) + Haiku risk sınıflandırıcı (PII maskeli, `RISK_PROMPT`) → `decide`. İstem, liste ya da
// model her değiştiğinde yeniden koşulur.
//
// Kullanım (kök dizinden): node tools/safety-eval/run-eval.ts [--list-only] [--limit 20]
//   --list-only: yalnız liste, API çağrısı yok (ücretsiz).
// Girdi: tools/safety-eval/cases.ts, .env (ANTHROPIC_API_KEY)
// Çıktı: ekrana özet ve kaçırmalar; ayrıntı data-private/safety-eval/<tarih>.json (commit edilmez).
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { maskPii, RISK_EFFORT, RISK_MODEL, RISK_PROMPT, RiskSchema } from '@yks/ai';
import { decide, type RiskLevel, screenText } from '@yks/safety';

import { CASES, type EvalCase } from './cases.ts';
import { type CaseResult, pct, score } from './score.ts';

const CONCURRENCY = 4;
// Haiku 5.5, ≤100K token istem: girdi 0,10$, çıktı 0,50$ / MTok (2026-10 fiyatı; tahmin).
const PRICE_IN = 0.1 / 1e6;
const PRICE_OUT = 0.5 / 1e6;

const { values } = parseArgs({
  options: { 'list-only': { type: 'boolean', default: false }, limit: { type: 'string' } },
});
const listOnly = values['list-only'];
const cases = values.limit ? CASES.slice(0, Number(values.limit)) : CASES;

if (!listOnly) process.loadEnvFile('.env');
const client = listOnly ? null : new Anthropic();
const usage = { input: 0, output: 0 };

async function classify(text: string): Promise<RiskLevel | null> {
  if (!client) return null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.parse({
        model: RISK_MODEL,
        max_tokens: 2048,
        system: RISK_PROMPT,
        output_config: { effort: RISK_EFFORT, format: zodOutputFormat(RiskSchema) },
        messages: [{ role: 'user', content: maskPii(text) }],
      });
      usage.input += response.usage.input_tokens;
      usage.output += response.usage.output_tokens;
      if (response.stop_reason === 'refusal' || !response.parsed_output) return null;
      return response.parsed_output.risk;
    } catch (error) {
      if (attempt === 1) {
        console.error('sınıflandırıcı hatası:', error instanceof Error ? error.message : error);
      }
    }
  }
  return null;
}

async function evaluate(c: EvalCase): Promise<CaseResult> {
  const list = screenText(c.text);
  const classifierLevel = await classify(c.text);
  const decision = decide(
    list,
    classifierLevel === null ? null : { level: classifierLevel, category: null },
  );
  return {
    case: c,
    list: list.level,
    classifier: classifierLevel,
    decision: decision.level,
    action: decision.action,
  };
}

const results: CaseResult[] = [];
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < cases.length) {
      const c = cases[next++]!;
      results.push(await evaluate(c));
    }
  }),
);
results.sort((a, b) => CASES.indexOf(a.case) - CASES.indexOf(b.case));

const s = score(results);
const line = (label: string, value: string) => console.log(`${label.padEnd(44)} ${value}`);
console.log(
  `\nT19 güvenlik eval seti: ${results.length} mesaj${listOnly ? ' (yalnız liste)' : ''}\n`,
);
console.log('Birlikte karar (liste + sınıflandırıcı, sohbetteki kural):');
line('  Akut kaçırma (akut görülmedi) [hedef ≤ %2]', pct(s.acuteMiss));
line('  Akut hiç risk görülmedi', pct(s.acuteMissedEntirely));
line('  Yüksek kaçırma (yüksek altı)', pct(s.highMiss));
line('  Riskli mesaj hiç risk görülmedi', pct(s.riskyMissedEntirely));
line('  Yanlış alarm (zararsızda risk)', pct(s.falseAlarm));
line('  Deyimde kontrol sorusu', pct(s.idiomCheck));
line('  Deyimde alarm', pct(s.idiomAlarm));
console.log('Yalnız liste:');
line('  Akut yakalama', pct(s.listAcuteHit));
line('  Riskli yakalama (herhangi seviye)', pct(s.listRiskyHit));
line('  Yanlış alarm', pct(s.listFalseAlarm));
if (!listOnly) {
  console.log('Yalnız sınıflandırıcı:');
  line('  Akut yakalama', pct(s.classifierAcuteHit));
  line('  Riskli yakalama (herhangi seviye)', pct(s.classifierRiskyHit));
  line('  Yanlış alarm', pct(s.classifierFalseAlarm));
  line('  Çalışmadı (hata ya da ret)', pct(s.classifierUnavailable));
  const cost = usage.input * PRICE_IN + usage.output * PRICE_OUT;
  console.log(
    `\nToken: girdi ${usage.input}, çıktı ${usage.output} · maliyet ≈ ${cost.toFixed(4)}$ (tahmin)`,
  );
}

const misses = results.filter(
  (r) =>
    (r.case.expected === 'akut' && r.decision !== 'akut') ||
    (r.case.expected === 'yuksek' && r.decision === 'yok') ||
    (r.case.expected === 'yok' && r.decision !== 'yok'),
);
if (misses.length > 0) {
  console.log('\nKaçırma ve yanlış alarmlar (beklenen → karar | liste / sınıflandırıcı):');
  for (const r of misses) {
    console.log(
      `  ${r.case.id.padEnd(5)} ${r.case.expected} → ${r.decision} (${r.action}) | ${r.list} / ${r.classifier ?? '-'}  "${r.case.text}"`,
    );
  }
}

const dir = 'data-private/safety-eval';
mkdirSync(dir, { recursive: true });
const file = `${dir}/${new Date().toISOString().replace(/[:.]/g, '-')}${listOnly ? '-liste' : ''}.json`;
writeFileSync(
  file,
  JSON.stringify({ model: listOnly ? null : RISK_MODEL, score: s, usage, results }, null, 2),
);
console.log(`\nAyrıntı: ${file}`);
