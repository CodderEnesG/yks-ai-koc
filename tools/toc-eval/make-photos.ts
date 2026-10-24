// İçindekiler görüntülerini telefon fotoğrafına benzetir: düşük çözünürlük, eğik tutma, perspektif
// benzeri kayma, bulanıklık, kenara düşen gölge ve JPEG sıkıştırma. Bozulma kitap kimliğinden
// türetilen sabit tohumla üretilir; her koşuda aynı görüntüler çıkar.
//
// Kullanım (kök dizinden): node tools/toc-eval/make-photos.ts
// Girdi: data-private/meb-ogm/toc/<id>.png   Çıktı: data-private/meb-ogm/toc-photo/<id>.jpg

import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DATA_DIR = 'data-private/meb-ogm';
const SOURCE = join(DATA_DIR, 'toc');
const TARGET = join(DATA_DIR, 'toc-photo');

// Kimlikten 0-1 arası tekrarlanabilir sayılar (mulberry32).
function random(seedText: string): () => number {
  let seed = [...seedText].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (r: () => number, min: number, max: number) => min + (max - min) * r();

mkdirSync(TARGET, { recursive: true });
for (const file of readdirSync(SOURCE).filter((f) => f.endsWith('.png'))) {
  const id = file.replace(/\.png$/, '');
  const r = random(id);
  const width = Math.round(between(r, 900, 1200)); // telefonun kırptığı sayfa genişliği
  const angle = between(r, -5, 5) * (r() < 0.5 ? 1 : -1);
  const skew = between(r, -0.04, 0.04); // perspektif yerine yatay kayma
  const blur = between(r, 0.6, 1.4);
  const shadowSide = r() < 0.5 ? 'left' : 'right';

  const base = await sharp(join(SOURCE, file))
    .resize({ width })
    .affine([1, skew, 0, 1], { background: '#d8d4cc' })
    .rotate(angle, { background: '#d8d4cc' })
    .blur(blur)
    .modulate({ brightness: between(r, 0.85, 1.0) })
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = base.info;
  // Elin ya da telefonun düşürdüğü gölge: bir kenardan içeri koyulaşan yarı saydam degrade.
  const x1 = shadowSide === 'left' ? '0' : '1';
  const x2 = shadowSide === 'left' ? '0.45' : '0.55';
  const shadow = Buffer.from(
    `<svg width="${w}" height="${h}"><defs><linearGradient id="g" x1="${x1}" x2="${x2}" y1="0" y2="0.3">` +
      `<stop offset="0" stop-color="black" stop-opacity="${between(r, 0.25, 0.45).toFixed(2)}"/>` +
      `<stop offset="1" stop-color="black" stop-opacity="0"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );

  await sharp(base.data)
    .composite([{ input: shadow }])
    .jpeg({ quality: Math.round(between(r, 45, 65)) })
    .toFile(join(TARGET, `${id}.jpg`));
}
console.log(`${readdirSync(TARGET).length} fotoğraf benzeri görüntü: ${TARGET}`);
