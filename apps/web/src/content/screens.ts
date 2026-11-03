import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { ScreenFiles, ScreenKey } from './screen-keys';

// Yalnız sunucu: gerçek ekran görüntüleri `public/ekran/` altına kullanıcı tarafından konur (adlar
// PLAN-2026-11-03'te): `bugun-acik.png`, `bugun-koyu.png` gibi. Derlemede klasör okunur; olmayan ekranın yerine
// kodla yapılmış taklit gösterilir. Görüntülerde kişisel veri, kitap kapağı, sayfa görüntüsü ve gerçek yayınevi
// içindekiler olmaz.

const FILE_RE = /^(bugun|checkin|kutuphane|sohbet|ayarlar)-(acik|koyu)\.(png|webp|jpe?g)$/;

export function availableScreens(): ScreenFiles {
  let files: string[] = [];
  try {
    files = readdirSync(join(process.cwd(), 'public', 'ekran'));
  } catch {
    return {};
  }
  const out: ScreenFiles = {};
  for (const name of files) {
    const m = FILE_RE.exec(name);
    if (!m) continue;
    const key = m[1] as ScreenKey;
    const theme = m[2] as 'acik' | 'koyu';
    out[key] = { ...out[key], [theme]: `/ekran/${name}` };
  }
  return out;
}
