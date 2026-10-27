// Taksonomi araçlarının ortak parçaları: ağacı düzleştirme, kalıcı anahtar ve UUID, Türkçe normalleştirme.

import { createHash } from 'node:crypto';
import { DERSLER, MUFREDAT, type Ders, type Konu } from './meb-2027.ts';

export interface Dugum {
  /** Kalıcı anahtar, ör. "MAT/9.3.2", "TDE/dil-bilgisi/isimler". */
  anahtar: string;
  ust: string | null;
  ders: string;
  ad: string;
  kod: string | null;
  ipucu: string;
  duzey: 'ders' | 'unite' | 'konu';
  /** Kodun başındaki sınıf (9-12); kod sınıf taşımıyorsa null. */
  sinif: number | null;
}

/**
 * catalog-seed.ts ile aynı yöntem: kaynaktan türetilmiş, tekrar üretimde değişmeyen UUID.
 * Birim kimlikleri `unit:<kitap>:<sıra>` anahtarıyla oradan gelir; aynı fonksiyon olmalı.
 */
export function stableUuid(key: string): string {
  const h = createHash('md5').update(`yks-catalog:${key}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

export const topicUuid = (anahtar: string) => stableUuid(`topic:${MUFREDAT}:${anahtar}`);
export const unitUuid = (kitap: string, sira: number) => stableUuid(`unit:${kitap}:${sira}`);

/** Türkçe küçük harf, şapkasız, noktalama yerine boşluk. */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase('tr')
    .replace(/[âà]/g, 'a')
    .replace(/[îì]/g, 'i')
    .replace(/[ûù]/g, 'u')
    .replace(/[’'`´]/g, ' ')
    .replace(/[^a-zçğıöşü0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slug(text: string): string {
  return normalize(text)
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/ /g, '-');
}

const parca = (k: Konu) => k.kod ?? slug(k.ad);

function sinifOf(kod: string | null): number | null {
  const m = kod?.match(/^(9|10|11|12)\./);
  return m ? Number(m[1]) : null;
}

/** Ağacı ebeveyn önce gelecek sırayla düzleştirir. */
export function flatten(dersler: Ders[] = DERSLER): Dugum[] {
  const out: Dugum[] = [];
  for (const d of dersler) {
    out.push({
      anahtar: d.anahtar,
      ust: null,
      ders: d.ad,
      ad: d.ad,
      kod: null,
      ipucu: '',
      duzey: 'ders',
      sinif: null,
    });
    for (const u of d.uniteler) {
      const uKey = `${d.anahtar}/${parca(u)}`;
      out.push({
        anahtar: uKey,
        ust: d.anahtar,
        ders: d.ad,
        ad: u.ad,
        kod: u.kod,
        ipucu: u.ipucu ?? '',
        duzey: 'unite',
        sinif: sinifOf(u.kod),
      });
      for (const k of u.konular ?? []) {
        out.push({
          anahtar: k.kod ? `${d.anahtar}/${k.kod}` : `${uKey}/${slug(k.ad)}`,
          ust: uKey,
          ders: d.ad,
          ad: k.ad,
          kod: k.kod,
          ipucu: k.ipucu ?? '',
          duzey: 'konu',
          sinif: sinifOf(k.kod),
        });
      }
    }
  }
  const seen = new Set<string>();
  for (const n of out) {
    if (seen.has(n.anahtar)) throw new Error(`Tekrarlanan konu anahtarı: ${n.anahtar}`);
    seen.add(n.anahtar);
  }
  return out;
}
