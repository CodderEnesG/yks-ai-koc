// Uygulama metinleri. MVP yalnız Türkçe; ikinci dil gelirse i18next'e taşınır (TECH-STACK).
function rangeLabel(kind: 'pages' | 'tests' | 'video', first: number, last: number): string {
  const span = first === last ? `${first}` : `${first}-${last}`;
  return kind === 'pages' ? `s. ${span}` : `Test ${span}`;
}

/** "2 kitap · 1 video"; sıfır olan tür yazılmaz (videolar kitap sayılmaz; tasarım kararı 27 Ekim). */
function sourceCount(books: number, videos: number): string {
  return [books > 0 ? `${books} kitap` : '', videos > 0 ? `${videos} video` : '']
    .filter(Boolean)
    .join(' · ');
}

export const tr = {
  common: {
    continue: 'Devam',
    skip: 'Şimdilik geç',
    estimated: 'tahmini',
    back: 'Geri',
    retry: 'Tekrar dene',
    clearSearch: 'Aramayı temizle',
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
      subtitle: 'Alaaddin seni buna göre motive eder. Emin değilsen geçebilirsin.',
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
      placeholder: { day: 'GG', month: 'AA', year: 'YYYY' },
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
    noBooks: 'Planın eklediğin kaynaklara göre kurulur. İlk kaynağını ekle.',
    addBook: 'Kaynak ekle',
    restDay: 'Bugün çalışma günün değil. Dinlen.',
    restore: 'Hesabım var, geri yükle',
    nothingLeft: 'Planlanacak iş kalmadı.',
    ranges: (kind: 'pages' | 'tests' | 'video', ranges: { first: number; last: number }[]) =>
      ranges.map((r) => rangeLabel(kind, r.first, r.last)).join(', '),
    units: (n: number) => (n > 1 ? `${n} bölüm` : ''),
    summary: (duration: string, books: number, videos: number) =>
      `Bugün ≈ ${duration} · ${sourceCount(books, videos)}`,
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
    openYouTube: "YouTube'da aç",
    statusLabel: {
      planned: 'Planlı',
      done: 'Tamamlandı',
      mixed: 'Yarım kaldı',
      skipped: 'Yapılmadı',
    },
    videoMissing: 'Video bilgisi yenileniyor',
    videoDuration: (videoSeconds: number, planSeconds: number) => {
      const fmt = (seconds: number) => {
        const minutes = Math.max(1, Math.round(seconds / 60));
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h === 0 ? `${m} dk` : m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
      };
      return `${fmt(videoSeconds)} video · ≈ ${fmt(planSeconds)} not dahil`;
    },
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
    minorWithdrawn: 'Velin onayını geri çekti; verilerin yalnız bu telefonda.',
    deleteTitle: 'Verileri sil',
    deleteHint: (account: boolean) =>
      account
        ? 'Hesabın, sunucudaki yedeğin ve bu telefondaki planın, kitapların ve check-in kayıtların kalıcı olarak silinir.'
        : 'Bu telefondaki planın, kitapların ve check-in kayıtların kalıcı olarak silinir.',
    deleteButton: (account: boolean) => (account ? 'Hesabımı ve verilerimi sil' : 'Verilerimi sil'),
    deleteConfirmTitle: 'Her şey silinsin mi?',
    deleteConfirmBody: 'Bu işlem geri alınamaz. Uygulama kurulumun başına döner.',
    deleteConfirm: 'Sil',
    cancel: 'Vazgeç',
    deleteFailed: 'Silinemedi; internet bağlantını kontrol edip tekrar dene.',
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
    resendIn: (seconds: number) => `Yeni kod ${seconds} sn sonra`,
    changeEmail: 'E-postayı değiştir',
    sendFailed: 'Kod gönderilemedi; e-posta adresini ve bağlantını kontrol et.',
    invalidEmail: 'Geçerli bir e-posta adresi yaz',
    failed: 'Olmadı; kodu kontrol edip tekrar dene.',
    noBackup: 'Bu hesapta kayıtlı plan yok; kuruluma başlayalım.',
    claimFailed:
      'Velinin onayı bu hesaba bağlanamadı. Kendi e-posta adresinle giriş yap (velinin adresiyle değil).',
  },
  consent: {
    title: 'Veli onayı',
    intro:
      '18 yaşından küçük olduğun için sohbet, fotoğrafla kitap ekleme ve yedekleme velinin onayından sonra açılır. O zamana kadar planın yalnız bu telefonda çalışır.',
    emailLabel: 'Velinin e-posta adresi',
    emailHint:
      'Velin onay sayfasında bu adrese gelen kodla doğrulama yapacak. Sunucuya yalnız bu adres gider.',
    create: 'Onay linki oluştur',
    failed: 'Link oluşturulamadı; internet bağlantını kontrol et.',
    pendingTitle: 'Link hazır',
    pendingBody: (email: string) =>
      `Linki veline gönder. Velin sayfayı açıp ${email} adresiyle onay verince burada görünür. Link 7 gün geçerli.`,
    whatsapp: "WhatsApp'tan gönder",
    share: 'Başka yolla paylaş',
    shareMessage: (link: string) =>
      `lamba uygulamasını kullanmak için onayına ihtiyacım var. Bu linkten açıklamayı okuyup onay verebilirsin: ${link}`,
    check: 'Durumu kontrol et',
    stillPending: 'Henüz onay gelmedi.',
    newLink: 'Yeni link oluştur',
    expired: 'Linkin süresi doldu; yeni bir link oluştur.',
    grantedTitle: 'Velin onay verdi',
    grantedBody: 'Artık hesabını bağlayıp planını yedekleyebilirsin.',
    withdrawn:
      'Velin onayını geri çekti. Sunucudaki yedeğin silindi; planın bu telefonda çalışmaya devam ediyor. İstersen yeniden onay isteyebilirsin.',
    open: 'Veli onayı iste',
  },
  chat: {
    title: 'Alaaddin',
    intro:
      'Ben bir yapay zekâ koçuyum. Planını, aksayan günleri ve motivasyonunu konuşabiliriz; soru çözmem. Yazdıkların velinle paylaşılmaz.',
    placeholder: 'Alaaddin’e yaz…',
    send: 'Gönder',
    sending: 'Gönderiliyor…',
    thinking: 'Alaaddin düşünüyor…',
    failed: 'Gönderilemedi',
    retry: 'Tekrar dene',
    report: 'Bildir',
    reported: 'Bildirildi, teşekkürler',
    support: 'Destek ekranını aç',
    tooLong: (max: number) => `Mesaj en fazla ${max} karakter olabilir.`,
    errors: {
      quota: 'Bugünkü mesaj hakkın doldu; yarın devam edelim.',
      consent: 'Sohbet velinin onayından sonra açılır.',
      auth: 'Oturumun kapanmış; Ayarlar’dan hesabını yeniden bağla.',
      network: 'Mesaj gönderilemedi; internet bağlantını kontrol et.',
    },
    needConsent:
      'Sohbet, velin onay verdikten sonra açılır. O zamana kadar planın bu telefonda çalışmaya devam ediyor.',
    needAccount: 'Alaaddin’le konuşmak için önce hesabını bağla; sohbet sunucuda işlenir.',
  },
  report: {
    share: 'Haftalık raporu velime gönder',
    message: (link: string) => `Bu haftaki çalışma raporum: ${link}`,
    noConsent: 'Velin haftalık rapora izin vermedi.',
    failed: 'Rapor linki alınamadı; internet bağlantını kontrol et.',
  },
  notifications: {
    channel: 'Plan hatırlatmaları',
    morningTitle: 'Bugünün planı hazır',
    morningBody: (duration: string, books: number, videos: number) =>
      `≈ ${duration} · ${sourceCount(books, videos)}. Başlamak için dokun.`,
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
    watched: 'İzledim',
    notWatched: 'İzleyemedim',
    statusWatched: '✓ İzlendi',
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
    // Planın ne yaptığını söyleyen olgusal notlar. Alaaddin'in tonu ve destek metinleri ton rehberi ve PDR
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
    empty: 'Henüz kaynak eklemedin. Planın eklediğin kitap ve listelere göre kurulur.',
    add: 'Kaynak ekle',
    remove: 'Kaldır',
    percentDone: (p: number) => `%${p} tamamlandı`,
    removeConfirm: (title: string) => `"${title}" kütüphanenden kaldırılsın mı?`,
    cancel: 'Vazgeç',
    summary: (total: number, kind: 'pages' | 'tests', units: number, minutes: number) =>
      `${total} ${kind === 'pages' ? 'sayfa' : 'test'} · ${units} bölüm · ${kind === 'pages' ? 'sayfa' : 'test'} başı ${minutes.toLocaleString('tr-TR')} dk`,
    addOptions: {
      title: 'Kaynağını nasıl ekleyelim?',
      scan: { label: 'Barkodu okut', description: 'Arka kapaktaki ISBN barkodu' },
      search: { label: 'Ara', description: 'ISBN ya da kitap adıyla katalogda' },
      toc: { label: 'İçindekilerden ekle', description: 'Fotoğrafını çek, bölümleri biz okuyalım' },
      quick: { label: 'Hızlı ekle', description: 'Katalogda yoksa: ad ve sayfa ya da test sayısı' },
      youtube: {
        label: 'YouTube listesi',
        description: 'Ders oynatma listesinin linkini yapıştır',
      },
    },
    playlistSummary: (videos: number, speed: number, channel: string) =>
      `${videos} video · ${speed.toLocaleString('tr-TR')}× · ${channel}`,
    playlistMissing: 'Liste bilgisi 30 günü geçti; yenilenince plana döner.',
    youtube: {
      title: 'YouTube listesi ekle',
      subtitle: 'Ders oynatma listesinin linkini yapıştır. Videolar planına sırayla girer.',
      linkLabel: 'Liste linki',
      placeholder: 'https://www.youtube.com/playlist?list=…',
      fetch: 'Listeyi getir',
      fetching: 'Liste getiriliyor…',
      preview: (videos: number, duration: string) => `${videos} video · toplam ${duration}`,
      speedLabel: 'İzleme hızı',
      noteLabel: 'Not alma payı',
      noteHint: 'Durdurup not almak için videoya eklenen süre.',
      add: 'Kütüphaneme ekle',
      kidsNote: 'Bu listede "çocuklara özel" işaretli videolar var.',
      errors: {
        invalid_link: 'Bu bir YouTube oynatma listesi linki değil.',
        not_found: 'Liste bulunamadı ya da gizli.',
        empty: 'Listede izlenebilir video yok.',
        quota: 'Bugünkü liste ekleme hakkın doldu; yarın tekrar dene.',
        consent: 'Liste ekleme velinin onayından sonra açılır.',
        unavailable: "YouTube'a şu an ulaşılamıyor; biraz sonra tekrar dene.",
        network: 'Liste getirilemedi; internet bağlantını kontrol et.',
      },
      needAccount: 'YouTube listesi eklemek için hesabını bağla; liste sunucudan getirilir.',
      needConsent: 'YouTube listesi eklemek velinin onayından sonra açılır.',
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
    toc: {
      title: 'İçindekilerden ekle',
      body: 'Kitabının içindekiler sayfasının fotoğrafını çek; bölümleri ve sayfaları biz okuyalım, sen kontrol et. Fotoğraf okunduktan sonra silinir.',
      camera: 'Fotoğraf çek',
      library: 'Galeriden seç',
      reading: 'Okunuyor… (10 saniye kadar)',
      needAccount: 'Fotoğrafla eklemek için önce hesabını bağla (Ayarlar).',
      minor: 'Velin onay verene kadar fotoğraf yükleme kapalı. Hızlı ekleyebilirsin.',
      goSettings: 'Ayarlara git',
      errors: {
        permission: 'Kamera izni olmadan fotoğraf çekemeyiz.',
        quota: 'Bugünlük fotoğraf hakkın doldu; yarın tekrar dene ya da hızlı ekle.',
        unreadable: 'Sayfa okunamadı. Işığı ve açıyı düzeltip tekrar dene.',
        network: 'Bağlantı kurulamadı. İnternetini kontrol et.',
      },
      reviewTitle: 'Kontrol et',
      reviewSubtitle: 'Başlangıç sayfalarını kitapla karşılaştır; yanlışsa düzelt.',
      bookName: 'Kitabın adı',
      lastPage: 'Son bölüm hangi sayfada bitiyor?',
      rowStart: 'Sayfa',
      issueMissing: 'Sayfa eksik',
      issueOrder: 'Sayfa sırası bozuk',
      save: 'Kütüphaneme ekle',
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
  // Destek ekranı (T18). Kriz metinleri @yks/safety'de (sunucuyla ortak, PDR onayı bekliyor).
  support: {
    title: 'Destek',
    settingsTitle: 'Zor bir an mı yaşıyorsun?',
    settingsHint: 'Konuşabileceğin yerler ve planını birkaç gün hafifletme.',
    open: 'Destek',
    lines: 'Ücretsiz hatlar',
    notify: 'Velime ya da rehberime haber ver',
    notifyHint:
      'Kendi telefonundan, seçtiğin kişiye kısa bir mesaj gönderirsin. Uygulama kimseye bir şey göndermez.',
    lighten: 'Planımı birkaç gün hafiflet',
    lightenHint: 'Bugün ve sonraki üç gün yükün yarıya iner, koç daha yumuşak konuşur.',
    lightened: 'Hafif mod açık. Planın birkaç gün yarı yarıya.',
    callFailed: (phone: string) => `Arama açılamadı. ${phone} numarasını elle arayabilirsin.`,
    draft: 'Taslak metin: uzman onayından önce yayına çıkmaz.',
  },
} as const;
