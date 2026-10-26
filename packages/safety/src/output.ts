// Çıktı denetimi (rapor 2.10 katman 6): LLM yanıtında yasaklı kalıp varsa yanıt öğrenciye gitmez,
// OUTPUT_FALLBACK ile değiştirilir. Kurallar sistem istemindeki yasaklarla aynı (katman 5): teşhis, ilaç ve
// tedavi önerisi, kıyaslama, beden yorumu, kişiye yönelik aşağılama, tehdit, zarar yöntemi.
// TASLAK: kalıplar T19 eval setiyle ve ton rehberiyle (T06) birlikte genişletilir.
import { normalize } from './normalize.ts';

export type OutputViolation =
  'teshis' | 'ilac' | 'kiyas' | 'beden' | 'asagilama' | 'tehdit' | 'yontem';

// Normalize edilmiş metin üzerinde (küçük harf, ASCII, tek boşluk, tekrar harf teke inmiş).
const RULES: readonly [OutputViolation, RegExp][] = [
  ['teshis', /(?:depresyon|anksiyete|bipolar|dehb|adhd|okb|borderline)[a-z]*(?:sin|sun)\b/],
  ['teshis', /\b(?:sende|sizde) (?:depresyon|anksiyete|bipolar|dehb|adhd|okb|borderline|panik)/],
  [
    'ilac',
    /\b(?:antidepresan|xanax|sertralin|lustral|prozac|fluoksetin|ritalin|concerta|modafinil|melatonin|sakinlestirici|uyku ilac)/,
  ],
  ['ilac', /\b(?:ilac|hap)[a-z]* (?:al|kullan|ic|dene)/],
  ['kiyas', /\b(?:diger|baska|sinifindaki) (?:ogrenci|arkadas|cocuk)[a-z]* (?:senden|daha)/],
  ['beden', /\b(?:kilo (?:ver|al)|sisman|zayifla|bedenin|vucudun|gorunusun)/],
  ['asagilama', /\b(?:tembel|aptal|salak|beceriksiz|gerizekali|yeteneksiz|basarisiz)(?:sin|sun)\b/],
  ['tehdit', /\b(?:pisman ed|cezalandir|veline (?:soyle|anlat|haber ver))/],
  ['yontem', /\b(?:olumcul|oldurucu) doz/],
];

export function checkOutput(text: string): OutputViolation[] {
  const normalized = normalize(text);
  return [...new Set(RULES.filter(([, re]) => re.test(normalized)).map(([v]) => v))];
}
