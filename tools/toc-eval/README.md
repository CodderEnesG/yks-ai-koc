# toc-eval

İçindekiler okuma doğruluğunu ölçmek (T05) ve katalog tohumunu hazırlamak (T12) için MEB OGM'nin ücretsiz YKS kitaplarından doğru cevap veri seti.

Kaynak: [OGM Materyal](https://ogmmateryal.eba.gov.tr) — 17 "3 Adım Soru Bankası" ve 15 "Dört Dörtlük Konu Pekiştirme Testleri" PDF'i (TYT, AYT, YDT), toplam ≈0,8 GB. Bağlantılar `meb-ogm-sources.json`'da (2026-10-23).

**Telif:** PDF'ler, içindekiler görüntüleri ve ham başlıklar yalnız `data-private/` altında durur ve commit edilmez. Repoda yalnız bağlantılar, araçlar ve elle doğrulanmış düzeltmeler var.

## Kullanım

Kök dizinden, Node 22+ ve poppler (`brew install poppler`) ile:

```sh
node tools/toc-eval/download.ts        # PDF'leri data-private/meb-ogm/'ye indirir
node tools/toc-eval/extract-truth.ts   # doğru cevabı ve içindekiler görüntülerini üretir
```

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

## Sonuç (2026-10-23)

- 32/32 kitap, 670 birim. 649'u (%96,9) başlangıç sayfasında doğrulandı; kalan 21'in çoğu yazım farkı ("Kimyasal Tür" / "Kimyasal Türler"), en az biri gerçek tutarsızlık (TYT Matematik "Veri - 1").
- **Kitapların kendi içindekilerinde hata var:** 3 Adım AYT Coğrafya'da iki birim aynı sayfayı gösteriyor (elle düzeltildi), TYT Coğrafya'da bir numara tekrar ediyor. Öğrenci onay ekranı bu yüzden gerekli (rapor 2.8).
- **ISBN kitabı tek başına tanımlamıyor:** 3 Adım serisinde dersler ortak takım ISBN'i taşıyor (ör. TYT Tarih, Coğrafya, Felsefe, Türkçe: 978-975-11-5998-4). Barkod araması bu seride ders seçimi istemeli.
- **Sınırlama:** Görüntüler temiz PDF render'ı; gerçek telefon fotoğrafı (eğiklik, gölge, bulanıklık) değil. T05'teki doğruluk iyimser çıkar; birkaç gerçek fotoğrafla ya da yapay bozulmayla tamamlanmalı.
