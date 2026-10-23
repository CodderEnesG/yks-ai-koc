// MEB OGM kitaplarından içindekiler doğru cevabını ve içindekiler sayfasının görüntüsünü çıkarır.
// T05 (içindekiler okuma doğruluğu) ve T12 (katalog tohumu) için. Çıktılar `data-private/`'a
// yazılır ve commit edilmez: ham başlıklar ve sayfa görüntüleri telifli içeriktir.
//
// Kullanım (kök dizinden, Node 22+, poppler: `brew install poppler`):
//   node tools/toc-eval/extract-truth.ts
//
// Girdi:  data-private/meb-ogm/<id>.pdf (indirme: README), tools/toc-eval/truth-overrides.json
// Çıktı:  data-private/meb-ogm/truth.json, data-private/meb-ogm/toc/<id>.png

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface Source {
  id: string;
  seri: string;
  sinav: string;
  ders: string;
  pdf: string;
}

interface TruthUnit {
  /** Konuma göre sıra (1'den). */
  sira: number;
  /** İçindekilerde basılı numara; numarasız içindekilerde null. */
  basiliSira: number | null;
  baslik: string;
  /** Basılı sayfa numaraları (öğrencinin gördüğü). PDF sayfası = basılı + `pdfKaymasi`. */
  sayfaBas: number;
  sayfaSon: number;
  /** Başlık, başlangıç sayfasının üst kısmında da geçiyor mu (bağımsız kontrol). */
  dogrulandi: boolean;
}

interface TruthBook extends Omit<Source, 'pdf'> {
  pdfSayfa: number;
  /** PDF sayfa numarası - basılı sayfa numarası; ölçülemezse null. */
  pdfKaymasi: number | null;
  isbn: string | null;
  /** İçindekilerin PDF sayfası. */
  tocSayfa: number | null;
  cevapAnahtariSayfa: number | null;
  birimler: TruthUnit[];
  /** Çıkarma başarısız: araç düzeltilmeli. */
  sorunlar: string[];
  /** Kitabın kendi içindekilerindeki hatalar. Elle doğrulananlar overrides dosyasıyla düzeltilir. */
  kaynakHatalari: string[];
}

interface BookOverride {
  pdfKaymasi?: { deger: number; kanit: string };
  birimler?: Record<string, { sayfaBas: number; kanit: string }>;
}
type Overrides = Record<string, BookOverride>;

const DATA_DIR = 'data-private/meb-ogm';
const TOOL_DIR = 'tools/toc-eval';
const TOC_SEARCH_PAGES = 16;
// Basılı numarası okunacak örnek sayfalar (ön sayfalardan sonra).
const OFFSET_SAMPLE_PAGES = [20, 30, 40, 50, 60];
// "12. Başlık ........ 77" ya da "Cevap Anahtarı ..... 126"
const ENTRY_RE = /^\s*(?:(\d{1,3})\.\s+)?(.+?)\s*(?:\.{2,}|…)[.\s…]*?(\d{1,4})\s*$/;

// Başlığın ilk karakterleri sayfanın üst kısmında aranır; yazım farklarına (ör. "Tür"/"Türler") takılabilir.
const VERIFY_KEY_CHARS = 18;
const VERIFY_HEAD_CHARS = 800;

function normalize(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function pdftotext(file: string, page: number, layout = true): string {
  const args = ['-f', String(page), '-l', String(page), ...(layout ? ['-layout'] : []), file, '-'];
  return execFileSync('pdftotext', args, { encoding: 'utf8' });
}

function pageCount(file: string): number {
  const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
  return Number(/Pages:\s+(\d+)/.exec(info)?.[1] ?? 0);
}

// Sayfanın altındaki tek başına duran numara çoğunlukla basılı sayfa numarasıdır; soru numarası da
// olabileceği için birkaç sayfadan ölçülür ve en az üç sayfanın uyuştuğu değer alınır.
function pdfOffset(file: string, pdfSayfa: number): number | null {
  const votes = new Map<number, number>();
  for (const page of OFFSET_SAMPLE_PAGES.filter((p) => p <= pdfSayfa)) {
    const lines = pdftotext(file, page, false).split('\n');
    const printed = lines
      .map((l) => /^\s*(\d{1,4})\s*$/.exec(l)?.[1])
      .filter(Boolean)
      .at(-1);
    if (printed) votes.set(page - Number(printed), (votes.get(page - Number(printed)) ?? 0) + 1);
  }
  const [best] = [...votes].sort((a, b) => b[1] - a[1]);
  return best && best[1] >= 3 ? best[0] : null;
}

function extract(source: Source, overrides: Overrides): TruthBook {
  const file = join(DATA_DIR, `${source.id}.pdf`);
  const pdfSayfa = pageCount(file);
  const override = overrides[source.id] ?? {};
  const pdfKaymasi = override.pdfKaymasi?.deger ?? pdfOffset(file, pdfSayfa);
  const sorunlar: string[] = [];
  const kaynakHatalari: string[] = [];
  if (override.pdfKaymasi) kaynakHatalari.push(`kayma elle girildi: ${override.pdfKaymasi.kanit}`);
  let isbn: string | null = null;
  let tocSayfa: number | null = null;

  for (let page = 1; page <= Math.min(TOC_SEARCH_PAGES, pdfSayfa); page++) {
    const text = pdftotext(file, page, false);
    isbn ??= /ISBN[\s:]*([0-9][0-9-]{11,16}[0-9Xx])/.exec(text)?.[1] ?? null;
    if (tocSayfa === null && /İÇİNDEKİLER|^\s*CONTENTS?\s*$/im.test(text)) tocSayfa = page;
  }
  const book = { ...meta(source), pdfSayfa, pdfKaymasi, isbn, tocSayfa };
  if (tocSayfa === null) {
    sorunlar.push('içindekiler sayfası bulunamadı');
    return { ...book, cevapAnahtariSayfa: null, birimler: [], sorunlar, kaynakHatalari };
  }

  const entries: { sira: number | null; baslik: string; sayfa: number }[] = [];
  for (const line of pdftotext(file, tocSayfa).split('\n')) {
    const m = ENTRY_RE.exec(line);
    if (!m) continue;
    entries.push({
      sira: m[1] ? Number(m[1]) : null,
      baslik: m[2]!.replace(/[.\s]+$/, ''),
      sayfa: Number(m[3]),
    });
  }

  const answerKey = entries.find((e) => /cevap anahtar|answer key/i.test(e.baslik));
  const candidates = entries.filter(
    (e) => e !== answerKey && !/kaynakça|sözlük|bibliography/i.test(e.baslik),
  );
  // Numaralı içindekilerde yalnız numaralı satırlar birimdir; numarasızlarda (Konu Pekiştirme) hepsi.
  // "20. Yüzyıl Felsefesi" gibi başlıklar numara sanılmasın: satırların çoğu numaralıysa numaralı mod.
  const numbered = candidates.filter((e) => e.sira !== null).length * 2 >= candidates.length;
  const units = numbered ? candidates.filter((e) => e.sira !== null) : candidates;

  // Elle doğrulanmış düzeltmeler (kitabın içindekilerinde yanlış yazan sayfalar).
  const fixes = override.birimler ?? {};
  const starts = units.map((e, i) => fixes[String(i + 1)]?.sayfaBas ?? e.sayfa);
  for (const [sira, fix] of Object.entries(fixes)) {
    kaynakHatalari.push(`${sira}. birim elle düzeltildi: ${fix.kanit}`);
  }

  const lastPrinted = pdfSayfa - (pdfKaymasi ?? 0);
  const birimler = units.map((e, i): TruthUnit => {
    const next = starts[i + 1] ?? answerKey?.sayfa ?? lastPrinted + 1;
    return {
      sira: i + 1,
      basiliSira: numbered ? e.sira : null,
      baslik: numbered || e.sira === null ? e.baslik : `${e.sira}. ${e.baslik}`,
      sayfaBas: starts[i]!,
      sayfaSon: next - 1,
      dogrulandi: false,
    };
  });

  // Kod doğrulaması (rapor 2.8 ile aynı kurallar): numaralar ardışık, sayfalar artan, son sayfa kitapta.
  // Uygulamada bunlar öğrencinin onay ekranında düzeltmesi gereken durumlardır.
  for (const b of birimler) {
    if (b.basiliSira !== null && b.basiliSira !== b.sira) {
      kaynakHatalari.push(`${b.sira}. birimin basılı numarası ${b.basiliSira}`);
    }
    if (b.sayfaSon < b.sayfaBas) {
      kaynakHatalari.push(`${b.sira}. birimde sayfa artmıyor (${b.sayfaBas})`);
    }
  }
  if (pdfKaymasi !== null) {
    for (const b of birimler) {
      const head = normalize(pdftotext(file, b.sayfaBas + pdfKaymasi, false));
      b.dogrulandi = head
        .slice(0, VERIFY_HEAD_CHARS)
        .includes(normalize(b.baslik).slice(0, VERIFY_KEY_CHARS));
    }
  }
  if (birimler.length === 0) sorunlar.push('birim çıkarılamadı');
  if ((birimler.at(-1)?.sayfaSon ?? 0) > lastPrinted) sorunlar.push('son sayfa kitabın dışında');
  if (pdfKaymasi === null) sorunlar.push('basılı sayfa kayması ölçülemedi');

  mkdirSync(join(DATA_DIR, 'toc'), { recursive: true });
  execFileSync('pdftoppm', [
    ...['-f', String(tocSayfa), '-l', String(tocSayfa), '-r', '150', '-png', '-singlefile'],
    ...[file, join(DATA_DIR, 'toc', source.id)],
  ]);

  return {
    ...book,
    cevapAnahtariSayfa: answerKey?.sayfa ?? null,
    birimler,
    sorunlar,
    kaynakHatalari,
  };
}

function meta({ id, seri, sinav, ders }: Source): Omit<Source, 'pdf'> {
  return { id, seri, sinav, ders };
}

const { kitaplar } = JSON.parse(readFileSync(join(TOOL_DIR, 'meb-ogm-sources.json'), 'utf8')) as {
  kitaplar: Source[];
};
const overrides = JSON.parse(
  readFileSync(join(TOOL_DIR, 'truth-overrides.json'), 'utf8'),
) as Overrides;
const books = kitaplar.filter((s) => {
  const ok = existsSync(join(DATA_DIR, `${s.id}.pdf`));
  if (!ok) console.warn(`eksik PDF: ${s.id}`);
  return ok;
});
const truth = books.map((b) => extract(b, overrides));
writeFileSync(join(DATA_DIR, 'truth.json'), JSON.stringify(truth, null, 2));

for (const b of truth) {
  const status = [
    b.sorunlar.length ? `SORUN: ${b.sorunlar.join('; ')}` : 'tamam',
    b.kaynakHatalari.length ? `KİTAPTA: ${b.kaynakHatalari.join('; ')}` : '',
  ].join('  ');
  const columns = [
    b.id.padEnd(30),
    `toc s.${String(b.tocSayfa).padEnd(3)}`,
    `kayma ${String(b.pdfKaymasi).padStart(2)}`,
    `${String(b.birimler.length).padStart(3)} birim`,
    `isbn ${b.isbn ?? '-'}`,
  ];
  console.log(`${columns.join('  ')}  ${status}`);
}
const ok = truth.filter((b) => b.sorunlar.length === 0).length;
const units = truth.reduce((a, b) => a + b.birimler.length, 0);
const withErrors = truth.filter((b) => b.kaynakHatalari.length > 0).length;
const unverified = truth.flatMap((b) =>
  b.birimler
    .filter((u) => !u.dogrulandi)
    .map((u) => `${b.id} #${u.sira} s.${u.sayfaBas} ${u.baslik}`),
);
writeFileSync(join(DATA_DIR, 'elle-bakilacak.txt'), unverified.join('\n') + '\n');
console.log(
  `\n${ok}/${truth.length} kitap çıkarıldı, ${units} birim (${units - unverified.length} sayfada doğrulandı); ` +
    `${withErrors} kitapta içindekiler hatası. Doğrulanamayanlar: ${DATA_DIR}/elle-bakilacak.txt`,
);
