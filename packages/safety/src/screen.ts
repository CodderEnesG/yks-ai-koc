// Mesajı deterministik listeyle tarar (rapor 2.10 katman 1). Sunucuda her mesajda, istemcide gönderimden
// önce aynı kod çalışır; sınıflandırıcıdan bağımsızdır ve onu beklemez.
import { IDIOMS, LEXICON, type LexiconEntry } from './lexicon.ts';
import { normalize } from './normalize.ts';
import { type Assessment, levelRank } from './types.ts';

/** Kökler arasında izin verilen en fazla ara sözcük. */
const MAX_GAP_WORDS = 3;

function compile(phrase: string): RegExp {
  const stems = normalize(phrase).split(' ');
  const gap = `(?: [a-z]+){0,${MAX_GAP_WORDS}}`;
  return new RegExp(`(?:^| )${stems.join(`[a-z]*${gap} `)}`);
}

const ENTRIES: readonly (LexiconEntry & { pattern: RegExp })[] = LEXICON.map((e) => ({
  ...e,
  pattern: compile(e.phrase),
}));
const IDIOM_PATTERNS = IDIOMS.map(compile);

export interface ListResult extends Assessment {
  /** Eşleşen liste ifadeleri (olay kaydı ve eval için; mesaj metni değil). */
  matches: string[];
  /** Risk yok ama sınav deyimi var: alarm yerine kontrol sorusu. */
  idiom: boolean;
}

export function screenText(text: string): ListResult {
  const normalized = normalize(text);
  let best: LexiconEntry | null = null;
  const matches: string[] = [];
  for (const e of ENTRIES) {
    if (!e.pattern.test(normalized)) continue;
    matches.push(e.phrase);
    if (!best || levelRank(e.level) > levelRank(best.level)) best = e;
  }
  return {
    level: best?.level ?? 'yok',
    category: best?.category ?? null,
    matches,
    idiom: best === null && IDIOM_PATTERNS.some((p) => p.test(normalized)),
  };
}
