// Eşleştirme için metin normalizasyonu (rapor 2.10 katman 1: yazım varyantları ve ı/i). Liste ifadeleri
// ve öğrenci mesajı aynı fonksiyondan geçer; ikisi de aynı biçime iner, eşleşme bu biçimde yapılır.

// Rakam ve sembolle yazılan harfler ("0lmek", "$ınav").
const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
};

/**
 * Küçük harf, Türkçe karakterler ASCII'ye katlanır (ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u), rakam-harf
 * değişimleri çözülür, harf dışı her şey boşluk olur, tekrarlanan harfler teke iner ("ölmeeek" → "olmek").
 */
export function normalize(text: string): string {
  return (
    text
      // "İ".toLowerCase() "i̇" (noktalı) verir; önce elle. Intl'e (toLocaleLowerCase('tr')) güvenilmez.
      .replace(/[İI]/g, 'i')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/[013457@$]/g, (c) => LEET[c] ?? c)
      .replace(/[^a-z]+/g, ' ')
      .replace(/([a-z])\1+/g, '$1')
      .trim()
  );
}
