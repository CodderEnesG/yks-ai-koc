// Konu taksonomisi ve birim eşlemesinden migration üretir (T12).
//
// Kullanım (kök dizinden): node tools/taxonomy/seed-sql.ts > supabase/migrations/<zaman>_topic_taxonomy.sql
// Girdi:  meb-2027.ts (taksonomi), unit-topic-map.json (match.ts çıktısı; başlık içermez)
// Çıktı:  public.topic satırları (ders → ünite → konu, ebeveyn önce) ve public.unit.topic_id güncellemesi.
//
// Kimlikler kaynaktan türetilir (lib.ts stableUuid; catalog-seed.ts ile aynı): yeniden üretimde değişmez.
// Ham kitap başlığı yok (değişmez kural); yalnız resmî müfredat adları ve birim → konu bağı.
// Sınav ağırlığı resmî kaynakta konu düzeyinde yok: exam_weight null (NOT DEFINED).
import { readFileSync } from 'node:fs';

import { flatten, topicUuid, unitUuid } from './lib.ts';
import { MUFREDAT } from './meb-2027.ts';

interface Eslesme {
  sira: number;
  konu: string | null;
}

const map = JSON.parse(readFileSync('tools/taxonomy/unit-topic-map.json', 'utf8')) as {
  mufredat: string;
  kitaplar: Record<string, Eslesme[]>;
};
if (map.mufredat !== MUFREDAT) throw new Error(`Müfredat uyuşmuyor: ${map.mufredat}`);

const quote = (v: string | null) => (v === null ? 'null' : `'${v.replaceAll("'", "''")}'`);
const nodes = flatten();
const known = new Set(nodes.map((n) => n.anahtar));

const out: string[] = [
  '-- Konu taksonomisi v1 (MEB-2027) ve MEB OGM katalog birimlerinin konulara eşlenmesi (T12).',
  '-- tools/taxonomy/seed-sql.ts ile üretildi; elle düzenlenmez. Kaynak ve yöntem: tools/taxonomy/README.md.',
  '-- Ham kitap başlığı yok; yalnız resmî müfredat adları. exam_weight resmî kaynakta yok (NOT DEFINED).',
  '',
  'insert into public.topic (id, curriculum, subject, parent_id, name, meb_code, exam_weight) values',
  nodes
    .map(
      (n) =>
        `  (${quote(topicUuid(n.anahtar))}, ${quote(MUFREDAT)}, ${quote(n.ders)}, ${quote(
          n.ust === null ? null : topicUuid(n.ust),
        )}, ${quote(n.ad)}, ${quote(n.kod)}, null)`,
    )
    .join(',\n') + ';',
  '',
];

const pairs = Object.entries(map.kitaplar)
  .sort(([a], [b]) => a.localeCompare(b, 'en'))
  .flatMap(([kitap, birimler]) =>
    birimler.flatMap((b) => {
      if (b.konu === null) return [];
      if (!known.has(b.konu)) throw new Error(`Bilinmeyen konu ${b.konu} (${kitap}:${b.sira})`);
      return [`  (${quote(unitUuid(kitap, b.sira))}::uuid, ${quote(topicUuid(b.konu))}::uuid)`];
    }),
  );

out.push(
  `-- ${pairs.length} birim eşlendi; eşlenemeyenler topic_id = null kalır (README).`,
  'update public.unit u set topic_id = m.topic_id',
  'from (values',
  pairs.join(',\n'),
  ') as m (unit_id, topic_id)',
  'where u.id = m.unit_id;',
  '',
);

process.stdout.write(out.join('\n'));
