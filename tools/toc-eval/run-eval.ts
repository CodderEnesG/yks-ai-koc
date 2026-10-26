// T05: içindekiler sayfasını okuma doğruluğu. Claude Haiku 5.5'i MEB OGM kitaplarının içindekiler
// görüntüleri üzerinde ölçer (rapor 2.2, 5). Gemini karşılaştırması 2026-10-24'te yapıldı ve bırakıldı
// (sonuçlar README'de).
//
// Kullanım (kök dizinden): node tools/toc-eval/run-eval.ts [--models haiku,haiku-low]
//   [--images clean|photo] [--limit 3]
// clean: temiz PDF görüntüsü (toc/), photo: telefon fotoğrafı benzeri (toc-photo/, make-photos.ts)
// Girdi:  data-private/meb-ogm/truth.json ve toc/<id>.png (extract-truth.ts), .env
// Çıktı:  data-private/meb-ogm/eval/<tarih>/<model>.json (model okumaları; telifli başlık içerir)
//         ve ekrana özet. Ham başlıklar commit edilmez.

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { TOC_MODEL, TOC_PROMPT as PROMPT, type Toc, TocSchema } from '@yks/ai';

const DATA_DIR = 'data-private/meb-ogm';
const CONCURRENCY = 4;

process.loadEnvFile('.env');

interface Image {
  data: string;
  mediaType: 'image/png' | 'image/jpeg';
}

interface Usage {
  input: number;
  output: number;
}

interface Reader {
  name: string;
  model: string;
  read: (image: Image) => Promise<{ toc: Toc; usage: Usage }>;
}

function claudeReader(name: string, effort: 'low' | 'medium'): Reader {
  const client = new Anthropic();
  const model = TOC_MODEL;
  return {
    name,
    model: `${model} (effort ${effort})`,
    async read(image) {
      const response = await client.messages.parse({
        model,
        max_tokens: 16000,
        output_config: { format: zodOutputFormat(TocSchema), effort },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: image.mediaType, data: image.data },
              },
              { type: 'text', text: PROMPT },
            ],
          },
        ],
      });
      if (response.stop_reason === 'refusal' || !response.parsed_output) {
        throw new Error(`Claude çıktı vermedi: ${response.stop_reason}`);
      }
      return {
        toc: response.parsed_output,
        usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
      };
    },
  };
}

interface TruthBook {
  id: string;
  birimler: { sira: number; baslik: string; sayfaBas: number }[];
}

type Overrides = Record<string, { birimler?: Record<string, unknown> }>;

interface Score {
  dogru: number;
  olculen: number;
  eksik: number;
  fazla: number;
  baslikDogru: number;
}

function normalize(text: string): string {
  return text.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]+/gu, '');
}

// Doğru cevapla modelin okuması sırayla hizalanır: her doğru birim için modelin listesinde, kalan
// konumdan itibaren en fazla 3 satır ileride aynı sayfa aranır. Bir satırı atlamak ya da fazladan
// okumak sonraki tüm satırları yanlış saydırmaz.
function score(truth: TruthBook, toc: Toc, skip: Set<number>): Score {
  const predicted = toc.birimler;
  let cursor = 0;
  let dogru = 0;
  let baslikDogru = 0;
  const used = new Set<number>();
  for (const unit of truth.birimler) {
    if (skip.has(unit.sira)) continue;
    for (let j = cursor; j < Math.min(predicted.length, cursor + 4); j++) {
      if (predicted[j]!.sayfa === unit.sayfaBas) {
        dogru++;
        used.add(j);
        if (normalize(predicted[j]!.baslik) === normalize(unit.baslik)) baslikDogru++;
        cursor = j + 1;
        break;
      }
    }
  }
  const olculen = truth.birimler.length - skip.size;
  return {
    dogru,
    olculen,
    eksik: olculen - dogru,
    fazla: predicted.length - used.size - skip.size,
    baslikDogru,
  };
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]!);
      }
    }),
  );
  return results;
}

const { values } = parseArgs({
  options: {
    models: { type: 'string', default: 'haiku' },
    limit: { type: 'string' },
    images: { type: 'string', default: 'clean' },
  },
});
const readers = values.models.split(',').map((name) => {
  if (name === 'haiku') return claudeReader('haiku', 'medium');
  if (name === 'haiku-low') return claudeReader('haiku-low', 'low');
  throw new Error(`Bilinmeyen model: ${name}`);
});

const truth = (JSON.parse(readFileSync(join(DATA_DIR, 'truth.json'), 'utf8')) as TruthBook[]).slice(
  0,
  values.limit ? Number(values.limit) : undefined,
);
const overrides = JSON.parse(
  readFileSync('tools/toc-eval/truth-overrides.json', 'utf8'),
) as Overrides;
// Elle düzeltilen birimlerde içindekiler sayfası yanlış basılmış; okuma doğruluğu ölçülürken sayılmaz.
const skipOf = (id: string) => new Set(Object.keys(overrides[id]?.birimler ?? {}).map(Number));

const outDir = join(DATA_DIR, 'eval', new Date().toISOString().slice(0, 10));
mkdirSync(outDir, { recursive: true });

for (const reader of readers) {
  const started = Date.now();
  const rows = await pool(truth, CONCURRENCY, async (book) => {
    const image: Image =
      values.images === 'photo'
        ? {
            data: readFileSync(join(DATA_DIR, 'toc-photo', `${book.id}.jpg`)).toString('base64'),
            mediaType: 'image/jpeg',
          }
        : {
            data: readFileSync(join(DATA_DIR, 'toc', `${book.id}.png`)).toString('base64'),
            mediaType: 'image/png',
          };
    for (let attempt = 1; ; attempt++) {
      try {
        const { toc, usage } = await reader.read(image);
        return { id: book.id, toc, usage, score: score(book, toc, skipOf(book.id)), error: null };
      } catch (error) {
        if (attempt >= 2) {
          return { id: book.id, toc: null, usage: null, score: null, error: String(error) };
        }
      }
    }
  });
  writeFileSync(
    join(outDir, `${reader.name}-${values.images}.json`),
    JSON.stringify(rows, null, 2),
  );

  const ok = rows.filter((r) => r.score);
  const sum = (key: keyof Score) => ok.reduce((a, r) => a + r.score![key], 0);
  const tokens = ok.reduce(
    (a, r) => ({ input: a.input + r.usage!.input, output: a.output + r.usage!.output }),
    { input: 0, output: 0 },
  );
  const fullyCorrect = ok.filter((r) => r.score!.eksik === 0 && r.score!.fazla === 0).length;
  console.log(`\n== ${reader.name}: ${reader.model}, görüntü: ${values.images}`);
  console.log(`kitap: ${ok.length}/${rows.length} okundu, ${fullyCorrect} kitap düzeltmesiz`);
  console.log(
    `sayfa doğruluğu: ${sum('dogru')}/${sum('olculen')} (${((100 * sum('dogru')) / sum('olculen')).toFixed(1)}%)` +
      `, başlık birebir: ${sum('baslikDogru')}/${sum('dogru')}`,
  );
  console.log(`düzeltilecek satır: ${sum('eksik')} eksik/yanlış + ${sum('fazla')} fazla`);
  console.log(
    `token: ${tokens.input} girdi, ${tokens.output} çıktı (düşünme dahil); süre ${((Date.now() - started) / 1000).toFixed(0)} sn`,
  );
  for (const r of rows.filter((x) => x.error || (x.score && (x.score.eksik || x.score.fazla)))) {
    console.log(
      `  ${r.id}: ${r.error ? `HATA ${r.error.slice(0, 120)}` : `${r.score!.eksik} eksik/yanlış, ${r.score!.fazla} fazla`}`,
    );
  }
}
console.log(`\nAyrıntı: ${outDir}`);
