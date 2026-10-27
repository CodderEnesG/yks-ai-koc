// Konu taksonomisi v1, müfredat sürümü 'MEB-2027' (T12; rapor 2.1 ilke 5, 2.5).
//
// Kaynak: MEB, "(ÖSYM tarafından 2026 yılında gerçekleştirilecek TYT, AYT ve YDT sınavlarına esas) Ortak
// derslere ait kazanım ve açıklamalar", https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_11/26164023_2026_yks.pdf
// (2026-10-27'de alındı). ÖSYM 2026-YKS kılavuzu adayları bu belgeden sorumlu tutar. 2027 sürümü
// yayımlanınca karşılaştırılmalı. Mantık, sosyoloji ve psikoloji sayfalarında (239-270) gömülü yazı tipinin
// kodlaması kaymış (Latin harfler +29); ünite adları bu kaydırma çözülerek aynı belgeden doğrulandı (README).
//
// Ağaç: ders → ünite → konu. Ad ve kod resmî belgeden; belgede kod yoksa kod null. Konu düzeyi olmayan
// derslerde (Tarih, İnkılap Tarihi, Din Kültürü, Mantık, Sosyoloji, Psikoloji) ünite yapraktır.
// Coğrafyada belge konu vermez, kazanım verir: konu, ardışık kazanım grubudur (kod "9.1.9-9.1.11"), adı
// ünite açıklamasındaki konu listesinden kısaltılmıştır (editoryal).
//
// `ipucu` yalnız eşleme içindir (match.ts), veritabanına girmez: belgedeki "Terimler ve Kavramlar",
// kazanım ve açıklama metinlerinden seçilmiş sözcükler.
//
// Sınav ağırlığı (exam_weight) resmî kaynakta konu düzeyinde yok: tüm konularda null (NOT DEFINED).
// Hangi konunun TYT, hangisinin AYT kapsamında olduğu da resmî belgede ayrılmıyor (NOT DEFINED).

export interface Konu {
  kod: string | null;
  ad: string;
  ipucu?: string;
}

export interface Unite extends Konu {
  konular?: Konu[];
}

export interface Ders {
  /** Konu anahtarlarının öneki; kalıcıdır, değiştirilmez (UUID bundan türetilir). */
  anahtar: string;
  ad: string;
  /** Kaynak belgedeki sayfa aralığı. */
  sayfa: string;
  uniteler: Unite[];
}

export const MUFREDAT = 'MEB-2027';

export const KAYNAK = {
  belge:
    '(ÖSYM tarafından 2026 yılında gerçekleştirilecek TYT, AYT ve YDT sınavlarına esas) Ortak derslere ait kazanım ve açıklamalar, MEB',
  url: 'https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_11/26164023_2026_yks.pdf',
  alinma: '2026-10-27',
};

export const DERSLER: Ders[] = [
  {
    anahtar: 'TDE',
    ad: 'Türk Dili ve Edebiyatı',
    sayfa: '4-50',
    uniteler: [
      {
        kod: null,
        ad: 'Dil Bilgisi',
        ipucu: 'dil bilgisi sözcük kelime türleri cümle bilgisi',
        // Belgede dil bilgisi konuları her ünite tablosunun altında verilir; konu kodu yok.
        konular: [
          { kod: null, ad: 'Standart Dil, Ağız, Şive, Lehçe', ipucu: 'argo jargon dil kültür' },
          { kod: null, ad: 'İsimler', ipucu: 'isim ad' },
          { kod: null, ad: 'Sıfatlar', ipucu: 'sıfat' },
          { kod: null, ad: 'Edat, Bağlaç ve Ünlemler', ipucu: 'edat bağlaç ünlem' },
          { kod: null, ad: 'Zamirler', ipucu: 'zamir' },
          { kod: null, ad: 'Zarflar', ipucu: 'zarf' },
          { kod: null, ad: 'Fiiller', ipucu: 'fiil kip ek fiil çatı' },
          { kod: null, ad: 'Fiilimsiler', ipucu: 'fiilimsi isim fiil sıfat fiil zarf fiil' },
          { kod: null, ad: 'İsim Tamlamaları', ipucu: 'tamlama' },
          { kod: null, ad: 'Sıfat Tamlamaları', ipucu: 'tamlama' },
          { kod: null, ad: 'Cümle Çeşitleri', ipucu: 'cümle türleri' },
          { kod: null, ad: 'Cümlenin Ögeleri', ipucu: 'özne yüklem nesne tümleç' },
          { kod: null, ad: 'Anlatım Bozuklukları' },
          { kod: null, ad: 'Kelimede Anlam', ipucu: 'sözcükte anlam sözcük anlam' },
          { kod: null, ad: 'Paragrafta Anlam', ipucu: 'paragraf ana düşünce yardımcı düşünce' },
          { kod: null, ad: 'İmla ve Noktalama', ipucu: 'yazım kuralları noktalama işaretleri' },
        ],
      },
      {
        kod: 'A',
        ad: 'Okuma (Metni Anlama ve Çözümleme)',
        konular: [
          { kod: 'A.1', ad: 'Şiir', ipucu: 'şiir nazım ahenk' },
          {
            kod: 'A.2',
            ad: 'Öyküleyici (Anlatmaya Bağlı) Edebî Metinler',
            ipucu: 'masal fabl destan mesnevi hikâye roman anlatıcı bakış açısı',
          },
          { kod: 'A.3', ad: 'Tiyatro' },
          {
            kod: 'A.4',
            ad: 'Bilgilendirici (Öğretici) Metinler',
            ipucu:
              'öğretici metinler ana düşünce yardımcı düşünce anlatım biçimleri düşünceyi geliştirme yolları',
          },
        ],
      },
      // Ünite, süre ve içerik tabloları (her sınıfta ayrı). Kod: sınıf.ünite sırası.
      { kod: '9.1', ad: 'Giriş', ipucu: 'edebiyat nedir metinlerin sınıflandırılması' },
      { kod: '9.2', ad: 'Hikâye', ipucu: 'olay hikâyesi durum hikâyesi hikâyenin unsurları' },
      {
        kod: '9.3',
        ad: 'Şiir',
        ipucu: 'şiir bilgisi nazım birimi ölçü kafiye redif söz sanatları hece aruz serbest',
      },
      { kod: '9.4', ad: 'Masal/Fabl', ipucu: 'masal fabl' },
      { kod: '9.5', ad: 'Roman', ipucu: 'roman unsurları' },
      { kod: '9.6', ad: 'Tiyatro', ipucu: 'tiyatro türleri' },
      { kod: '9.7', ad: 'Biyografi/Otobiyografi', ipucu: 'biyografi otobiyografi tezkire' },
      { kod: '9.8', ad: 'Mektup/E-posta', ipucu: 'mektup' },
      { kod: '9.9', ad: 'Günlük/Blog', ipucu: 'günlük blog' },
      {
        kod: '10.1',
        ad: 'Giriş',
        ipucu: 'Türk edebiyatının tarihî dönemleri Türkçenin tarihî gelişimi',
      },
      {
        kod: '10.2',
        ad: 'Hikâye',
        ipucu: 'Dede Korkut halk hikâyesi mesnevi Tanzimat Millî Edebiyat hikâye cenkname',
      },
      {
        kod: '10.3',
        ad: 'Şiir',
        ipucu:
          'İslamiyet öncesi koşuk sagu geçiş dönemi halk şiiri ilahi nefes mâni türkü koşma divan şiiri gazel kaside şarkı',
      },
      { kod: '10.4', ad: 'Destan/Efsane', ipucu: 'destan efsane' },
      { kod: '10.5', ad: 'Roman', ipucu: 'Tanzimat Servetifünun Millî Edebiyat roman dünya' },
      {
        kod: '10.6',
        ad: 'Tiyatro',
        ipucu: 'geleneksel Türk tiyatrosu Karagöz orta oyunu meddah modern tiyatro',
      },
      { kod: '10.7', ad: 'Anı (Hatıra)', ipucu: 'anı hatıra' },
      { kod: '10.8', ad: 'Haber Metni', ipucu: 'haber' },
      { kod: '10.9', ad: 'Gezi Yazısı', ipucu: 'gezi' },
      {
        kod: '11.1',
        ad: 'Giriş',
        ipucu: 'edebiyat ve toplum edebiyatın sanat akımları ile ilişkisi edebî akımlar',
      },
      { kod: '11.2', ad: 'Hikâye', ipucu: 'Cumhuriyet Dönemi hikâye 1923-1940 1940-1960' },
      {
        kod: '11.3',
        ad: 'Şiir',
        ipucu:
          'Tanzimat Servetifünun Fecriati saf şiir Millî Edebiyat Cumhuriyet ilk dönemi hece Türk dünyası şiir',
      },
      { kod: '11.4', ad: 'Makale', ipucu: 'makale' },
      { kod: '11.5', ad: 'Sohbet ve Fıkra', ipucu: 'sohbet fıkra' },
      { kod: '11.6', ad: 'Roman', ipucu: 'Cumhuriyet Dönemi roman 1923-1950 1950-1980 dünya' },
      { kod: '11.7', ad: 'Tiyatro', ipucu: 'Cumhuriyet Dönemi tiyatro 1923-1950 1950-1980' },
      { kod: '11.8', ad: 'Eleştiri', ipucu: 'eleştiri' },
      { kod: '11.9', ad: 'Mülakat/Röportaj', ipucu: 'mülakat röportaj' },
      { kod: '12.1', ad: 'Giriş', ipucu: 'edebiyat düşünce akımları felsefe psikoloji sözlükler' },
      { kod: '12.2', ad: 'Hikâye', ipucu: '1960 sonrası hikâye küçürek minimal' },
      {
        kod: '12.3',
        ad: 'Şiir',
        ipucu:
          'Cumhuriyet Dönemi saf şiir toplumcu Garip İkinci Yeni II. Yeni dinî değerleri metafizik 1960 sonrası 1980 sonrası Cumhuriyet sonrası halk şiiri',
      },
      {
        kod: '12.4',
        ad: 'Roman',
        ipucu: 'Cumhuriyet Dönemi roman 1980 sonrası Türk dünyası dünya edebiyatı',
      },
      { kod: '12.5', ad: 'Tiyatro', ipucu: '1950 sonrası Türk tiyatrosu' },
      { kod: '12.6', ad: 'Deneme', ipucu: 'deneme' },
      { kod: '12.7', ad: 'Söylev (Nutuk)', ipucu: 'söylev nutuk' },
    ],
  },
  {
    anahtar: 'DIN',
    ad: 'Din Kültürü ve Ahlak Bilgisi',
    sayfa: '51-74',
    uniteler: [
      { kod: '9.1', ad: 'Bilgi ve İnanç' },
      { kod: '9.2', ad: 'Din ve İslam' },
      { kod: '9.3', ad: 'İslam ve İbadet' },
      { kod: '9.4', ad: 'Gençlik ve Değerler' },
      { kod: '9.5', ad: 'Gönül Coğrafyamız' },
      { kod: '10.1', ad: 'Allah İnsan İlişkisi' },
      { kod: '10.2', ad: 'Hz. Muhammed ve Gençlik' },
      { kod: '10.3', ad: 'Din ve Hayat' },
      { kod: '10.4', ad: 'Ahlaki Tutum ve Davranışlar' },
      { kod: '10.5', ad: 'İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar' },
      { kod: '11.1', ad: 'Dünya ve Ahiret' },
      { kod: '11.2', ad: 'Kur’an’a Göre Hz. Muhammed' },
      { kod: '11.3', ad: 'Kur’an’da Bazı Kavramlar' },
      { kod: '11.4', ad: 'İnançla İlgili Meseleler' },
      { kod: '11.5', ad: 'Yahudilik ve Hıristiyanlık' },
      { kod: '12.1', ad: 'İslam ve Bilim' },
      { kod: '12.2', ad: 'Anadolu’da İslam' },
      { kod: '12.3', ad: 'İslam Düşüncesinde Tasavvufi Yorumlar' },
      { kod: '12.4', ad: 'Güncel Dinî Meseleler' },
      { kod: '12.5', ad: 'Hint ve Çin Dinleri' },
    ],
  },
  {
    anahtar: 'TAR',
    ad: 'Tarih',
    sayfa: '75-102',
    uniteler: [
      { kod: '9.1', ad: 'Tarih ve Zaman' },
      { kod: '9.2', ad: 'İnsanlığın İlk Dönemleri', ipucu: 'İlk Çağ yazının icadı' },
      { kod: '9.3', ad: 'Orta Çağ’da Dünya' },
      { kod: '9.4', ad: 'İlk ve Orta Çağlarda Türk Dünyası' },
      { kod: '9.5', ad: 'İslam Medeniyetinin Doğuşu' },
      { kod: '9.6', ad: 'Türklerin İslamiyet’i Kabulü ve İlk Türk İslam Devletleri' },
      { kod: '10.1', ad: 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi' },
      { kod: '10.2', ad: 'Beylikten Devlete Osmanlı Siyaseti (1302-1453)' },
      { kod: '10.3', ad: 'Devletleşme Sürecinde Savaşçılar ve Askerler' },
      { kod: '10.4', ad: 'Beylikten Devlete Osmanlı Medeniyeti' },
      { kod: '10.5', ad: 'Dünya Gücü Osmanlı (1453-1595)' },
      { kod: '10.6', ad: 'Sultan ve Osmanlı Merkez Teşkilatı' },
      { kod: '10.7', ad: 'Klasik Çağda Osmanlı Toplum Düzeni' },
      { kod: '11.1', ad: 'Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti (1595-1774)' },
      { kod: '11.2', ad: 'Değişim Çağında Avrupa ve Osmanlı' },
      { kod: '11.3', ad: 'Devrimler Çağında Değişen Devlet-Toplum İlişkileri' },
      { kod: '11.4', ad: 'Uluslararası İlişkilerde Denge Stratejisi (1774-1914)' },
      {
        kod: '11.5',
        ad: 'XIX ve XX. Yüzyılda Değişen Sosyo-Ekonomik Hayat',
        ipucu: 'sosyoekonomik',
      },
    ],
  },
  {
    // Belgedeki bölüm İnkılap Tarihi ile Çağdaş Türk ve Dünya Tarihi ünitelerini tek sırada verir.
    anahtar: 'ITA',
    ad: 'T.C. İnkılap Tarihi ve Atatürkçülük',
    sayfa: '103-111',
    uniteler: [
      { kod: '1', ad: '20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya' },
      { kod: '2', ad: 'Millî Mücadele' },
      { kod: '3', ad: 'Atatürkçülük ve Türk İnkılabı' },
      { kod: '4', ad: 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya' },
      { kod: '5', ad: 'II. Dünya Savaşı Sürecinde Türkiye ve Dünya' },
      { kod: '6', ad: 'II. Dünya Savaşı Sonrasında Türkiye ve Dünya' },
      { kod: '7', ad: 'Toplumsal Devrim Çağında Dünya ve Türkiye' },
      { kod: '8', ad: '21. Yüzyılın Eşiğinde Türkiye ve Dünya' },
    ],
  },
  {
    anahtar: 'COG',
    ad: 'Coğrafya',
    sayfa: '112-123',
    uniteler: [
      {
        kod: '9.1',
        ad: 'Doğal Sistemler',
        konular: [
          {
            kod: '9.1.1-9.1.3',
            ad: 'Doğa ve İnsan, Coğrafyanın Bölümleri ve Gelişimi',
            ipucu: 'coğrafya bilimi',
          },
          { kod: '9.1.4', ad: 'Dünya’nın Şekli ve Hareketleri' },
          { kod: '9.1.5', ad: 'Koordinat Sistemi, Konum, Yer ve Zaman' },
          {
            kod: '9.1.6-9.1.8',
            ad: 'Harita Bilgisi',
            ipucu: 'harita bilimi projeksiyon ölçek eş yükselti',
          },
          {
            kod: '9.1.9-9.1.11',
            ad: 'Atmosfer, Hava Durumu ve İklim Elemanları',
            ipucu: 'sıcaklık basınç rüzgâr nem yağış',
          },
          {
            kod: '9.1.12-9.1.13',
            ad: 'İklim Tipleri ve Türkiye’nin İklimi',
            ipucu: 'Türkiye iklimi',
          },
        ],
      },
      {
        kod: '9.2',
        ad: 'Beşerî Sistemler',
        konular: [{ kod: '9.2.1-9.2.4', ad: 'Yerleşmeler', ipucu: 'yerleşme' }],
      },
      {
        kod: '9.3',
        ad: 'Küresel Ortam: Bölgeler ve Ülkeler',
        konular: [
          { kod: '9.3.1-9.3.3', ad: 'Bölgeler ve Bölge Belirleme Kriterleri', ipucu: 'bölge' },
        ],
      },
      {
        kod: '9.4',
        ad: 'Çevre ve Toplum',
        konular: [
          {
            kod: '9.4.1-9.4.2',
            ad: 'Doğal Çevreyi Kullanma Biçimleri ve İnsan Etkisi',
            ipucu: 'doğal çevre',
          },
        ],
      },
      {
        kod: '10.1',
        ad: 'Doğal Sistemler',
        konular: [
          {
            kod: '10.1.1-10.1.2',
            ad: 'Dünya’nın Tektonik Oluşumu ve Jeolojik Zamanlar',
            ipucu: 'tektonik',
          },
          { kod: '10.1.3-10.1.5', ad: 'İç Kuvvetler ve Kayaçlar', ipucu: 'iç kuvvet kayaç' },
          { kod: '10.1.6-10.1.7', ad: 'Dış Kuvvetler', ipucu: 'dış kuvvet' },
          {
            kod: '10.1.8',
            ad: 'Türkiye’nin Ana Yer Şekilleri',
            ipucu: 'yüzey şekilleri yer şekilleri',
          },
          { kod: '10.1.9-10.1.11', ad: 'Su Varlıkları', ipucu: 'su kaynakları' },
          { kod: '10.1.12-10.1.14', ad: 'Topraklar', ipucu: 'toprak' },
          { kod: '10.1.15-10.1.17', ad: 'Bitki Toplulukları', ipucu: 'bitkiler bitki' },
        ],
      },
      {
        kod: '10.2',
        ad: 'Beşerî Sistemler',
        konular: [
          { kod: '10.2.1-10.2.7', ad: 'Nüfus', ipucu: 'nüfus piramitleri' },
          { kod: '10.2.8-10.2.10', ad: 'Göç', ipucu: 'göçler' },
          { kod: '10.2.11', ad: 'Ekonomik Faaliyetler', ipucu: 'ekonomik faaliyet' },
        ],
      },
      {
        kod: '10.3',
        ad: 'Küresel Ortam: Bölgeler ve Ülkeler',
        konular: [{ kod: '10.3.1', ad: 'Uluslararası Ulaşım Hatları', ipucu: 'ulaşım hatları' }],
      },
      {
        kod: '10.4',
        ad: 'Çevre ve Toplum',
        konular: [{ kod: '10.4.1-10.4.4', ad: 'Afetler', ipucu: 'afet' }],
      },
      {
        kod: '11.1',
        ad: 'Doğal Sistemler',
        konular: [
          {
            kod: '11.1.1-11.1.4',
            ad: 'Biyoçeşitlilik ve Ekosistem',
            ipucu: 'biyoçeşitlilik ekosistem madde döngüleri enerji akışı',
          },
        ],
      },
      {
        kod: '11.2',
        ad: 'Beşerî Sistemler',
        konular: [
          {
            kod: '11.2.1-11.2.3',
            ad: 'Nüfus Politikaları',
            ipucu: 'nüfus politikaları projeksiyonları Türkiye',
          },
          {
            kod: '11.2.4-11.2.7',
            ad: 'Şehirler ve Kır Yerleşmeleri',
            ipucu: 'şehir şehirler kır yerleşmeleri yerleşme',
          },
          {
            kod: '11.2.8-11.2.12',
            ad: 'Üretim, Dağıtım, Tüketim ve Doğal Kaynaklar',
            ipucu: 'üretim dağıtım tüketim doğal kaynaklar ekonomi',
          },
          {
            kod: '11.2.13-11.2.20',
            ad: 'Türkiye’de Ekonomi: Tarım, Maden, Enerji ve Sanayi',
            ipucu:
              'Türkiye ekonomi politikaları tarım hayvancılık ormancılık madencilik enerji kaynakları sanayi',
          },
        ],
      },
      {
        kod: '11.3',
        ad: 'Küresel Ortam: Bölgeler ve Ülkeler',
        konular: [
          {
            kod: '11.3.1-11.3.4',
            ad: 'Kültür Bölgeleri ve Türk Kültürü',
            ipucu: 'kültür merkezleri Türk kültürü kültür bölgeleri medeniyetler',
          },
          {
            kod: '11.3.5-11.3.9',
            ad: 'Küresel Ticaret, Turizm, Sanayileşme ve Uluslararası Örgütler',
            ipucu: 'ticaret turizm sanayileşme gelişmişlik uluslararası örgütler dünyada ekonomi',
          },
        ],
      },
      {
        kod: '11.4',
        ad: 'Çevre ve Toplum',
        konular: [
          {
            kod: '11.4.1-11.4.7',
            ad: 'Çevre Sorunları ve Doğal Kaynakların Kullanımı',
            ipucu: 'çevre sorunları sürdürülebilir geri dönüşüm',
          },
        ],
      },
      {
        kod: '12.1',
        ad: 'Doğal Sistemler',
        konular: [
          {
            kod: '12.1.1-12.1.2',
            ad: 'Doğa Olaylarının Ekstrem Durumları ve Doğadaki Değişim',
            ipucu: 'ekstrem doğa olayları değişim',
          },
        ],
      },
      {
        kod: '12.2',
        ad: 'Beşerî Sistemler',
        konular: [
          {
            kod: '12.2.1-12.2.3',
            ad: 'Şehirleşme, Göç, Sanayileşme ve Geleceğin Dünyası',
            ipucu:
              'ekonomik faaliyetler şehirleşme göç sanayi gelecek geçmişten geleceğe şehir ekonomi',
          },
          {
            kod: '12.2.4-12.2.5',
            ad: 'İşlevsel Bölgeler ve Kalkınma Projeleri',
            ipucu: 'Türkiye işlevsel bölgeleri kalkınma projeleri',
          },
          { kod: '12.2.6', ad: 'Hizmet Sektörü', ipucu: 'hizmet sektörünün ekonomideki yeri' },
          { kod: '12.2.7-12.2.9', ad: 'Ulaşım Sistemleri', ipucu: 'ulaşım' },
          {
            kod: '12.2.10-12.2.13',
            ad: 'Ticaret',
            ipucu: 'dünyada ve Türkiye’de ticaret ticaret merkezleri dış ticaret',
          },
          {
            kod: '12.2.14-12.2.17',
            ad: 'Turizm',
            ipucu: 'Türkiye turizm potansiyeli kültürel miras doğal ve kültürel semboller',
          },
        ],
      },
      {
        kod: '12.3',
        ad: 'Küresel Ortam: Bölgeler ve Ülkeler',
        konular: [
          {
            kod: '12.3.1-12.3.5',
            ad: 'Konumsal Önem ve Türkiye’nin Jeopolitik Konumu',
            ipucu: 'konumsal önem jeopolitik konum Türk kültür bölgeleri',
          },
          {
            kod: '12.3.6-12.3.9',
            ad: 'Ülkelerin Gelişmişlik Seviyeleri',
            ipucu: 'gelişmişlik gelişmiş gelişmekte olan ülkeler',
          },
          {
            kod: '12.3.10-12.3.11',
            ad: 'Enerji Nakil Hatları ve Günümüz Çatışma Alanları',
            ipucu: 'enerji nakil hatları çatışma alanları',
          },
        ],
      },
      {
        kod: '12.4',
        ad: 'Çevre ve Toplum',
        konular: [
          {
            kod: '12.4.1-12.4.4',
            ad: 'Doğal Çevrenin Sınırlılığı, Çevresel Örgüt ve Anlaşmalar',
            ipucu: 'doğal çevrenin sınırlılığı çevresel örgüt anlaşmalar ortak miras',
          },
        ],
      },
    ],
  },
  {
    anahtar: 'MAT',
    ad: 'Matematik',
    sayfa: '124-154',
    uniteler: [
      {
        kod: '9.1',
        ad: 'Mantık',
        konular: [{ kod: '9.1.1', ad: 'Önermeler ve Bileşik Önermeler', ipucu: 'önerme' }],
      },
      {
        kod: '9.2',
        ad: 'Kümeler',
        konular: [
          { kod: '9.2.1', ad: 'Kümelerde Temel Kavramlar' },
          { kod: '9.2.2', ad: 'Kümelerde İşlemler' },
        ],
      },
      {
        kod: '9.3',
        ad: 'Denklemler ve Eşitsizlikler',
        konular: [
          { kod: '9.3.1', ad: 'Sayı Kümeleri' },
          {
            kod: '9.3.2',
            ad: 'Bölünebilme Kuralları',
            ipucu: 'bölme EBOB EKOK periyodik olarak tekrar eden durumlar',
          },
          {
            kod: '9.3.3',
            ad: 'Birinci Dereceden Denklemler ve Eşitsizlikler',
            ipucu: 'aralık mutlak değer',
          },
          { kod: '9.3.4', ad: 'Üslü İfadeler ve Denklemler', ipucu: 'üslü köklü ifadeler' },
          {
            kod: '9.3.5',
            ad: 'Denklemler ve Eşitsizliklerle İlgili Uygulamalar',
            ipucu:
              'oran orantı problemler sayı kesir yaş işçi alım satım kâr zarar yüzde karışım hız hareket',
          },
        ],
      },
      {
        kod: '9.4',
        ad: 'Üçgenler',
        konular: [
          { kod: '9.4.1', ad: 'Üçgenlerde Temel Kavramlar', ipucu: 'üçgen eşitsizliği açı' },
          { kod: '9.4.2', ad: 'Üçgenlerde Eşlik ve Benzerlik' },
          {
            kod: '9.4.3',
            ad: 'Üçgenin Yardımcı Elemanları',
            ipucu: 'açıortay kenarortay yükseklik',
          },
          { kod: '9.4.4', ad: 'Dik Üçgen ve Trigonometri', ipucu: 'Pisagor' },
          { kod: '9.4.5', ad: 'Üçgenin Alanı' },
        ],
      },
      {
        kod: '9.5',
        ad: 'Veri',
        konular: [
          { kod: '9.5.1', ad: 'Merkezî Eğilim ve Yayılım Ölçüleri' },
          { kod: '9.5.2', ad: 'Verilerin Grafikle Gösterilmesi' },
        ],
      },
      {
        kod: '10.1',
        ad: 'Sayma ve Olasılık',
        konular: [
          { kod: '10.1.1', ad: 'Sıralama ve Seçme', ipucu: 'permütasyon kombinasyon Pascal binom' },
          { kod: '10.1.2', ad: 'Basit Olayların Olasılıkları', ipucu: 'olasılık' },
        ],
      },
      {
        kod: '10.2',
        ad: 'Fonksiyonlar',
        konular: [
          { kod: '10.2.1', ad: 'Fonksiyon Kavramı ve Gösterimi', ipucu: 'fonksiyon' },
          {
            kod: '10.2.2',
            ad: 'İki Fonksiyonun Bileşkesi ve Bir Fonksiyonun Tersi',
            ipucu: 'ters fonksiyon',
          },
        ],
      },
      {
        kod: '10.3',
        ad: 'Polinomlar',
        konular: [
          { kod: '10.3.1', ad: 'Polinom Kavramı ve Polinomlarla İşlemler' },
          { kod: '10.3.2', ad: 'Polinomların Çarpanlara Ayrılması', ipucu: 'çarpanlara ayırma' },
        ],
      },
      {
        kod: '10.4',
        ad: 'İkinci Dereceden Denklemler',
        konular: [
          {
            kod: '10.4.1',
            ad: 'İkinci Dereceden Bir Bilinmeyenli Denklemler',
            ipucu: 'karmaşık sayılar diskriminant',
          },
        ],
      },
      {
        kod: '10.5',
        ad: 'Dörtgenler ve Çokgenler',
        konular: [
          { kod: '10.5.1', ad: 'Çokgenler' },
          { kod: '10.5.2', ad: 'Dörtgenler ve Özellikleri' },
          {
            kod: '10.5.3',
            ad: 'Özel Dörtgenler',
            ipucu: 'yamuk paralelkenar eşkenar dörtgen dikdörtgen kare deltoid',
          },
        ],
      },
      {
        kod: '10.6',
        ad: 'Uzay Geometri',
        konular: [{ kod: '10.6.1', ad: 'Katı Cisimler', ipucu: 'prizma piramit' }],
      },
      {
        kod: '11.1',
        ad: 'Trigonometri',
        konular: [
          { kod: '11.1.1', ad: 'Yönlü Açılar' },
          {
            kod: '11.1.2',
            ad: 'Trigonometrik Fonksiyonlar',
            ipucu: 'kosinüs teoremi sinüs teoremi ters trigonometrik grafikleri',
          },
        ],
      },
      {
        kod: '11.2',
        ad: 'Analitik Geometri',
        konular: [
          {
            kod: '11.2.1',
            ad: 'Doğrunun Analitik İncelenmesi',
            ipucu:
              'iki nokta arasındaki uzaklık içten dıştan bölen nokta eğim açısı noktanın doğruya uzaklığı',
          },
        ],
      },
      {
        kod: '11.3',
        ad: 'Fonksiyonlarda Uygulamalar',
        konular: [
          { kod: '11.3.1', ad: 'Fonksiyonlarla İlgili Uygulamalar' },
          { kod: '11.3.2', ad: 'İkinci Dereceden Fonksiyonlar ve Grafikleri', ipucu: 'parabol' },
          { kod: '11.3.3', ad: 'Fonksiyonların Dönüşümleri' },
        ],
      },
      {
        kod: '11.4',
        ad: 'Denklem ve Eşitsizlik Sistemleri',
        konular: [
          { kod: '11.4.1', ad: 'İkinci Dereceden İki Bilinmeyenli Denklem Sistemleri' },
          {
            kod: '11.4.2',
            ad: 'İkinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Eşitsizlik Sistemleri',
          },
        ],
      },
      {
        kod: '11.5',
        ad: 'Çember ve Daire',
        konular: [
          { kod: '11.5.1', ad: 'Çemberin Temel Elemanları' },
          { kod: '11.5.2', ad: 'Çemberde Açılar' },
          { kod: '11.5.3', ad: 'Çemberde Teğet' },
          { kod: '11.5.4', ad: 'Dairenin Çevresi ve Alanı' },
        ],
      },
      {
        kod: '11.6',
        ad: 'Uzay Geometri',
        konular: [{ kod: '11.6.1', ad: 'Katı Cisimler', ipucu: 'silindir koni küre' }],
      },
      {
        kod: '11.7',
        ad: 'Olasılık',
        konular: [
          { kod: '11.7.1', ad: 'Koşullu Olasılık' },
          { kod: '11.7.2', ad: 'Deneysel ve Teorik Olasılık' },
        ],
      },
      {
        kod: '12.1',
        ad: 'Üstel ve Logaritmik Fonksiyonlar',
        konular: [
          { kod: '12.1.1', ad: 'Üstel Fonksiyon' },
          { kod: '12.1.2', ad: 'Logaritma Fonksiyonu' },
          { kod: '12.1.3', ad: 'Üstel, Logaritmik Denklemler ve Eşitsizlikler' },
        ],
      },
      {
        kod: '12.2',
        ad: 'Diziler',
        konular: [{ kod: '12.2.1', ad: 'Gerçek Sayı Dizileri', ipucu: 'aritmetik geometrik dizi' }],
      },
      {
        kod: '12.3',
        ad: 'Trigonometri',
        konular: [
          { kod: '12.3.1', ad: 'Toplam-Fark ve İki Kat Açı Formülleri' },
          { kod: '12.3.2', ad: 'Trigonometrik Denklemler' },
        ],
      },
      {
        kod: '12.4',
        ad: 'Dönüşümler',
        konular: [
          {
            kod: '12.4.1',
            ad: 'Analitik Düzlemde Temel Dönüşümler',
            ipucu: 'öteleme dönme simetri',
          },
        ],
      },
      {
        kod: '12.5',
        ad: 'Türev',
        konular: [
          { kod: '12.5.1', ad: 'Limit ve Süreklilik' },
          { kod: '12.5.2', ad: 'Anlık Değişim Oranı ve Türev' },
          { kod: '12.5.3', ad: 'Türevin Uygulamaları' },
        ],
      },
      {
        kod: '12.6',
        ad: 'İntegral',
        konular: [
          { kod: '12.6.1', ad: 'Belirsiz İntegral' },
          { kod: '12.6.2', ad: 'Belirli İntegral ve Uygulamaları' },
        ],
      },
      {
        kod: '12.7',
        ad: 'Analitik Geometri',
        konular: [{ kod: '12.7.1', ad: 'Çemberin Analitik İncelenmesi' }],
      },
    ],
  },
  {
    anahtar: 'FIZ',
    ad: 'Fizik',
    sayfa: '155-182',
    uniteler: [
      {
        kod: '9.1',
        ad: 'Fizik Bilimine Giriş',
        konular: [
          { kod: '9.1.1', ad: 'Fizik Biliminin Önemi' },
          { kod: '9.1.2', ad: 'Fiziğin Uygulama Alanları' },
          { kod: '9.1.3', ad: 'Fiziksel Niceliklerin Sınıflandırılması' },
          { kod: '9.1.4', ad: 'Bilim Araştırma Merkezleri' },
        ],
      },
      {
        kod: '9.2',
        ad: 'Madde ve Özellikleri',
        konular: [
          { kod: '9.2.1', ad: 'Madde ve Özkütle' },
          { kod: '9.2.2', ad: 'Dayanıklılık' },
          { kod: '9.2.3', ad: 'Yapışma ve Birbirini Tutma' },
        ],
      },
      {
        kod: '9.3',
        ad: 'Hareket ve Kuvvet',
        konular: [
          { kod: '9.3.1', ad: 'Hareket' },
          { kod: '9.3.2', ad: 'Kuvvet' },
          { kod: '9.3.3', ad: 'Newton’ın Hareket Yasaları' },
          { kod: '9.3.4', ad: 'Sürtünme Kuvveti' },
        ],
      },
      {
        kod: '9.4',
        ad: 'Enerji',
        konular: [
          { kod: '9.4.1', ad: 'İş, Enerji ve Güç' },
          { kod: '9.4.2', ad: 'Mekanik Enerji' },
          { kod: '9.4.3', ad: 'Enerjinin Korunumu ve Enerji Dönüşümleri' },
          { kod: '9.4.4', ad: 'Verim' },
          { kod: '9.4.5', ad: 'Enerji Kaynakları' },
        ],
      },
      {
        kod: '9.5',
        ad: 'Isı ve Sıcaklık',
        konular: [
          { kod: '9.5.1', ad: 'Isı ve Sıcaklık' },
          { kod: '9.5.2', ad: 'Hâl Değişimi' },
          { kod: '9.5.3', ad: 'Isıl Denge' },
          { kod: '9.5.4', ad: 'Enerji İletim Yolları ve Enerji İletim Hızı' },
          { kod: '9.5.5', ad: 'Genleşme' },
        ],
      },
      {
        kod: '9.6',
        ad: 'Elektrostatik',
        konular: [{ kod: '9.6.1', ad: 'Elektrik Yükleri' }],
      },
      {
        kod: '10.1',
        ad: 'Elektrik ve Manyetizma',
        konular: [
          { kod: '10.1.1', ad: 'Elektrik Akımı, Potansiyel Farkı ve Direnç' },
          { kod: '10.1.2', ad: 'Elektrik Devreleri' },
          { kod: '10.1.3', ad: 'Mıknatıs ve Manyetik Alan' },
          { kod: '10.1.4', ad: 'Akım ve Manyetik Alan' },
        ],
      },
      {
        kod: '10.2',
        ad: 'Basınç ve Kaldırma Kuvveti',
        konular: [
          { kod: '10.2.1', ad: 'Basınç' },
          { kod: '10.2.2', ad: 'Kaldırma Kuvveti' },
        ],
      },
      {
        kod: '10.3',
        ad: 'Dalgalar',
        konular: [
          { kod: '10.3.1', ad: 'Dalgalar' },
          { kod: '10.3.2', ad: 'Yay Dalgası' },
          { kod: '10.3.3', ad: 'Su Dalgası' },
          { kod: '10.3.4', ad: 'Ses Dalgası' },
          { kod: '10.3.5', ad: 'Deprem Dalgası' },
        ],
      },
      {
        kod: '10.4',
        ad: 'Optik',
        konular: [
          { kod: '10.4.1', ad: 'Aydınlanma' },
          { kod: '10.4.2', ad: 'Gölge' },
          { kod: '10.4.3', ad: 'Yansıma' },
          { kod: '10.4.4', ad: 'Düzlem Ayna' },
          { kod: '10.4.5', ad: 'Küresel Aynalar' },
          { kod: '10.4.6', ad: 'Kırılma' },
          { kod: '10.4.7', ad: 'Mercekler' },
          { kod: '10.4.8', ad: 'Prizmalar' },
          { kod: '10.4.9', ad: 'Renk' },
        ],
      },
      {
        kod: '11.1',
        ad: 'Kuvvet ve Hareket',
        konular: [
          { kod: '11.1.1', ad: 'Vektörler' },
          { kod: '11.1.2', ad: 'Bağıl Hareket' },
          { kod: '11.1.3', ad: 'Newton’ın Hareket Yasaları' },
          { kod: '11.1.4', ad: 'Bir Boyutta Sabit İvmeli Hareket' },
          { kod: '11.1.5', ad: 'İki Boyutta Hareket' },
          { kod: '11.1.6', ad: 'Enerji ve Hareket' },
          { kod: '11.1.7', ad: 'İtme ve Çizgisel Momentum' },
          { kod: '11.1.8', ad: 'Tork' },
          { kod: '11.1.9', ad: 'Denge ve Denge Şartları', ipucu: 'kütle merkezi' },
          { kod: '11.1.10', ad: 'Basit Makineler' },
        ],
      },
      {
        kod: '11.2',
        ad: 'Elektrik ve Manyetizma',
        konular: [
          { kod: '11.2.1', ad: 'Elektriksel Kuvvet ve Elektrik Alan' },
          { kod: '11.2.2', ad: 'Elektriksel Potansiyel' },
          { kod: '11.2.3', ad: 'Düzgün Elektrik Alan ve Sığa' },
          { kod: '11.2.4', ad: 'Manyetizma ve Elektromanyetik İndüklenme' },
          { kod: '11.2.5', ad: 'Alternatif Akım' },
          { kod: '11.2.6', ad: 'Transformatörler' },
        ],
      },
      {
        kod: '12.1',
        ad: 'Çembersel Hareket',
        konular: [
          { kod: '12.1.1', ad: 'Düzgün Çembersel Hareket' },
          { kod: '12.1.2', ad: 'Dönerek Öteleme Hareketi' },
          { kod: '12.1.3', ad: 'Açısal Momentum' },
          { kod: '12.1.4', ad: 'Kütle Çekim Kuvveti' },
          { kod: '12.1.5', ad: 'Kepler Kanunları' },
        ],
      },
      {
        kod: '12.2',
        ad: 'Basit Harmonik Hareket',
        konular: [{ kod: '12.2.1', ad: 'Basit Harmonik Hareket' }],
      },
      {
        kod: '12.3',
        ad: 'Dalga Mekaniği',
        konular: [
          { kod: '12.3.1', ad: 'Dalgalarda Kırınım, Girişim ve Doppler Olayı' },
          { kod: '12.3.2', ad: 'Elektromanyetik Dalgalar' },
        ],
      },
      {
        kod: '12.4',
        ad: 'Atom Fiziğine Giriş ve Radyoaktivite',
        konular: [
          { kod: '12.4.1', ad: 'Atom Kavramının Tarihsel Gelişimi' },
          { kod: '12.4.2', ad: 'Büyük Patlama ve Evrenin Oluşumu' },
          { kod: '12.4.3', ad: 'Radyoaktivite' },
        ],
      },
      {
        kod: '12.5',
        ad: 'Modern Fizik',
        konular: [
          { kod: '12.5.1', ad: 'Özel Görelilik' },
          { kod: '12.5.2', ad: 'Kuantum Fiziğine Giriş' },
          { kod: '12.5.3', ad: 'Fotoelektrik Olayı' },
          { kod: '12.5.4', ad: 'Compton Saçılması ve de Broglie Dalga Boyu' },
        ],
      },
      {
        kod: '12.6',
        ad: 'Modern Fiziğin Teknolojideki Uygulamaları',
        konular: [
          { kod: '12.6.1', ad: 'Görüntüleme Teknolojileri' },
          { kod: '12.6.2', ad: 'Yarı İletken Teknolojisi' },
          { kod: '12.6.3', ad: 'Süper İletkenler' },
          { kod: '12.6.4', ad: 'Nanoteknoloji' },
          { kod: '12.6.5', ad: 'Laser Işınları' },
        ],
      },
    ],
  },
  {
    anahtar: 'KIM',
    ad: 'Kimya',
    sayfa: '183-206',
    uniteler: [
      {
        kod: '9.1',
        ad: 'Kimya Bilimi',
        konular: [
          { kod: '9.1.1', ad: 'Simyadan Kimyaya' },
          { kod: '9.1.2', ad: 'Kimya Disiplinleri ve Kimyacıların Çalışma Alanları' },
          { kod: '9.1.3', ad: 'Kimyanın Sembolik Dili' },
          { kod: '9.1.4', ad: 'Kimya Uygulamalarında İş Sağlığı ve Güvenliği' },
        ],
      },
      {
        kod: '9.2',
        ad: 'Atom ve Periyodik Sistem',
        konular: [
          { kod: '9.2.1', ad: 'Atom Modelleri' },
          { kod: '9.2.2', ad: 'Atomun Yapısı' },
          { kod: '9.2.3', ad: 'Periyodik Sistem' },
        ],
      },
      {
        kod: '9.3',
        ad: 'Kimyasal Türler Arası Etkileşimler',
        konular: [
          { kod: '9.3.1', ad: 'Kimyasal Tür' },
          { kod: '9.3.2', ad: 'Kimyasal Türler Arası Etkileşimlerin Sınıflandırılması' },
          { kod: '9.3.3', ad: 'Güçlü Etkileşimler' },
          { kod: '9.3.4', ad: 'Zayıf Etkileşimler' },
          { kod: '9.3.5', ad: 'Fiziksel ve Kimyasal Değişimler' },
        ],
      },
      {
        kod: '9.4',
        ad: 'Maddenin Hâlleri',
        konular: [
          { kod: '9.4.1', ad: 'Maddenin Fiziksel Hâlleri' },
          { kod: '9.4.2', ad: 'Katılar' },
          { kod: '9.4.3', ad: 'Sıvılar' },
          { kod: '9.4.4', ad: 'Gazlar' },
          { kod: '9.4.5', ad: 'Plazma' },
        ],
      },
      {
        kod: '9.5',
        ad: 'Doğa ve Kimya',
        konular: [
          { kod: '9.5.1', ad: 'Su ve Hayat' },
          { kod: '9.5.2', ad: 'Çevre Kimyası' },
        ],
      },
      {
        kod: '10.1',
        ad: 'Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar',
        konular: [
          { kod: '10.1.1', ad: 'Kimyanın Temel Kanunları' },
          { kod: '10.1.2', ad: 'Mol Kavramı' },
          { kod: '10.1.3', ad: 'Kimyasal Tepkimeler ve Denklemler' },
          { kod: '10.1.4', ad: 'Kimyasal Tepkimelerde Hesaplamalar' },
        ],
      },
      {
        kod: '10.2',
        ad: 'Karışımlar',
        konular: [
          { kod: '10.2.1', ad: 'Homojen ve Heterojen Karışımlar' },
          { kod: '10.2.2', ad: 'Ayırma ve Saflaştırma Teknikleri', ipucu: 'karışımları ayırma' },
        ],
      },
      {
        kod: '10.3',
        ad: 'Asitler, Bazlar ve Tuzlar',
        konular: [
          { kod: '10.3.1', ad: 'Asitler ve Bazlar' },
          { kod: '10.3.2', ad: 'Asitlerin ve Bazların Tepkimeleri' },
          { kod: '10.3.3', ad: 'Hayatımızda Asitler ve Bazlar' },
          { kod: '10.3.4', ad: 'Tuzlar' },
        ],
      },
      {
        kod: '10.4',
        ad: 'Kimya Her Yerde',
        konular: [
          { kod: '10.4.1', ad: 'Yaygın Günlük Hayat Kimyasalları' },
          { kod: '10.4.2', ad: 'Gıdalar' },
        ],
      },
      {
        kod: '11.1',
        ad: 'Modern Atom Teorisi',
        konular: [
          { kod: '11.1.1', ad: 'Atomun Kuantum Modeli' },
          { kod: '11.1.2', ad: 'Periyodik Sistem ve Elektron Dizilimleri' },
          { kod: '11.1.3', ad: 'Periyodik Özellikler' },
          { kod: '11.1.4', ad: 'Elementleri Tanıyalım' },
          { kod: '11.1.5', ad: 'Yükseltgenme Basamakları' },
        ],
      },
      {
        kod: '11.2',
        ad: 'Gazlar',
        konular: [
          { kod: '11.2.1', ad: 'Gazların Özellikleri ve Gaz Yasaları' },
          { kod: '11.2.2', ad: 'İdeal Gaz Yasası' },
          { kod: '11.2.3', ad: 'Gazlarda Kinetik Teori' },
          { kod: '11.2.4', ad: 'Gaz Karışımları' },
          { kod: '11.2.5', ad: 'Gerçek Gazlar' },
        ],
      },
      {
        kod: '11.3',
        ad: 'Sıvı Çözeltiler ve Çözünürlük',
        konular: [
          { kod: '11.3.1', ad: 'Çözücü Çözünen Etkileşimleri' },
          { kod: '11.3.2', ad: 'Derişim Birimleri' },
          { kod: '11.3.3', ad: 'Koligatif Özellikler' },
          { kod: '11.3.4', ad: 'Çözünürlük' },
          { kod: '11.3.5', ad: 'Çözünürlüğe Etki Eden Faktörler' },
        ],
      },
      {
        kod: '11.4',
        ad: 'Kimyasal Tepkimelerde Enerji',
        konular: [
          { kod: '11.4.1', ad: 'Tepkimelerde Isı Değişimi' },
          { kod: '11.4.2', ad: 'Oluşum Entalpisi' },
          { kod: '11.4.3', ad: 'Bağ Enerjileri' },
          { kod: '11.4.4', ad: 'Tepkime Isılarının Toplanabilirliği' },
        ],
      },
      {
        kod: '11.5',
        ad: 'Kimyasal Tepkimelerde Hız',
        konular: [
          { kod: '11.5.1', ad: 'Tepkime Hızları' },
          { kod: '11.5.2', ad: 'Tepkime Hızını Etkileyen Faktörler' },
        ],
      },
      {
        kod: '11.6',
        ad: 'Kimyasal Tepkimelerde Denge',
        konular: [
          { kod: '11.6.1', ad: 'Kimyasal Denge' },
          { kod: '11.6.2', ad: 'Dengeyi Etkileyen Faktörler' },
          { kod: '11.6.3', ad: 'Sulu Çözelti Dengeleri' },
        ],
      },
      {
        kod: '12.1',
        ad: 'Kimya ve Elektrik',
        konular: [
          { kod: '12.1.1', ad: 'İndirgenme-Yükseltgenme Tepkimelerinde Elektrik Akımı' },
          { kod: '12.1.2', ad: 'Elektrotlar ve Elektrokimyasal Hücreler' },
          { kod: '12.1.3', ad: 'Elektrot Potansiyelleri' },
          { kod: '12.1.4', ad: 'Kimyasallardan Elektrik Üretimi' },
          { kod: '12.1.5', ad: 'Elektroliz' },
          { kod: '12.1.6', ad: 'Korozyon' },
        ],
      },
      {
        kod: '12.2',
        ad: 'Karbon Kimyasına Giriş',
        konular: [
          { kod: '12.2.1', ad: 'Anorganik ve Organik Bileşikler' },
          { kod: '12.2.2', ad: 'Basit Formül ve Molekül Formülü' },
          { kod: '12.2.3', ad: 'Doğada Karbon' },
          { kod: '12.2.4', ad: 'Lewis Formülleri' },
          { kod: '12.2.5', ad: 'Hibritleşme-Molekül Geometrileri' },
        ],
      },
      {
        kod: '12.3',
        ad: 'Organik Bileşikler',
        konular: [
          { kod: '12.3.1', ad: 'Hidrokarbonlar' },
          { kod: '12.3.2', ad: 'Fonksiyonel Gruplar' },
          { kod: '12.3.3', ad: 'Alkoller' },
          { kod: '12.3.4', ad: 'Eterler' },
          { kod: '12.3.5', ad: 'Karbonil Bileşikleri' },
          { kod: '12.3.6', ad: 'Karboksilik Asitler' },
          { kod: '12.3.7', ad: 'Esterler' },
        ],
      },
      {
        kod: '12.4',
        ad: 'Enerji Kaynakları ve Bilimsel Gelişmeler',
        konular: [
          { kod: '12.4.1', ad: 'Fosil Yakıtlar' },
          { kod: '12.4.2', ad: 'Alternatif Enerji Kaynakları' },
          { kod: '12.4.3', ad: 'Sürdürülebilirlik' },
          { kod: '12.4.4', ad: 'Nanoteknoloji' },
        ],
      },
    ],
  },
  {
    anahtar: 'BIY',
    ad: 'Biyoloji',
    sayfa: '207-226',
    uniteler: [
      {
        kod: '9.1',
        ad: 'Yaşam Bilimi Biyoloji',
        konular: [
          { kod: '9.1.1', ad: 'Biyoloji ve Canlıların Ortak Özellikleri' },
          {
            kod: '9.1.2',
            ad: 'Canlıların Yapısında Bulunan Temel Bileşikler',
            ipucu:
              'inorganik organik bileşikler su mineraller karbonhidratlar lipitler proteinler enzimler vitaminler hormonlar nükleik asitler ATP',
          },
        ],
      },
      {
        kod: '9.2',
        ad: 'Hücre',
        konular: [
          {
            kod: '9.2.1',
            ad: 'Hücre',
            ipucu: 'hücrenin yapısı kısımları hücre zarından madde geçişleri bilimsel yöntem',
          },
        ],
      },
      {
        kod: '9.3',
        ad: 'Canlılar Dünyası',
        konular: [
          { kod: '9.3.1', ad: 'Canlıların Çeşitliliği ve Sınıflandırılması' },
          { kod: '9.3.2', ad: 'Canlı Âlemleri ve Özellikleri', ipucu: 'virüsler' },
        ],
      },
      {
        kod: '10.1',
        ad: 'Hücre Bölünmeleri',
        konular: [
          { kod: '10.1.1', ad: 'Mitoz ve Eşeysiz Üreme' },
          { kod: '10.1.2', ad: 'Mayoz ve Eşeyli Üreme' },
        ],
      },
      {
        kod: '10.2',
        ad: 'Kalıtımın Genel İlkeleri',
        konular: [
          {
            kod: '10.2.1',
            ad: 'Kalıtım ve Biyolojik Çeşitlilik',
            ipucu:
              'Mendel ilkeleri çaprazlama eş baskınlık çok alellilik kan grupları eşeye bağlı kalıtım soyağacı genetik varyasyon',
          },
        ],
      },
      {
        kod: '10.3',
        ad: 'Ekosistem Ekolojisi ve Güncel Çevre Sorunları',
        konular: [
          {
            kod: '10.3.1',
            ad: 'Ekosistem Ekolojisi',
            ipucu: 'canlı cansız bileşenler beslenme şekilleri madde enerji akışı madde döngüleri',
          },
          { kod: '10.3.2', ad: 'Güncel Çevre Sorunları ve İnsan' },
          { kod: '10.3.3', ad: 'Doğal Kaynaklar ve Biyolojik Çeşitliliğin Korunması' },
        ],
      },
      {
        kod: '11.1',
        ad: 'İnsan Fizyolojisi',
        konular: [
          {
            kod: '11.1.1',
            ad: 'Denetleyici ve Düzenleyici Sistem, Duyu Organları',
            ipucu: 'sinir sistemi endokrin sistem endokrin bezler',
          },
          { kod: '11.1.2', ad: 'Destek ve Hareket Sistemi' },
          { kod: '11.1.3', ad: 'Sindirim Sistemi' },
          { kod: '11.1.4', ad: 'Dolaşım Sistemleri', ipucu: 'bağışıklık savunma mekanizmaları' },
          { kod: '11.1.5', ad: 'Solunum Sistemi' },
          { kod: '11.1.6', ad: 'Üriner Sistem' },
          { kod: '11.1.7', ad: 'Üreme Sistemi ve Embriyonik Gelişim' },
        ],
      },
      {
        kod: '11.2',
        ad: 'Komünite ve Popülasyon Ekolojisi',
        konular: [
          { kod: '11.2.1', ad: 'Komünite Ekolojisi' },
          { kod: '11.2.2', ad: 'Popülasyon Ekolojisi' },
        ],
      },
      {
        kod: '12.1',
        ad: 'Genden Proteine',
        konular: [
          { kod: '12.1.1', ad: 'Nükleik Asitlerin Keşfi ve Önemi' },
          {
            kod: '12.1.2',
            ad: 'Genetik Şifre ve Protein Sentezi',
            ipucu: 'genetik mühendisliği biyoteknoloji',
          },
        ],
      },
      {
        kod: '12.2',
        ad: 'Canlılarda Enerji Dönüşümleri',
        konular: [
          { kod: '12.2.1', ad: 'Canlılık ve Enerji' },
          { kod: '12.2.2', ad: 'Fotosentez' },
          { kod: '12.2.3', ad: 'Kemosentez' },
          {
            kod: '12.2.4',
            ad: 'Hücresel Solunum',
            ipucu: 'fermantasyon oksijenli oksijensiz solunum',
          },
        ],
      },
      {
        kod: '12.3',
        ad: 'Bitki Biyolojisi',
        konular: [
          { kod: '12.3.1', ad: 'Bitkilerin Yapısı' },
          { kod: '12.3.2', ad: 'Bitkilerde Madde Taşınması' },
          { kod: '12.3.3', ad: 'Bitkilerde Eşeyli Üreme' },
        ],
      },
      {
        kod: '12.4',
        ad: 'Canlılar ve Çevre',
        konular: [{ kod: '12.4.1', ad: 'Canlılar ve Çevre' }],
      },
    ],
  },
  {
    anahtar: 'FEL',
    ad: 'Felsefe',
    sayfa: '227-238',
    uniteler: [
      { kod: '10.1', ad: 'Felsefeyi Tanıma', ipucu: 'felsefeye giriş' },
      { kod: '10.2', ad: 'Felsefe ile Düşünme', ipucu: 'düşünme akıl yürütme felsefeyle' },
      {
        kod: '10.3',
        ad: 'Felsefenin Temel Konuları ve Problemleri',
        // Konu adları kazanım cümlelerinden kısaltıldı (ör. 10.3.1 "Varlık felsefesinin konusunu ve
        // problemlerini açıklar.").
        konular: [
          { kod: '10.3.1', ad: 'Varlık Felsefesi' },
          { kod: '10.3.2', ad: 'Bilgi Felsefesi' },
          { kod: '10.3.3', ad: 'Bilim Felsefesi' },
          { kod: '10.3.4', ad: 'Ahlak Felsefesi' },
          { kod: '10.3.5', ad: 'Din Felsefesi' },
          { kod: '10.3.6', ad: 'Siyaset Felsefesi' },
          { kod: '10.3.7', ad: 'Sanat Felsefesi' },
        ],
      },
      { kod: '10.4', ad: 'Felsefi Okuma ve Yazma', ipucu: 'felsefi metin analizi' },
      { kod: '11.1', ad: 'MÖ 6. Yüzyıl-MS 2. Yüzyıl Felsefesi' },
      { kod: '11.2', ad: 'MS 2. Yüzyıl-MS 15. Yüzyıl Felsefesi' },
      { kod: '11.3', ad: '15. Yüzyıl-17. Yüzyıl Felsefesi' },
      { kod: '11.4', ad: '18. Yüzyıl-19. Yüzyıl Felsefesi' },
      { kod: '11.5', ad: '20. Yüzyıl Felsefesi', ipucu: 'filozofları ana akımlar' },
    ],
  },
  {
    // Belgede ünite numarası kazanım koduna girmiyor; kod, ünite sırasıdır.
    anahtar: 'MAN',
    ad: 'Mantık',
    sayfa: '239-246',
    uniteler: [
      { kod: '1', ad: 'Mantığa Giriş' },
      { kod: '2', ad: 'Klasik Mantık' },
      { kod: '3', ad: 'Mantık ve Dil' },
      { kod: '4', ad: 'Sembolik Mantık' },
    ],
  },
  {
    anahtar: 'SOS',
    ad: 'Sosyoloji',
    sayfa: '247-257',
    uniteler: [
      { kod: '1', ad: 'Sosyolojiye Giriş' },
      { kod: '2', ad: 'Birey ve Toplum' },
      { kod: '3', ad: 'Toplumsal Yapı' },
      { kod: '4', ad: 'Toplumsal Değişme ve Gelişme' },
      { kod: '5', ad: 'Toplum ve Kültür', ipucu: 'kültür' },
      { kod: '6', ad: 'Toplumsal Kurumlar' },
    ],
  },
  {
    anahtar: 'PSI',
    ad: 'Psikoloji',
    sayfa: '258-270',
    uniteler: [
      { kod: '1', ad: 'Psikoloji Bilimini Tanıyalım' },
      { kod: '2', ad: 'Psikolojinin Temel Süreçleri' },
      { kod: '3', ad: 'Öğrenme, Bellek, Düşünme' },
      { kod: '4', ad: 'Ruh Sağlığının Temelleri' },
    ],
  },
];
