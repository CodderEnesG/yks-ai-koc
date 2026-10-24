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
    empty: 'Kitaplar ve oynatma listeleri burada olacak.',
  },
} as const;
