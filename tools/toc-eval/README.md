# toc-eval

İçindekiler okuma doğruluğunu ölçmek (T05) ve katalog tohumunu hazırlamak (T12) için MEB OGM'nin ücretsiz YKS kitaplarından doğru cevap veri seti.

Kaynak: [OGM Materyal](https://ogmmateryal.eba.gov.tr) — 17 "3 Adım Soru Bankası" ve 15 "Dört Dörtlük Konu Pekiştirme Testleri" PDF'i (TYT, AYT, YDT), toplam ≈0,8 GB. Bağlantılar `meb-ogm-sources.json`'da (2026-10-23).

**Telif:** PDF'ler, içindekiler görüntüleri ve ham başlıklar yalnız `data-private/` altında durur ve commit edilmez. Repoda yalnız bağlantılar, araçlar ve elle doğrulanmış düzeltmeler var.

## Kullanım

Kök dizinden, Node 22+ ve poppler (`brew install poppler`) ile:

```sh
node tools/toc-eval/download.ts        # PDF'leri data-private/meb-ogm/'ye indirir
node tools/toc-eval/extract-truth.ts   # doğru cevabı ve içindekiler görüntülerini üretir
node tools/toc-eval/make-photos.ts     # telefon fotoğrafı benzeri bozulmuş kopyalar
node tools/toc-eval/run-eval.ts --images photo   # modelleri ölç (.env gerekli; ücretli API çağrısı)
```

Ölçüm `.env`'den `ANTHROPIC_API_KEY` ile Claude'u, `GOOGLE_CLOUD_PROJECT` + gcloud kimlik bilgisiyle Vertex AI üzerinden Gemini'ı çağırır. Modellerin okumaları `data-private/meb-ogm/eval/<tarih>/`'e yazılır.

Çıktılar (`data-private/meb-ogm/`):

- `truth.json`: kitap başına ISBN, PDF sayfa sayısı, basılı sayfa kayması, içindekiler sayfası ve birimler (sıra, başlık, basılı başlangıç/bitiş sayfası, `dogrulandi`).
- `toc/<id>.png`: içindekiler sayfası, 150 dpi. Temiz PDF görüntüsü; telefon fotoğrafından kolaydır.
- `elle-bakilacak.txt`: başlığı başlangıç sayfasında bulunamayan birimler.

## Doğru cevap nasıl üretiliyor

1. İçindekiler sayfası PDF'in metin katmanından okunur (`pdftotext -layout`). Numaralı ("3 Adım") ve numarasız ("Konu Pekiştirme") biçimler desteklenir; cevap anahtarı ve kaynakça birim sayılmaz.
2. Birimin bitişi, sonraki birimin başlangıcından bir önceki sayfadır.
3. Basılı sayfa ile PDF sayfası arasındaki kayma beş örnek sayfadan çoğunluk oyuyla ölçülür (çoğu kitapta 2).
4. Bağımsız kontrol: her birimin başlığı, başlangıç sayfasının üst kısmında aranır.
5. Kitabın kendi içindekilerindeki hatalar `kaynakHatalari`'na yazılır. Elle doğrulananlar `truth-overrides.json`'da kanıtıyla düzeltilir.

## T05 model karşılaştırması (2026-10-24)

Her model 32 içindekiler görüntüsünü yapılandırılmış JSON'a çevirdi; doğru cevapla sırayla hizalanarak puanlandı. Elle düzeltilen 1 birim (kitabın kendi hatası) ölçüme girmedi: 669 birim.

**Fotoğraf benzeri görüntüler** (eğik, kaymalı, bulanık, gölgeli, 900-1200 px, JPEG %45-65):

|                                 | Haiku 5.5, efor medium (varsayılan) | Haiku 5.5, efor low | Gemini 3.5 Flash-Lite (Vertex)                           |
| ------------------------------- | ----------------------------------- | ------------------- | -------------------------------------------------------- |
| Sayfa doğruluğu                 | **669/669 (%100)**                  | 667/669 (%99,7)     | 662/669 (%99,0)                                          |
| Başlık birebir aynı             | 659/669 (%98,5)                     | 634/667 (%95,0)     | 485/662 (%73,3)                                          |
| Düzeltmesiz kitap               | **32/32**                           | 31/32               | 26/32                                                    |
| Token (32 kitap, girdi / çıktı) | 98.724 / 61.029                     | 98.724 / 47.576     | 47.638 / 26.819                                          |
| Maliyet (tahmin)                | ≈0,040$ (≈0,0013$/kitap)            | ≈0,034$             | ölçülmedi (fiyat doğrulanmadı; idea-factory faturasında) |

Temiz PDF görüntülerinde üçü de sayfada %100; başlıkta Haiku 667-668/669, Gemini 627/669.

**Sonuç:** Haiku 5.5 varsayılan eforla rapordaki eşiği (sayfa doğruluğu ≥%95) fotoğraf benzeri görüntülerde de geçiyor ve Gemini'dan açıkça iyi. Gemini'ı ikinci sağlayıcı olarak eklemek için gerekçe yok (rapor 2.2: "açık farkla kazanırsa"). Haiku maliyeti rapor 2.9'daki kitap başı ≈0,00125$ tahminiyle uyumlu (fiyat: girdi 0,10$, çıktı 0,50$ / MTok; çıktıya düşünme token'ları dahil).

**Sınırlamalar:** Bozulma yapay; gerçek fotoğraftaki kıvrık sayfa, parlama, parmak, kırpılmış kenar ve çok sayfalı içindekiler denenmedi. MEB kitaplarının dizgisi sade; ticari yayınevlerinin çok sütunlu, renkli içindekileri daha zor olabilir. Öğrencinin düzeltme süresi (<60 sn hedefi) arayüz olmadan ölçülemedi. Gerçek telefon fotoğraflarıyla 5-10 örneklik bir kontrol T11 öncesinde yapılmalı.

## Doğru cevap çıkarımı (2026-10-23)

- 32/32 kitap, 670 birim. 649'u (%96,9) başlangıç sayfasında doğrulandı; kalan 21'in çoğu yazım farkı ("Kimyasal Tür" / "Kimyasal Türler"), en az biri gerçek tutarsızlık (TYT Matematik "Veri - 1").
- **Kitapların kendi içindekilerinde hata var:** 3 Adım AYT Coğrafya'da iki birim aynı sayfayı gösteriyor (elle düzeltildi), TYT Coğrafya'da bir numara tekrar ediyor. Öğrenci onay ekranı bu yüzden gerekli (rapor 2.8).
- **ISBN kitabı tek başına tanımlamıyor:** 3 Adım serisinde dersler ortak takım ISBN'i taşıyor (ör. TYT Tarih, Coğrafya, Felsefe, Türkçe: 978-975-11-5998-4). Barkod araması bu seride ders seçimi istemeli.
- **Sınırlama:** Görüntüler temiz PDF render'ı; gerçek telefon fotoğrafı (eğiklik, gölge, bulanıklık) değil. T05'teki doğruluk iyimser çıkar; birkaç gerçek fotoğrafla ya da yapay bozulmayla tamamlanmalı.
