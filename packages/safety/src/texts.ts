// Sabit metinler (rapor 2.10 katman 3). Akut riskte LLM yanıt üretmez, bunlar gösterilir. Sunucu ve
// uygulama aynı metni kullanır.
//
// YER TUTUCU: PDR ya da klinik bir danışman yazılı olarak onaylamadan herkese açık yayın yapılmaz
// (değişmez kural). Onaylanınca metin değişir, sürüm artar ve PDR_APPROVED true olur.
export const SAFETY_TEXT_VERSION = 'taslak-2026-10-26';
export const PDR_APPROVED = false;

export interface HelpLine {
  name: string;
  /** Aranacak numara (tel: linki). */
  phone: string;
  description: string;
}

export const HELP_LINES: readonly HelpLine[] = [
  {
    name: '112 Acil Çağrı',
    phone: '112',
    description: 'Hemen tehlikedeysen ya da biri tehlikedeyse.',
  },
  {
    name: 'ALO 183 Sosyal Destek Hattı',
    phone: '183',
    description: 'Şiddet, istismar ya da zor bir durum için; ücretsiz.',
  },
];

/** Akut risk: sohbette koçun yerine gösterilen tek yanıt. */
export const ACUTE_RESPONSE =
  'Yazdıkların beni endişelendirdi ve bunu ciddiye alıyorum. Şu an güvende değilsen hemen 112’yi ara. ' +
  'Konuşmak için ALO 183 Sosyal Destek Hattı’nı arayabilirsin. Güvendiğin bir yetişkinle ya da okulundaki ' +
  'rehber öğretmenle konuş; yalnız değilsin.';

/** Destek ekranının girişi (akut ve yüksek riskte, öğrenci kendisi açtığında da). */
export const SUPPORT_INTRO =
  'Zor bir an yaşıyor olabilirsin. Bunu biriyle paylaşmak işe yarar. Aşağıdaki hatlar ücretsiz; ' +
  'güvendiğin bir yetişkine ya da rehber öğretmenine de haber verebilirsin.';

/** Yalnız sınav deyimi ("bu sınav beni öldürecek"): alarm yerine nazik kontrol sorusu. */
export const CHECK_QUESTION =
  'Bunu bir deyim olarak mı söyledin, yoksa gerçekten kendini çok kötü mü hissediyorsun? ' +
  'İkisi de olabilir; nasıl olduğunu yazabilirsin.';

/** Çıktı denetimi bir ihlal bulunca LLM yanıtının yerine. */
export const OUTPUT_FALLBACK =
  'Bu konuda sana doğru bir şey söyleyemem. İstersen planına birlikte bakalım. Kendini kötü ' +
  'hissediyorsan Ayarlar’daki Destek bölümünde konuşabileceğin yerler var.';

/** Sınıflandırıcı çalışmadığında: mesaj LLM'e gitmez. */
export const UNAVAILABLE_RESPONSE =
  'Şu an yanıt veremiyorum, biraz sonra tekrar dener misin? Kendini kötü hissediyorsan Ayarlar’daki ' +
  'Destek bölümüne bakabilirsin.';

/**
 * "Velime/rehberime haber ver" (rapor 2.10 katman 3): öğrencinin kendi telefonundan, kendi seçtiği
 * kişiye gönderdiği mesaj. Sunucu bir şey göndermez; akut riskte veliye otomatik bildirim açık karar 7.
 */
export const NOTIFY_MESSAGE =
  'Merhaba, şu an zor bir an yaşıyorum ve biriyle konuşmaya ihtiyacım var. Müsait olunca bana ulaşabilir misin?';
