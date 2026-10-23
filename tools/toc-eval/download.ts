// MEB OGM YKS kitaplarının PDF'lerini resmî kaynaktan `data-private/meb-ogm/`'ye indirir.
// İnenler commit edilmez (data-private gitignore'da). Var olan dosyalar atlanır.
//
// Kullanım (kök dizinden, Node 22+): node tools/toc-eval/download.ts

import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const DATA_DIR = 'data-private/meb-ogm';
const { kitaplar } = JSON.parse(readFileSync('tools/toc-eval/meb-ogm-sources.json', 'utf8')) as {
  kitaplar: { id: string; pdf: string }[];
};

mkdirSync(DATA_DIR, { recursive: true });
for (const { id, pdf } of kitaplar) {
  const target = join(DATA_DIR, `${id}.pdf`);
  if (existsSync(target)) continue;
  const response = await fetch(pdf);
  if (!response.ok || !response.body) {
    console.error(`HATA ${id}: ${response.status}`);
    continue;
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(`${target}.part`));
  renameSync(`${target}.part`, target);
  console.log(`indi ${id}`);
}
