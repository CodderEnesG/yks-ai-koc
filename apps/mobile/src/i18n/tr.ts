// Uygulama metinleri. MVP yalnız Türkçe; ikinci dil gelirse i18next'e taşınır (TECH-STACK).
function rangeLabel(kind: 'pages' | 'tests' | 'video', first: number, last: number): string {
  const span = first === last ? `${first}` : `${first}-${last}`;
  return kind === 'pages' ? `s. ${span}` : `Test ${span}`;
}

export const tr = {
  common: {
    continue: 'Devam',
    skip: 'Şimdilik geç',
    estimated: 'tahmini',
  },
  months: [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ],
  weekdays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
  onboarding: {
    step: (current: number, total: number) => `Adım ${current}/${total}`,
    welcome: {
      title: 'Planını birlikte kuralım',
      body: 'Birkaç soruyla günlük çalışma planının iskeletini çıkaracağız. Kitaplarını bir sonraki adımda ekleyeceksin.',
      start: 'Başla',
    },
    birth: {
      title: 'Doğum ayın ve yılın',
      subtitle: '18 yaşından küçüksen velinden onay isteyeceğiz. Gün sormuyoruz.',
      month: 'Ay',
      year: 'Yıl',
    },
    grade: {
      title: 'Kaçıncı sınıftasın?',
      options: { '11': '11. sınıf', '12': '12. sınıf', mezun: 'Mezun' },
    },
    field: {
      title: 'Alanın hangisi?',
      options: {
        SAY: { label: 'Sayısal', description: 'Matematik, fizik, kimya, biyoloji' },
        EA: { label: 'Eşit Ağırlık', description: 'Matematik, edebiyat, tarih, coğrafya' },
        SOZ: { label: 'Sözel', description: 'Edebiyat, tarih, coğrafya, felsefe grubu' },
        DIL: { label: 'Dil', description: 'Yabancı dil' },
      },
    },
    target: {
      title: 'Hedefin ne?',
      subtitle: 'Koçun seni buna göre motive eder. Emin değilsen geçebilirsin.',
      kinds: { siralama: 'Sıralama', puan: 'Puan' },
      placeholder: { siralama: 'Örn. 20000', puan: 'Örn. 450' },
      invalid: {
        siralama: '1 ile 3.000.000 arasında bir sıralama gir',
        puan: '100 ile 560 arasında bir puan gir',
      },
    },
    exam: {
      title: 'Sınav tarihin',
      subtitle: 'ÖSYM takvimi açıklanınca tarihi güncelleyeceğiz.',
      change: 'Farklı bir tarih gir',
      useDefault: 'Tahmini tarihi kullan',
      day: 'Gün',
      month: 'Ay',
      year: 'Yıl',
      invalid: 'Geçerli ve ileride bir tarih gir',
      none: 'Tahmini tarih yok; tarihi kendin gir.',
    },
    time: {
      title: 'Günde ne kadar çalışabilirsin?',
      subtitle: 'Gerçekçi ol; plan buna göre kurulur, sonra değiştirebilirsin.',
      weekday: 'Hafta içi',
      weekend: 'Hafta sonu',
      perDay: 'Günleri ayrı ayarla',
      hours: (minutes: number) =>
        minutes === 0
          ? 'Çalışmıyorum'
          : minutes % 60 === 0
            ? `${minutes / 60} saat`
            : `${(minutes / 60).toLocaleString('tr-TR')} saat`,
      atLeastOne: 'En az bir gün çalışma süresi gir',
    },
    done: {
      title: 'Hazırsın',
      daysLeft: (days: number) => `Sınava ${days} gün var.`,
      weeklyHours: (hours: number) => `Haftada ${hours.toLocaleString('tr-TR')} saat çalışacaksın.`,
      minorTitle: 'Veli onayı gerekecek',
      minorBody:
        '18 yaşından küçük olduğun için velinin onayı gelene kadar verilerin yalnız bu telefonda kalır. Planın çalışır; koçla sohbet ve fotoğraf yükleme onaydan sonra açılır.',
      finish: 'Planımı kur',
    },
  },
  today: {
    title: 'Bugün',
    examCountdown: (days: number) => `Sınava ${days} gün`,
    streak: (days: number) => `Seri: ${days} gün`,
    noBooks: 'Planın kitaplarına göre kurulur. İlk kitabını ekle.',
    addBook: 'Kitap ekle',
    restDay: 'Bugün çalışma günün değil. Dinlen.',
    restore: 'Hesabım var, geri yükle',
    nothingLeft: 'Planlanacak iş kalmadı.',
    ranges: (kind: 'pages' | 'tests' | 'video', ranges: { first: number; last: number }[]) =>
      ranges.map((r) => rangeLabel(kind, r.first, r.last)).join(', '),
    units: (n: number) => (n > 1 ? `${n} bölüm` : ''),
    summary: (duration: string, books: number) => `Bugün ≈ ${duration} · ${books} kitap`,
    duration: (seconds: number) => {
      const minutes = Math.max(1, Math.round(seconds / 60));
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return h === 0 ? `${m} dk` : m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
    },
    overload: (units: number) =>
      `Sınava kadar her şey sığmıyor: ${units} bölüm "zaman kalırsa" listesinde. Günlük süreni artırabilir ya da kitap çıkarabilirsin.`,
    unscheduled:
      'Bazı bölümler bir günlük süreden uzun; plana giremedi. Günlük süreni ya da test başı dakikayı gözden geçir.',
    resetDev: 'Kurulumu sıfırla (geliştirme)',
  },
  settings: {
    title: 'Ayarlar',
    morning: 'Sabah bildirimi',
    morningHint: 'Günün planı bu saatte gelir.',
    account: 'Hesap ve yedek',
    accountHint: 'Hesap bağlarsan planın ve ilerlemen yedeklenir; telefon değiştirince geri gelir.',
    connect: 'Hesap bağla',
    connected: (email: string) => `Bağlı: ${email}`,
    lastSync: (time: string) => `Son yedek: ${time}`,
    neverSynced: 'Henüz yedeklenmedi',
    syncNow: 'Şimdi yedekle',
    syncDone: (n: number) => (n === 0 ? 'Yedek güncel' : `${n} kayıt yedeklendi`),
    syncFailed: 'Yedeklenemedi; internet bağlantını kontrol et.',
    signOut: 'Çıkış yap',
    minorPending:
      'Velin onay verene kadar verilerin yalnız bu telefonda kalır. Hesap bağlama onaydan sonra açılır.',
  },
  account: {
    title: 'Hesap bağla',
    restoreTitle: 'Hesabına giriş yap',
    emailLabel: 'E-posta adresin',
    emailPlaceholder: 'ornek@eposta.com',
    // Yer tutucu: aydınlatma ve açık rıza metinleri T07'de (avukat ön görüşmesi). Herkese açık yayından önce
    // gerçek metinle değiştirilmeli.
    consent:
      "Planımın ve ilerlememin yedeklenmek için Supabase'in Frankfurt (AB) sunucularında saklanmasını kabul ediyorum.",
    consentDraft: 'Aydınlatma metni hazırlanıyor (taslak).',
    sendCode: 'Kod gönder',
    codeLabel: (email: string) => `${email} adresine gelen 6 haneli kodu yaz`,
    verify: 'Doğrula',
    resend: 'Kodu yeniden gönder',
    invalidEmail: 'Geçerli bir e-posta adresi yaz',
    failed: 'Olmadı; kodu kontrol edip tekrar dene.',
    noBackup: 'Bu hesapta kayıtlı plan yok; kuruluma başlayalım.',
  },
  notifications: {
    channel: 'Plan hatırlatmaları',
    morningTitle: 'Bugünün planı hazır',
    morningBody: (duration: string, books: number) =>
      `≈ ${duration} · ${books} kitap. Başlamak için dokun.`,
    eveningTitle: 'Bugün nasıl geçti?',
    eveningBody: 'Check-in yap; yarının planı ona göre ayarlanır.',
    lateTitle: 'Check-in bekliyor',
    lateBody: 'Bir dakikanı alır. Yapamadıysan da söyle, planı kaydıralım.',
  },
  checkin: {
    done: 'Yaptım',
    partial: 'Yarım kaldı',
    skip: 'Yapamadım',
    statusDone: '✓ Tamamlandı',
    statusSkipped: 'Yapılmadı',
    statusPartial: (done: string) => `Yarım: ${done} yapıldı`,
    reasonTitle: 'Ne oldu?',
    reasonSubtitle: 'Planı buna göre ayarlayacağız. Yargı yok.',
    reasons: {
      zaman_yetmedi: 'Zaman yetmedi',
      konu_zor: 'Konu zor geldi',
      isteksiz: 'İsteksizim',
      kotu_hissediyorum: 'Kötü hissediyorum',
    },
    // Planın ne yaptığını söyleyen olgusal notlar. Koç tonu ve destek metinleri ton rehberi ve PDR
    // onayıyla gelecek (T06, T18); burada yalnız plan değişikliği anlatılır.
    effects: {
      zaman_yetmedi:
        'Kalan kısmı sonraki günlere dağıttık. Üç gün üst üste olursa günlük yükünü azaltacağız.',
      konu_zor: 'Bu bölüme daha çok zaman ayırdık.',
      isteksiz: 'Yarın en kısa görevle başlayacaksın.',
      kotu_hissediyorum: 'Önümüzdeki üç gün yükün yarıya indi.',
    },
    partialTitle: 'Nereye kadar geldin?',
    partialThrough: (kind: 'pages' | 'tests' | 'video', n: number) =>
      kind === 'pages' ? `${n}. sayfaya kadar` : `${n}. teste kadar`,
    save: 'Kaydet',
    safeMode: 'Hafif mod açık: birkaç gün yükün yarı yarıya.',
    countsTitle: 'Bugün çözdüğün sorular (isteğe bağlı)',
    correct: 'Doğru',
    wrong: 'Yanlış',
    countsSaved: (c: number, w: number) => `Kaydedildi: ${c} doğru, ${w} yanlış`,
  },
  library: {
    title: 'Kütüphane',
    empty: 'Henüz kitap eklemedin. Planın eklediğin kitaplara göre kurulur.',
    add: 'Kitap ekle',
    remove: 'Kaldır',
    percentDone: (p: number) => `%${p} tamamlandı`,
    removeConfirm: (title: string) => `"${title}" kütüphanenden kaldırılsın mı?`,
    cancel: 'Vazgeç',
    summary: (total: number, kind: 'pages' | 'tests', units: number, minutes: number) =>
      `${total} ${kind === 'pages' ? 'sayfa' : 'test'} · ${units} bölüm · ${kind === 'pages' ? 'sayfa' : 'test'} başı ${minutes.toLocaleString('tr-TR')} dk`,
    addOptions: {
      title: 'Kitabını nasıl ekleyelim?',
      scan: { label: 'Barkodu okut', description: 'Arka kapaktaki ISBN barkodu' },
      search: { label: 'Ara', description: 'ISBN ya da kitap adıyla katalogda' },
      quick: { label: 'Hızlı ekle', description: 'Katalogda yoksa: ad ve sayfa ya da test sayısı' },
    },
    scan: {
      title: 'Barkodu çerçeveye getir',
      permission: 'Barkodu okutmak için kamera izni gerekiyor.',
      allow: 'İzin ver',
      manual: "ISBN'i elle yaz",
    },
    search: {
      title: 'Katalogda ara',
      placeholder: 'ISBN ya da ad (ör. 3 Adım TYT Tarih)',
      none: 'Katalogda bulunamadı. Hızlı ekleyebilirsin.',
      error: 'Katalog yüklenemedi. İnternet bağlantını kontrol et ya da hızlı ekle.',
      sharedIsbn: 'Bu barkod birden çok kitapta ortak; dersini seç.',
      quick: 'Hızlı ekle',
    },
    edition: {
      units: (n: number) => `${n} bölüm`,
      pages: (n: number) => `${n} sayfa`,
      minutesTitle: 'Bir sayfa ortalama kaç dakikanı alıyor?',
      minutesTitleTests: 'Bir test ortalama kaç dakikanı alıyor?',
      minutes: (n: number) => `${n} dk`,
      add: 'Kütüphaneme ekle',
      loading: 'Bölümler yükleniyor…',
    },
    quick: {
      title: 'Hızlı ekle',
      name: 'Kitabın adı',
      namePlaceholder: 'Ör. X Yayınları TYT Fizik',
      kind: 'Neyle ilerleyeceksin?',
      kinds: { pages: 'Sayfa', tests: 'Test' },
      count: { pages: 'Toplam sayfa', tests: 'Toplam test' },
      add: 'Ekle',
    },
  },
} as const;
