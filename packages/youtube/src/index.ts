// YouTube oynatma listesi yardımcıları (T31): bağımlılıksız, `youtube-import` fonksiyonu ve uygulama
// ortak kullanır. API verisi burada tutulmaz.

// YouTube liste kimlikleri harf, rakam, "-" ve "_"; PL… gibi önekle 13-64 karakter.
const PLAYLIST_ID = /^[A-Za-z0-9_-]{13,64}$/;

/**
 * Yapıştırılan metinden liste kimliği: tam link (`…?list=PL…`, `youtu.be/…?list=…`, `m.youtube.com`,
 * `music.youtube.com`) ya da çıplak kimlik. Liste değilse null.
 */
export function parsePlaylistId(input: string): string | null {
  const text = input.trim();
  if (PLAYLIST_ID.test(text)) return text;
  // URL nesnesine dayanmaz (Hermes ve Deno'da aynı davranış): alan adı ve `list` parametresi.
  const link =
    /^(?:https?:\/\/)?(?:(?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/[^?#\s]*\?([^#\s]*)/i.exec(
      text,
    );
  if (!link) return null;
  for (const pair of link[1]!.split('&')) {
    const [key, value] = pair.split('=');
    if (key === 'list' && value && PLAYLIST_ID.test(value)) return value;
  }
  return null;
}

/** ISO 8601 süre (`PT1H2M3S`, `P1DT2H`) → saniye. Geçersizse null. */
export function parseIsoDuration(iso: string): number | null {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(iso);
  if (!m || iso === 'P' || iso.endsWith('T')) return null;
  const [, d, h, min, s] = m.map((v) => Number(v ?? 0));
  return d! * 86_400 + h! * 3600 + min! * 60 + s!;
}

/** Videonun YouTube'daki adresi ("YouTube'da aç"; rapor 2.8, oynatıcı değiştirilmez). */
export function videoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}
