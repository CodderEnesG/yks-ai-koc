// PII ayıklayıcı (değişmez kural: LLM'e kişisel veri ayıklanmadan gitmez; rapor 2.9). Ad, e-posta,
// telefon, okul ve şehir LLM isteğinden önce köşeli etiketle değiştirilir. Kural tabanlı ve temkinli:
// fazla maskelemek az maskelemekten iyidir. Bilinen sınır: cümle içinde bağlamsız geçen bir ad ("dün
// Ayşe aradı") yakalanmaz; yalnız "adım …", "… hoca" gibi kalıplar. Sohbette (T17) genişletilecek.

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
const HANDLE = /(^|\s)@[\w.]{2,}/g;
// 05xx xxx xx xx, +90 ile ya da boşluksuz; 10 haneden uzun her rakam dizisi (TC kimlik dahil).
const PHONE = /(?:\+?90[\s-]?)?\(?0?5\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;
const LONG_NUMBER = /\d(?:[\s-]?\d){9,}/g;
const SCHOOL =
  /(?:\p{Lu}[\p{L}.]*\s+){1,4}(?:Lisesi|Koleji|Kolejleri|Ortaokulu|Okulu|Okulları|Dershanesi|Kursu|Kursları|Etüt Merkezi|Üniversitesi)(?:['’][\p{L}]+)?/gu;
// "adım Ayşe", "ismim Ayşe Yılmaz"; ad büyük harfle başlar.
const NAME_BEFORE =
  /((?:^|\s)(?:[Aa]dım|[İi]smim|[Aa]dı|[İi]smi)\s+)\p{Lu}\p{Ll}+(?:\s+\p{Lu}\p{Ll}+)?/gu;
// "Ahmet hoca", "Ayşe Hanım", "Mehmet abi".
const NAME_AFTER =
  /\p{Lu}\p{Ll}+(?=\s+(?:[Hh]oca|[Hh]ocam|[Hh]ocanın|[Hh]ocaya|[Öö]ğretmen|[Bb]ey|[Hh]anım|[Aa]bi|[Aa]bla)\b)/gu;

// 81 il ve yaygın kısa adlar. Sıradan sözcükle karışanlar yalnız büyük harfle başlıyorsa maskelenir.
// prettier-ignore
const CITIES = [
  'adana', 'adıyaman', 'afyonkarahisar', 'afyon', 'ağrı', 'amasya', 'ankara', 'antalya', 'artvin',
  'aydın', 'balıkesir', 'bilecik', 'bingöl', 'bitlis', 'bolu', 'burdur', 'bursa', 'çanakkale',
  'çankırı', 'çorum', 'denizli', 'diyarbakır', 'edirne', 'elazığ', 'erzincan', 'erzurum', 'eskişehir',
  'gaziantep', 'antep', 'giresun', 'gümüşhane', 'hakkari', 'hatay', 'ısparta', 'mersin', 'istanbul',
  'izmir', 'kars', 'kastamonu', 'kayseri', 'kırklareli', 'kırşehir', 'kocaeli', 'izmit', 'konya',
  'kütahya', 'malatya', 'manisa', 'kahramanmaraş', 'maraş', 'mardin', 'muğla', 'muş', 'nevşehir',
  'niğde', 'ordu', 'rize', 'sakarya', 'adapazarı', 'samsun', 'siirt', 'sinop', 'sivas', 'tekirdağ',
  'tokat', 'trabzon', 'tunceli', 'şanlıurfa', 'urfa', 'uşak', 'van', 'yozgat', 'zonguldak', 'aksaray',
  'bayburt', 'karaman', 'kırıkkale', 'batman', 'şırnak', 'bartın', 'ardahan', 'ığdır', 'yalova',
  'karabük', 'kilis', 'osmaniye', 'düzce',
];
// Karşılaştırma için: Türkçe küçük harf, ı/i ayrımı yok ("Isparta", "isparta", "ISPARTA" aynı).
const fold = (word: string) => word.toLocaleLowerCase('tr').replace(/ı/g, 'i');
const CITY_SET = new Set(CITIES.map(fold));
const AMBIGUOUS_CITIES = new Set(
  ['ağrı', 'ordu', 'tokat', 'van', 'muş', 'batman', 'kars', 'bolu'].map(fold),
);
// Sözcük + isteğe bağlı kesme işaretli ek ("İzmir'de").
const WORD = /\p{L}+(?:['’]\p{L}+)?/gu;

function maskCities(text: string): string {
  return text.replace(WORD, (token) => {
    const base = token.split(/['’]/)[0]!;
    const key = fold(base);
    if (!CITY_SET.has(key)) return token;
    if (AMBIGUOUS_CITIES.has(key) && !/^\p{Lu}/u.test(base)) return token;
    return '[şehir]';
  });
}

export function maskPii(text: string): string {
  return maskCities(
    text
      .replace(EMAIL, '[e-posta]')
      .replace(HANDLE, '$1[kullanıcı]')
      .replace(PHONE, '[telefon]')
      .replace(LONG_NUMBER, '[numara]')
      .replace(SCHOOL, '[okul]')
      .replace(NAME_BEFORE, '$1[ad]')
      .replace(NAME_AFTER, '[ad]'),
  );
}
