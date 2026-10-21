# YKS AI Koç

Öğrencinin elindeki kitaplara göre her gün sayfa ve test düzeyinde plan çıkaran, planı akşamları takip eden, aksayan bir şey olursa nedenini sorup planı yeniden kuran ve haftalık özeti veliye gönderen mobil AI koç.

YKS AI Koç (çalışma adı) YKS'ye hazırlanan 11. ve 12. sınıf öğrencileri ile mezunlar içindir. Uygulamayı öğrenci kullanır, ödemeyi çoğunlukla veli yapar. Değer AI'ın zekâsından gelmiyor, takipten geliyor: plan yapmak kolay, onu her gün uygulatmak zor. Planı kural motoru hesaplar; AI konuşur, yorumlar ve içindekiler sayfasını okur.

Bu repo şu an yalnızca ürün ve karar belgelerini içeriyor. Uygulama kodu Sprint 0'da (22 Ekim 2026) başlıyor.

## Buradan başla

1. Bu README'yi oku.
2. Güncel durum, açık kararlar ve sıradaki iş için [PROJECT-STATE](docs/PROJECT-STATE.md)'i oku.
3. Teknik mimari, iş modeli, takvim ve görev listesi için [final raporu](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.md) oku ([PDF](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.pdf)).
4. Kodlama ajanı kullanıyorsan [AGENTS](AGENTS.md)'ı oku. Claude Code [CLAUDE](CLAUDE.md) üzerinden girer.

Repo projenin ortak hafızası. Kararlar ya da yürütme durumu anlamlı biçimde değişince ilgili belgeyi güncelle.

## Belgeler

- [PROJECT-STATE](docs/PROJECT-STATE.md): güncel aşama, kararlar, açık sorular ve yol haritası. Değişiklik günlüğü değildir.
- [REPORT-2026-10-21-final-teknik-ve-is-modeli](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.md): başlangıç kararı. İçinde stack, veri modeli, plan motoru, AI ve güvenlik katmanı, KVKK ve veli onayı, ödeme, 30 görevlik inşa planı, birim ekonomisi, senaryolar ve bütçe var.
- Tarihli kaynak belgeler (o güne ait kayıt, kanonik değil) — `docs/sources/`:
  - [2026-10-15-urun-ve-is-modeli-v1.pdf](docs/sources/2026-10-15-urun-ve-is-modeli-v1.pdf): ürün döngüleri, MVP kapsamı, mimari taslağı, paketler.
  - [2026-10-08-kaynak-kitap-verisi-fizibilitesi.md](docs/sources/2026-10-08-kaynak-kitap-verisi-fizibilitesi.md): veri, hukuk ve maliyet araştırması (koşullu GO).
  - [2026-10-08-kaynak-kitap-verisi-ozet.md](docs/sources/2026-10-08-kaynak-kitap-verisi-ozet.md): fizibilitenin yönetici özeti.

Henüz yazılmayanlar: `PRODUCT.md` (kanonik ürün tanımı, gereksinim kimlikleriyle), `ARCHITECTURE.md` ve `DESIGN.md`. Hangi sırayla yazılacakları PROJECT-STATE'te.
