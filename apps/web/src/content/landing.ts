// Tanıtım sitesinin metinleri (T40). Kurallar (docs/PLAN-2026-11-03-tanitim-sitesi-t40.md): "lamba" küçük harf;
// uygulamanın kendi dilinde "koç" yok; fiyat, tarih, kullanıcı sayısı vaadi yok; ruh sağlığı vaadi yok (PDR onayı
// gelmedi); yalnız MVP'de olan özellikler. Örnek gün ürün ve iş modeli v1'deki "Elif" akışından; kitap adları
// temsilî. Ton rehberi (T06) gelince gözden geçirilir.

export const hero = {
  kicker: 'lamba · senin YKS yardımcın',
  title: ['Kendi kitaplarınla,', 'her gün ne', 'yapacağını bil.'],
  lead: 'lamba elindeki kitaplara ve izlediğin YouTube listelerine göre her gün sayfa sayfa, test test plan çıkarır. Akşam ne yaptığını sorar; aksayan günü suçlamadan yarına taşır.',
  cta: 'Bekleme listesine katıl',
  secondary: 'Nasıl çalışır',
  hint: 'Kaydır, lamba yansın',
  platform: 'Önce iPhone’da. Android hemen ardından.',
};

export const manifesto = {
  struck: 'Herkese aynı müfredat.',
  answer: ['Senin kitabın.', 'Senin hızın.'],
  body: 'Elindeki kitaplar farklı, yayınevin farklı, hızın farklı. lamba kitabını tanır: kaç sayfa, kaç test, hangi video. Sınava kalan günleri buna göre böler ve her sabah tek bir şey söyler: bugün bu kadar.',
  strip:
    'TYT Matematik · s. 212-221 · Paragraf · Test 14-15 · AYT Fizik · Vektörler · s. 34-41 · Türev 3. ders · 24 dk · Yaptım · Yarım kaldı · Yapamadım · ',
};

export type ScreenKind = 'notification' | 'today' | 'checkin' | 'replan';

export const oneDay = {
  kicker: 'Bir gün',
  title: 'Planı yapmak kolay. Her gün uygulamak zor.',
  chapters: [
    {
      time: '07:30',
      lamp: 'lit',
      title: 'Plan hazır.',
      body: 'Sabah bildirimi gelir: bugün ne kadar, hangi kitaptan. Düşünmeden başlarsın.',
      screen: 'notification',
    },
    {
      time: '16:10',
      lamp: 'lit',
      title: 'Sayfa sayfa, test test.',
      body: 'Her kart bir kitap ya da video: hangi sayfalar, kaç test, ne kadar sürer. Videoyu YouTube’da izlersin, süresi plana girer.',
      screen: 'today',
    },
    {
      time: '21:00',
      lamp: 'low',
      title: 'Bugün nasıl geçti?',
      body: 'Her kart için tek dokunuş: Yaptım, Yarım kaldı, Yapamadım. Yapamadıysan nedenini seçersin. Kimse seni suçlamaz.',
      screen: 'checkin',
    },
    {
      time: '23:30',
      lamp: 'off',
      title: 'Yarın yeniden kurulur.',
      body: 'Kalan sayfalar önümüzdeki günlere yayılır, sınav tarihin kaymaz. Kötü bir gün geçirdiysen plan birkaç gün hafifler.',
      screen: 'replan',
    },
  ] satisfies {
    time: string;
    lamp: 'lit' | 'low' | 'off';
    title: string;
    body: string;
    screen: ScreenKind;
  }[],
};

// Telefondaki taklit ekranların verisi. Süreler ve aralıklar bir arada tutarlı.
export const sample = {
  notification: {
    title: 'Bugünün planı hazır',
    body: '≈ 3 sa 30 dk · 3 kitap · 1 video. Başlamak için dokun.',
  },
  header: { title: 'Bugün', meta: 'Sınava 227 gün · Seri 12' },
  tasks: [
    {
      id: 'mat',
      book: 'TYT Matematik Soru Bankası',
      range: 's. 212-221',
      meta: '2 test · ≈ 60 dk',
    },
    { id: 'par', book: 'Paragraf', range: 'Test 14-15', meta: '≈ 50 dk' },
    { id: 'fiz', book: 'AYT Fizik', range: 's. 34-41', meta: 'Vektörler · ≈ 70 dk' },
  ],
  video: { title: 'Türev 3. ders', list: 'AYT Matematik listesi', meta: '24 dk video · ≈ 30 dk' },
  checkin: {
    done: ['mat', 'par'],
    partial: { id: 'fiz', range: 's. 34-37' },
    reasons: ['Zaman yetmedi', 'Konu zor geldi', 'İsteksizim', 'Kendimi kötü hissediyorum'],
    chosen: 'Konu zor geldi',
  },
  replan: {
    leftover: { book: 'AYT Fizik', range: 's. 38-41', meta: 'Kalan · ≈ 35 dk' },
    days: [
      {
        label: 'Yarın',
        tasks: [
          { id: 'fiz-a', book: 'AYT Fizik', range: 's. 38-39', meta: '≈ 18 dk', moved: true },
          { id: 'mat-2', book: 'TYT Matematik Soru Bankası', range: 's. 222-231', meta: '≈ 60 dk' },
          { id: 'par-2', book: 'Paragraf', range: 'Test 16-17', meta: '≈ 50 dk' },
        ],
      },
      {
        label: 'Perşembe',
        tasks: [
          { id: 'fiz-b', book: 'AYT Fizik', range: 's. 40-41', meta: '≈ 17 dk', moved: true },
        ],
      },
    ],
    note: 'Seri bozulmadı.',
  },
  library: [
    { book: 'TYT Matematik Soru Bankası', progress: 64 },
    { book: 'Paragraf', progress: 38 },
    { book: 'AYT Fizik', progress: 21 },
    { book: 'AYT Matematik listesi', progress: 45, video: true },
  ],
};

export const screensSection = {
  title: 'Uygulamayı açınca bunu göreceksin.',
  body: 'Gerçek ekranlar. Süs yok; her gün baktığın şey bu.',
  captions: {
    bugun: 'Günün planı, kart kart',
    checkin: 'Akşam tek dokunuş',
    kutuphane: 'Kitapların ve listelerin',
    sohbet: 'Takılınca Alaaddin',
    ayarlar: 'Veli onayı ve yedek',
  },
};

export const alaaddin = {
  time: '22:15',
  title: 'Takıldığında Alaaddin’e yaz.',
  body: 'Planını, aksayan günleri, motivasyonunu konuşur. Soru çözmez, konu anlatmaz, senin yerine çalışmaz. İdare de etmez; ama yargılamaz.',
  chat: [
    { from: 'me', text: 'Fizik hiç ilerlemedi bugün, vektörlerde takıldım.' },
    {
      from: 'alaaddin',
      text: 'Olur böyle. Akşam check-in’de “Konu zor geldi” de; kalan sayfalar önümüzdeki günlere yayılır. Bugün bitirdiğin matematik de sayılır.',
    },
  ] satisfies { from: 'me' | 'alaaddin'; text: string }[],
  note: 'Alaaddin bir yapay zekâ. Yazdıkların velinle hiçbir zaman paylaşılmaz.',
};

export const parents = {
  time: 'Pazar 20:00',
  title: ['Çalıştığını görün.', 'Konuştuklarını değil.'],
  body: 'Öğrenci Pazar akşamı haftalık özeti velisine WhatsApp’tan gönderir. Özette çalışılan günler, süre, seri ve kitap ilerlemesi var; sohbet hiçbir zaman yok.',
  points: [
    '18 yaşından küçük öğrencinin verisi, veli onay verene kadar telefondan çıkmaz.',
    'Haftalık rapor için ayrıca onay verirsiniz; vermek zorunda değilsiniz.',
    'Onay, geldiği linkten istediğiniz an geri çekilir.',
  ],
  report: {
    label: 'Örnek rapor',
    title: 'Bu hafta',
    days: [
      { d: 'Pzt', s: 'done' },
      { d: 'Sal', s: 'done' },
      { d: 'Çar', s: 'done' },
      { d: 'Per', s: 'missed' },
      { d: 'Cum', s: 'done' },
      { d: 'Cmt', s: 'done' },
      { d: 'Paz', s: 'rest' },
    ] satisfies { d: string; s: 'done' | 'missed' | 'rest' }[],
    stats: [
      { value: 5, suffix: '/6', label: 'gün tamam' },
      { value: 14, suffix: ' sa', label: 'çalışma' },
      { value: 12, suffix: ' gün', label: 'seri' },
    ],
    books: [
      { book: 'TYT Matematik Soru Bankası', progress: 64 },
      { book: 'Paragraf', progress: 38 },
      { book: 'AYT Fizik', progress: 21 },
    ],
    footer: 'Sohbet bu raporda hiçbir zaman yer almaz.',
  },
};

export const trust = {
  title: 'Neleri yapmıyoruz',
  items: [
    {
      no: 'Soru çözmek.',
      why: 'lamba soru ve çözüm göstermez, konu anlatmaz. Çalışan sensin; lamba ne kadar ve ne zaman çalışacağını tutar.',
    },
    {
      no: 'Kitabının sayfalarını saklamak.',
      why: 'İçindekiler fotoğrafı yalnız bölümleri okumak için kullanılır, sonra silinir.',
    },
    {
      no: 'Sohbetini velinle paylaşmak.',
      why: 'Veli yalnız haftalık özeti görür. Alaaddin’le yazdıkların sende kalır.',
    },
    {
      no: 'Onaysız veri toplamak.',
      why: '18 yaşından küçüksen, velin onay verene kadar planın yalnız senin telefonunda çalışır.',
    },
    {
      no: 'Herkese aynı planı vermek.',
      why: 'Plan senin kitabından, senin hızından ve sınavına kalan günden çıkar.',
    },
  ],
};

export const waitlist = {
  title: 'Betaya ilk sen katıl.',
  body: 'Kapalı betayı küçük bir grupla başlatıyoruz. Yerini ayır; sıra sana gelince e-postayla haber verelim.',
  coaches:
    'Öğretmen ya da koç musun? Öğrencilerinle pilot denemek istersen formda “Öğretmen / koçum”u seç.',
  closed: 'Liste çok yakında açılıyor.',
  closedBody: 'Aydınlatma metnimiz son okumada. Açıldığında bu sayfada olacak.',
  roles: [
    { value: 'ogrenci_18', label: 'Öğrenciyim', hint: '18 yaş ve üstü' },
    { value: 'veli', label: 'Veliyim', hint: 'Çocuğum için' },
    { value: 'ogretmen', label: 'Öğretmen / koçum', hint: 'Pilot için' },
    { value: 'kucuk', label: 'Öğrenciyim', hint: '18 yaşından küçüğüm' },
  ] as const,
  grades: [
    { value: '11', label: '11. sınıf' },
    { value: '12', label: '12. sınıf' },
    { value: 'mezun', label: 'Mezun' },
  ] as const,
  minor: {
    title: 'Senin yerine velin kaydolsun.',
    body: '18 yaşından küçük öğrencilerin e-postasını almıyoruz. Bu sayfayı velinle paylaş; listeye o katılsın. Uygulama açılınca planını hemen kullanabilirsin.',
    share: 'Velime WhatsApp’tan gönder',
    message: 'lamba bekleme listesine benim için katılır mısın?',
  },
  noticeTitle: 'Aydınlatma metni',
  noticeAccept: 'Aydınlatma metnini okudum.',
  submit: 'Listeye katıl',
  done: {
    title: 'Listedesin.',
    body: 'Sıra sana gelince e-postayla haber vereceğiz. Lamba yanık kalsın.',
  },
};

export const footer = {
  slogan: 'senin YKS yardımcın',
  cookies: 'Bu site çerez kullanmaz.',
};
