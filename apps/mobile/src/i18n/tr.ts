// Uygulama metinleri. MVP yalnız Türkçe; ikinci dil gelirse i18next'e taşınır (TECH-STACK).
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
    planSoon: 'Kitaplarını ekleyince günlük görevlerin burada görünecek.',
    resetDev: 'Kurulumu sıfırla (geliştirme)',
  },
  library: {
    title: 'Kütüphane',
    empty: 'Henüz kitap eklemedin. Planın eklediğin kitaplara göre kurulur.',
    add: 'Kitap ekle',
    remove: 'Kaldır',
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
