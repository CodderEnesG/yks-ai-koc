# YKS AI Koç

Öğrencinin elindeki kitaplara ve izlediği YouTube ders listelerine göre her gün sayfa, test ve video düzeyinde plan çıkaran, planı akşamları takip eden, aksayan bir şey olursa nedenini sorup planı yeniden kuran ve haftalık özeti veliye gönderen mobil AI koç.

YKS AI Koç (çalışma adı) YKS'ye hazırlanan 11. ve 12. sınıf öğrencileri ile mezunlar içindir. Uygulamayı öğrenci kullanır, ödemeyi çoğunlukla veli yapar. Değer AI'ın zekâsından gelmiyor, takipten geliyor: plan yapmak kolay, onu her gün uygulatmak zor. Planı kural motoru hesaplar; AI konuşur, yorumlar ve içindekiler sayfasını okur.

Repo ürün ve karar belgelerini ve pnpm monorepo'yu içerir: `apps/mobile` (Expo SDK 58), `apps/web` (Next.js 16), `packages/plan-engine` (saf TS).

## Buradan başla

1. Bu README'yi oku.
2. Güncel durum, açık kararlar ve sıradaki iş için [PROJECT-STATE](docs/PROJECT-STATE.md)'i oku.
3. Teknik mimari, iş modeli, takvim ve görev listesi için [final raporu](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.md) oku ([PDF](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.pdf)).
4. Kodlama ajanı kullanıyorsan [AGENTS](AGENTS.md)'ı oku. Claude Code [CLAUDE](CLAUDE.md) üzerinden girer.

Repo projenin ortak hafızası. Kararlar ya da yürütme durumu anlamlı biçimde değişince ilgili belgeyi güncelle.

## Belgeler

- [PROJECT-STATE](docs/PROJECT-STATE.md): güncel aşama, kararlar, açık sorular ve yol haritası. Değişiklik günlüğü değildir.
- [REPORT-2026-10-21-final-teknik-ve-is-modeli](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.md): başlangıç kararı. İçinde stack, veri modeli, plan motoru, YouTube oynatma listeleri, AI ve güvenlik katmanı, KVKK ve veli onayı, ödeme, 39 görevlik inşa planı, birim ekonomisi, senaryolar ve bütçe var.
- [TECH-STACK](docs/TECH-STACK.md): kullanılan ve planlanan kütüphaneler, sabit sürümler, kodlama kuralları ve elenen seçenekler. Yaşayan belge.
- [PLAN-2026-10-22-teknoloji-secimi-ve-t02](docs/PLAN-2026-10-22-teknoloji-secimi-ve-t02.md): teknoloji seçiminin araştırması ve T02 planı (tarihli kayıt, uygulandı).
- Tarihli kaynak belgeler (o güne ait kayıt, kanonik değil) — `docs/sources/`:
  - [2026-10-15-urun-ve-is-modeli-v1.pdf](docs/sources/2026-10-15-urun-ve-is-modeli-v1.pdf): ürün döngüleri, MVP kapsamı, mimari taslağı, paketler.
  - [2026-10-08-kaynak-kitap-verisi-fizibilitesi.md](docs/sources/2026-10-08-kaynak-kitap-verisi-fizibilitesi.md): veri, hukuk ve maliyet araştırması (koşullu GO).
  - [2026-10-08-kaynak-kitap-verisi-ozet.md](docs/sources/2026-10-08-kaynak-kitap-verisi-ozet.md): fizibilitenin yönetici özeti.

Henüz yazılmayanlar: `PRODUCT.md` (kanonik ürün tanımı, gereksinim kimlikleriyle), `ARCHITECTURE.md` ve `DESIGN.md`. Hangi sırayla yazılacakları PROJECT-STATE'te.

## Geliştirme

Gerekenler: Node 22 (`.nvmrc`), pnpm (sürüm `package.json`'daki `packageManager` alanından; `corepack enable pnpm` ile gelir), Deno 2, iOS için Xcode + CocoaPods, Android için Android Studio + JDK 17.

```sh
nvm use                 # Node 22; `node -v` 22 göstermeden kurulum yapma
corepack enable pnpm
pnpm install
pnpm typecheck && pnpm lint && pnpm test   # CI ile aynı kontroller
pnpm --filter @yks/mobile ios              # dev build, iOS simülatör
pnpm --filter @yks/mobile android          # dev build, Android emülatör
pnpm --filter @yks/mobile start            # Metro
pnpm --filter @yks/web dev                 # http://localhost:3000
```

Expo paketleri `apps/mobile` içinde `pnpm exec expo install <paket>` ile kurulur; böylece SDK 58'in sabitlediği sürüm gelir.
