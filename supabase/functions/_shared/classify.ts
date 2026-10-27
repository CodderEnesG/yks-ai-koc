// Haiku risk sınıflandırıcı (rapor 2.10 katman 2); classify ve chat fonksiyonları ortak kullanır.
// Mesaj LLM'e PII maskelenmiş gider; metin loglanmaz. Hata ya da rette null: karar (`decide`) bu durumda
// mesajı LLM'e göndermez.
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { maskPii, RISK_EFFORT, RISK_MODEL, RISK_PROMPT, RiskSchema } from '@yks/ai';
import type { Assessment } from '@yks/safety';

export async function classifyRisk(client: Anthropic, text: string): Promise<Assessment | null> {
  try {
    const response = await client.messages.parse({
      model: RISK_MODEL,
      max_tokens: 2048,
      system: RISK_PROMPT,
      output_config: { effort: RISK_EFFORT, format: zodOutputFormat(RiskSchema) },
      messages: [{ role: 'user', content: maskPii(text) }],
    });
    const risk = response.parsed_output;
    if (response.stop_reason === 'refusal' || !risk) return null;
    return { level: risk.risk, category: risk.kategori };
  } catch (error) {
    console.error('classify', error instanceof Error ? error.name : 'unknown');
    return null;
  }
}
