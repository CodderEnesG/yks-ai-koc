// Katalog birimlerini (MEB OGM, 32 kitap) konu taksonomisine eşler (T12).
//
// Kullanım (kök dizinden): node tools/taxonomy/match.ts [--claude] [--rapor]
//   --claude  kuralla çözülemeyen birimleri Claude Haiku 5.5'e sorar (.env gerekli; ücretli API çağrısı)
//   --rapor   her birimi başlığıyla ekrana döker (yalnız yerel inceleme için; çıktı commit edilmez)
// Girdi:  data-private/meb-ogm/truth.json (ham başlıklar; yalnız eşlemede kullanılır)
//         tools/taxonomy/claude-kararlari.json, tools/taxonomy/elle-kararlar.json
// Çıktı:  tools/taxonomy/unit-topic-map.json (kitap, sıra → konu anahtarı; başlık içermez)
//
// Değişmez kural (rapor 1.3/5): ham başlık metni repoya ve migration'a girmez. Bu araç başlıkları yalnız
// bellekte okur; yazdığı dosyalarda başlık yoktur. Claude'a giden istekte başlık vardır (kişisel veri yok).

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import { flatten, normalize, type Dugum } from './lib.ts';

const DIR = 'tools/taxonomy';
const MODEL = 'claude-haiku-5-5';
/** Tüm başlığın bu orana kadar karşılanması kesin eşleme sayılır. */
const KESIN = 0.8;
/** Parça eşlemesinde alt sınır. */
const ALT = 0.5;

/** Kitabın dersi → aday taksonomi dersleri. İngilizce (YDT) taksonomisi ERTELENDİ. */
const DERS_ADAY: Record<string, string[]> = {
  Biyoloji: ['BIY'],
  Coğrafya: ['COG'],
  Felsefe: ['FEL'],
  'Felsefe Grubu': ['PSI', 'SOS', 'MAN', 'FEL'],
  Fizik: ['FIZ'],
  Kimya: ['KIM'],
  Matematik: ['MAT'],
  Tarih: ['TAR', 'ITA'],
  Türkçe: ['TDE'],
  'Türk Dili ve Edebiyatı': ['TDE'],
  İngilizce: [],
};

const STOP = new Set(['ve', 'ile', 'de', 'da', 'ki', 'bir', 'veya', 'in', 'ın', 'un', 'ün']);

interface TruthBook {
  id: string;
  sinav: 'TYT' | 'AYT' | 'YDT';
  ders: string;
  birimler: { sira: number; baslik: string }[];
}

export type Yontem = 'kural' | 'kural-ust' | 'claude' | 'elle' | 'eslesmedi';

export interface Esleme {
  sira: number;
  konu: string | null;
  yontem: Yontem;
  /** Kuralın kapsama oranı (0-1); claude/elle kararlarında kural sonucunu gösterir. */
  skor: number;
  /** Kural sonucu tek konuya oturmadı; insan ya da model kontrolü gerekti. */
  belirsiz?: true;
}

interface Karar {
  konu: string | null;
  neden: string;
}

const tokens = (text: string) =>
  [...new Set(normalize(text).split(' '))].filter((t) => t.length > 0 && !STOP.has(t));

function tokMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  return s.length >= 4 && l.startsWith(s);
}

/** Başlıktaki sondaki parça numarasını atar ("Veri - 1", "Felsefesi-2"). */
const stripNumbering = (title: string) => title.replace(/\s*-?\s*\d+\s*$/, '').trim();

interface Aday {
  dugum: Dugum;
  ad: string[];
  hepsi: string[];
}

interface Sonuc {
  dugum: Dugum;
  kapsama: number;
  kesinlik: number;
}

function enIyi(baslik: string, adaylar: Aday[], sinav: string): Sonuc[] {
  const t = tokens(baslik);
  if (t.length === 0) return [];
  const sonuc = adaylar.map((a) => {
    const hit = t.filter((x) => a.hepsi.some((y) => tokMatch(x, y))).length;
    const adHit = a.ad.filter((y) => t.some((x) => tokMatch(x, y))).length;
    return { dugum: a.dugum, kapsama: hit / t.length, kesinlik: adHit / Math.max(1, a.ad.length) };
  });
  // Eşitlikte: ad kesinliği, sonra yaprak (daha özgül), sonra sınav düzeyi (TYT küçük sınıf, AYT büyük
  // sınıf; editoryal sezgi, DECISION TO TEST), sonra ağaç sırası.
  const sinifPuani = (d: Dugum) =>
    d.sinif === null ? 0 : sinav === 'TYT' ? -d.sinif : sinav === 'AYT' ? d.sinif : 0;
  return sonuc
    .filter((s) => s.kapsama > 0)
    .sort(
      (a, b) =>
        b.kapsama - a.kapsama ||
        b.kesinlik - a.kesinlik ||
        Number(b.dugum.duzey === 'konu') - Number(a.dugum.duzey === 'konu') ||
        sinifPuani(b.dugum) - sinifPuani(a.dugum),
    );
}

function eslestir(
  baslik: string,
  adaylar: Aday[],
  sinav: string,
  byKey: Map<string, Dugum>,
): Omit<Esleme, 'sira'> {
  const temiz = stripNumbering(baslik);
  const tum = enIyi(temiz, adaylar, sinav)[0];
  // Başlığın tüm sözcükleri bir konunun adında geçiyorsa doğrudan o konu.
  if (tum && tum.kapsama >= 0.999) return { konu: tum.dugum.anahtar, yontem: 'kural', skor: 1 };

  // Parçalara böl: "A - B", "A, B", "A / B". Her parça ayrı eşlenir.
  const parcalar = temiz
    .split(/\s+[-–]\s+|,|\/|\s-(?=\S)|(?<=\S)-\s/)
    .map((p) => p.trim())
    .filter((p) => tokens(p).length > 0);
  if (parcalar.length >= 2) {
    const bulunan = parcalar.map((p) => enIyi(p, adaylar, sinav)[0]);
    if (bulunan.every((b) => b !== undefined && b.kapsama >= ALT)) {
      const sonuclar = bulunan as Sonuc[];
      const skor = round(Math.min(...sonuclar.map((b) => b.kapsama)));
      const kesin = skor >= 0.75 ? {} : { belirsiz: true as const };
      const anahtarlar = [...new Set(sonuclar.map((b) => b.dugum.anahtar))];
      if (anahtarlar.length === 1) return { konu: anahtarlar[0]!, yontem: 'kural', skor, ...kesin };
      // Birden çok konu: hepsi aynı ünitedeyse üniteye çık.
      const unite = (k: string) => {
        const d = byKey.get(k)!;
        return d.duzey === 'konu' ? d.ust! : d.anahtar;
      };
      const uniteler = [...new Set(anahtarlar.map(unite))];
      if (uniteler.length === 1) return { konu: uniteler[0]!, yontem: 'kural-ust', skor, ...kesin };
      // Farklı ünitelere dağılıyor: tüm başlığın en iyisi ya da ilk parça; kontrol gerekir.
      const secim = tum && tum.kapsama >= KESIN ? tum.dugum.anahtar : anahtarlar[0]!;
      return { konu: secim, yontem: 'kural', skor, belirsiz: true };
    }
  }
  if (tum && tum.kapsama >= KESIN)
    return { konu: tum.dugum.anahtar, yontem: 'kural', skor: round(tum.kapsama) };
  if (tum && tum.kapsama >= ALT) {
    return { konu: tum.dugum.anahtar, yontem: 'kural', skor: round(tum.kapsama), belirsiz: true };
  }
  return { konu: null, yontem: 'eslesmedi', skor: round(tum?.kapsama ?? 0), belirsiz: true };
}

const round = (x: number) => Math.round(x * 100) / 100;

function readJson<T>(path: string, fallback: T): T {
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as T) : fallback;
}

// ---------------------------------------------------------------------------------------------------
// Claude: yalnız kuralın belirsiz bıraktığı birimler, kitap başına tek çağrı.

const CevapSchema = z.object({
  eslemeler: z.array(z.object({ sira: z.number().int(), konu: z.string().nullable() })),
});

async function claudeSor(
  book: TruthBook,
  birimler: { sira: number; baslik: string }[],
  adaylar: Dugum[],
): Promise<{ kararlar: Map<number, string | null>; input: number; output: number }> {
  const client = new Anthropic();
  const liste = adaylar
    .filter((d) => d.duzey !== 'ders')
    .map((d) => `${d.anahtar} | ${d.ad}${d.ipucu ? ` (${d.ipucu})` : ''}`)
    .join('\n');
  const prompt = `Bir YKS ${book.sinav} ${book.ders} kitabının bazı bölüm başlıklarını MEB müfredatı konu listesine eşle.
Her bölüm için listedeki en uygun tek konu anahtarını seç. Bölüm birden çok konuyu kapsıyorsa hepsini kapsayan
üniteyi, o da yoksa bölümün ağırlıklı konusunu seç. Listede karşılığı olmayan bölüm (ör. karma deneme, çıkmış
sorular, müfredat dışı) için null ver. Yalnız listedeki anahtarları kullan.

Konu listesi (anahtar | ad (ipucu)):
${liste}

Bölümler (sıra: başlık):
${birimler.map((b) => `${b.sira}: ${b.baslik}`).join('\n')}`;
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    output_config: { format: zodOutputFormat(CevapSchema) },
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    throw new Error(`Claude çıktı vermedi: ${response.stop_reason}`);
  }
  const gecerli = new Set(adaylar.map((d) => d.anahtar));
  const kararlar = new Map<number, string | null>();
  for (const e of response.parsed_output.eslemeler) {
    kararlar.set(e.sira, e.konu !== null && gecerli.has(e.konu) ? e.konu : null);
  }
  return {
    kararlar,
    input: response.usage.input_tokens,
    output: response.usage.output_tokens,
  };
}

// ---------------------------------------------------------------------------------------------------

async function main() {
  const { values } = parseArgs({
    options: {
      claude: { type: 'boolean', default: false },
      rapor: { type: 'boolean', default: false },
    },
  });
  if (values.claude) process.loadEnvFile('.env');

  const dugumler = flatten();
  const byKey = new Map(dugumler.map((d) => [d.anahtar, d]));
  const truth = JSON.parse(readFileSync('data-private/meb-ogm/truth.json', 'utf8')) as TruthBook[];
  const claudePath = `${DIR}/claude-kararlari.json`;
  const claudeKararlari = readJson<Record<string, Karar>>(claudePath, {});
  const elle = readJson<Record<string, Karar>>(`${DIR}/elle-kararlar.json`, {});
  let input = 0;
  let output = 0;
  let calls = 0;

  const kitaplar: Record<string, Esleme[]> = {};
  for (const book of truth) {
    const dersler = DERS_ADAY[book.ders];
    if (dersler === undefined) throw new Error(`Bilinmeyen ders: ${book.ders}`);
    const adayDugum = dugumler.filter((d) => dersler.includes(d.anahtar.split('/')[0]!));
    const adaylar: Aday[] = adayDugum
      .filter((d) => d.duzey !== 'ders')
      .map((d) => ({ dugum: d, ad: tokens(d.ad), hepsi: tokens(`${d.ad} ${d.ipucu}`) }));

    const sonuc: Esleme[] = book.birimler.map((b) => ({
      sira: b.sira,
      ...(adaylar.length > 0
        ? eslestir(b.baslik, adaylar, book.sinav, byKey)
        : { konu: null, yontem: 'eslesmedi' as const, skor: 0 }),
    }));

    const sorulacak = book.birimler.filter((b) => {
      const s = sonuc.find((x) => x.sira === b.sira)!;
      const k = `${book.id}:${b.sira}`;
      return s.belirsiz && adaylar.length > 0 && !(k in claudeKararlari) && !(k in elle);
    });
    if (values.claude && sorulacak.length > 0) {
      const r = await claudeSor(book, sorulacak, adayDugum);
      calls += 1;
      input += r.input;
      output += r.output;
      for (const [sira, konu] of r.kararlar) {
        claudeKararlari[`${book.id}:${sira}`] = { konu, neden: `${MODEL}, ${today()}` };
      }
    }

    for (const s of sonuc) {
      const k = `${book.id}:${s.sira}`;
      const karar = elle[k] ?? claudeKararlari[k];
      if (karar) {
        if (karar.konu !== null && !byKey.has(karar.konu))
          throw new Error(`${k}: bilinmeyen konu ${karar.konu}`);
        s.konu = karar.konu;
        s.yontem = elle[k] ? 'elle' : 'claude';
      }
    }
    kitaplar[book.id] = sonuc;

    if (values.rapor) {
      console.log(`\n## ${book.id}`);
      for (const b of book.birimler) {
        const s = sonuc.find((x) => x.sira === b.sira)!;
        const d = s.konu ? byKey.get(s.konu) : undefined;
        console.log(
          `${String(b.sira).padStart(2)} ${s.belirsiz ? '?' : ' '} ${s.yontem.padEnd(9)} ${s.skor.toFixed(2)}  ${b.baslik}  →  ${s.konu ?? '-'} ${d ? `(${d.ad})` : ''}`,
        );
      }
    }
  }

  if (values.claude) {
    writeFileSync(claudePath, `${JSON.stringify(sortKeys(claudeKararlari), null, 2)}\n`);
    console.error(`Claude: ${calls} çağrı, ${input} girdi / ${output} çıktı token`);
  }

  const hepsi = Object.values(kitaplar).flat();
  const say = (y: Yontem) => hepsi.filter((s) => s.yontem === y).length;
  const ozet = {
    birim: hepsi.length,
    eslenen: hepsi.filter((s) => s.konu !== null).length,
    kural: say('kural') + say('kural-ust'),
    claude: say('claude'),
    elle: say('elle'),
    eslesmedi: hepsi.filter((s) => s.konu === null).length,
    belirsiz: hepsi.filter((s) => s.belirsiz).length,
  };
  writeFileSync(
    `${DIR}/unit-topic-map.json`,
    `${JSON.stringify({ mufredat: 'MEB-2027', ozet, kitaplar }, null, 2)}\n`,
  );
  console.error(JSON.stringify(ozet));
}

const today = () => new Date().toISOString().slice(0, 10);

function sortKeys<T>(o: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })),
  );
}

await main();
