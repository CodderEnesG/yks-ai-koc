// Aydınlatma ve açık rıza metinleri. YER TUTUCU: gerçek metinler T07'de avukat ön görüşmesinden sonra
// yazılır; herkese açık yayından önce değiştirilmeli. Metin değişince sürüm de değişir (rıza kaydına yazılır).
export const CONSENT_TEXT_VERSION = 'taslak-2026-10-26';

export const NOTICE_PARAGRAPHS = [
  'YKS AI Koç, öğrencinin kendi kitaplarına göre günlük çalışma planı çıkaran bir uygulamadır. 18 yaşından küçük kullanıcıların verisi, veli onayı gelmeden sunucularımıza gönderilmez; o süre boyunca plan yalnız öğrencinin telefonunda çalışır.',
  "Onay verirseniz: öğrencinin planı, kitap listesi ve günlük check-in kayıtları yedek amacıyla Supabase'in Frankfurt (AB) sunucularında saklanır. Sohbet mesajları ve kitap içindekiler fotoğrafları, ad, e-posta, telefon, okul ve şehir bilgileri ayıklandıktan sonra yanıt üretmek için Anthropic'in (ABD) Claude modeline gönderilir. İçindekiler fotoğrafları saklanmaz.",
  'Sohbet içeriği hiçbir zaman velilere gösterilmez. Haftalık veli raporu yalnız çalışma günlerini, kitap ilerlemesini ve seriyi içerir.',
  'Onayınızı bu sayfadan istediğiniz zaman geri çekebilirsiniz. Geri çekildiğinde öğrencinin sunucudaki hesabı ve verisi silinir; onay kayıtları (metin sürümü, zaman, doğrulama özeti) ispat için saklanır.',
];

export const AI_CONSENT =
  'Öğrencinin verisinin yukarıda anlatıldığı şekilde saklanmasına ve AI sohbet ile içindekiler okuma için yurt dışına (Anthropic, ABD) aktarılmasına açık rıza veriyorum.';

export const REPORT_CONSENT =
  'Öğrencinin haftalık çalışma özetinin bu e-posta adresine gönderilmesine açık rıza veriyorum (isteğe bağlı).';
