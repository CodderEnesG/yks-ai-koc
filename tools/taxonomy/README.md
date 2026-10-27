# Konu taksonomisi (T12)

Rapor 2.1 ilke 5 ve 2.5'in konu ağacı: müfredat sürümü `MEB-2027`, ders → ünite → konu. Katalogdaki MEB OGM
birimleri (32 kitap, 670 birim) bu ağaca bağlanır (`public.unit.topic_id`). Plan motoru ve haftalık rapor
ileride konu düzeyinde özet için kullanır; bugün plan birim üstünden çalışır.

```sh
node tools/taxonomy/match.ts               # eşleme: kural + kayıtlı kararlar (ücretsiz)
node tools/taxonomy/match.ts --claude      # kuralla çözülemeyenleri Haiku 5.5'e sorar (.env, ücretli)
node tools/taxonomy/match.ts --rapor       # birimleri başlığıyla ekrana döker (yalnız yerel inceleme)
node tools/taxonomy/seed-sql.ts > supabase/migrations/20261027160000_topic_taxonomy.sql
```

## Dosyalar

| Dosya                   | İçerik                                                                      |
| ----------------------- | --------------------------------------------------------------------------- |
| `meb-2027.ts`           | Taksonomi: resmî ad ve kod, eşleme için `ipucu` (veritabanına girmez)       |
| `lib.ts`                | Düzleştirme, kalıcı anahtar (`MAT/9.3.2`), UUID, Türkçe normalleştirme      |
| `match.ts`              | Birim → konu eşlemesi                                                       |
| `claude-kararlari.json` | Claude'un verdiği kararlar (`kitap:sıra` → konu anahtarı); yeniden sorulmaz |
| `unit-topic-map.json`   | Eşleme çıktısı; başlık içermez                                              |
| `seed-sql.ts`           | Migration üretici                                                           |

Kimlikler kaynaktan türetilir (`stableUuid`, katalog seed'iyle aynı fonksiyon): yeniden üretimde değişmez.
Migration elle düzenlenmez; değişiklik `meb-2027.ts` ya da karar dosyalarında yapılıp yeniden üretilir.

## Kaynak

MEB, "(ÖSYM tarafından 2026 yılında gerçekleştirilecek TYT, AYT ve YDT sınavlarına esas) Ortak derslere ait
kazanım ve açıklamalar" ([PDF](https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_11/26164023_2026_yks.pdf),
2026-10-27'de alındı). ÖSYM 2026-YKS kılavuzu adayları bu belgeden sorumlu tutar. **2027 sürümü yayımlanınca
karşılaştırılmalı** (adı `MEB-2027`, içerik 2026 belgesi).

Doğrulama (2026-10-27): ders dışındaki 501 adın 455'i belgenin metninde birebir geçiyor. Geçmeyen 46 ad:

- **Coğrafya (32):** belge konu değil kazanım veriyor. Konu, ardışık kazanım grubu (kod `9.1.1-9.1.3`); adı
  ünite açıklamasındaki konu listesinden kısaltıldı (editoryal). Ünite adları ("Küresel Ortam: Bölgeler ve
  Ülkeler", "Çevre ve Toplum") resmî; belgede yan sütunda satırlara bölündüğü için metin aramasında çıkmıyor.
- **Mantık, Sosyoloji, Psikoloji (12):** belgenin 239-270. sayfalarında gömülü yazı tipinin kodlaması kaymış
  (Latin harfler +29). Kaydırma çözülünce 14 ünite başlığının hepsi belgede birebir çıkıyor.
- **Biyoloji (1):** belgede yazım hatası ("Düzeleyici"); düzeltilmiş hali kullanıldı.
- **Türk Dili ve Edebiyatı (1):** dil bilgisi konuları belgede ünite tablolarının altında kodsuz geçiyor;
  "Cümlenin Ögeleri" bu listenin genel dil bilgisi adı (editoryal).

Ham kitap başlığı taksonomiye girmez (değişmez kural, rapor 1.3/5). Ders kitapları da aynı müfredat adlarını
kullandığı için bazı birim başlıkları taksonomi adıyla aynıdır; yön müfredat → kitap, tersi değil.

## Eşleme yöntemi

1. **Kural (556 birim):** başlık ve kitabın dersi, aday konuların adı ve `ipucu` sözcükleriyle karşılaştırılır.
   Başlığın en az %80'i bir adayla karşılanırsa kesin sayılır.
2. **Claude (102 birim sorulmuş, 98'i eşlendi):** kuralla belirsiz kalanlar kitap başına tek istekle
   `claude-haiku-5-5`'e sorulur (yapılandırılmış çıktı, aday listesi dışında yanıt reddedilir). Kararlar
   `claude-kararlari.json`'a yazılır, sonraki koşularda yeniden sorulmaz. İstekte birim başlığı ve aday konu
   adları vardır; kişisel veri yoktur.
3. **Elle (0):** `elle-kararlar.json` oluşturulursa her şeyin önüne geçer.

Girdi `data-private/meb-ogm/truth.json` (ham başlıklar; commit edilmez). Araç başlıkları yalnız bellekte okur.

## Eşlenmeyen 16 birim

| Birim                      | Neden                                                             |
| -------------------------- | ----------------------------------------------------------------- |
| `3adim-ydt-ingilizce:1-12` | YDT İngilizce taksonomisi **ERTELENDİ** (belge YDT'yi kapsamıyor) |
| `3adim-ayt-matematik:1-3`  | Karma temel kavram tekrarı; tek konuya bağlanamaz                 |
| `3adim-ayt-fizik:23`       | Karma çıkmış sorular; tek konuya bağlanamaz                       |

Bu birimlerde `topic_id` null kalır; plan birim üstünden çalıştığı için etkilenmez.

## Açık konular

- **NOT DEFINED:** sınav ağırlığı (`exam_weight`). Belge konu düzeyinde ağırlık vermiyor; tüm konularda null.
  Hangi konunun TYT, hangisinin AYT kapsamında olduğu da belgede ayrılmıyor.
- **NOT DEFINED:** Maarif modeli (`MAARIF-2028`) taksonomisi; program yayımlanınca ayrı sürüm olarak eklenir.
- Katalog dışı kitaplar (kullanıcının eklediği) bugün konuya bağlanmaz.
