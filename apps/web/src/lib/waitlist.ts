// Bekleme listesi aydınlatma metni. YER TUTUCU: gerçek metin T07'de avukat ön görüşmesinden sonra yazılır; form
// (`NEXT_PUBLIC_WAITLIST_OPEN=1`) ancak o zaman açılır. Metin değişince sürüm de değişir (kayda yazılır).
export const WAITLIST_NOTICE_VERSION = 'taslak-2026-11-03';

export const WAITLIST_NOTICE = [
  'E-posta adresin, seçtiğin rol ve sınıf yalnız beta davetini göndermek ve ilk kullanıcıları planlamak için Supabase’in Frankfurt (AB) sunucularında saklanır. Kimseyle paylaşılmaz, reklam için kullanılmaz.',
  'Kötüye kullanımı önlemek için IP adresin açık tutulmaz; günlük değişen bir anahtarla özetlenir ve iki gün sonra silinir.',
  '18 yaşından küçük öğrencilerin e-postası alınmaz; onların yerine velisi kaydolur.',
  'Listeden çıkmak için iletişim adresimize yazman yeterli.',
];

export const WAITLIST_OPEN = process.env.NEXT_PUBLIC_WAITLIST_OPEN === '1';

export type WaitlistRole = 'ogrenci_18' | 'veli' | 'ogretmen';
export type WaitlistGrade = '11' | '12' | 'mezun';
