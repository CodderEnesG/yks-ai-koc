# Gün raporu — 22-23 Ekim 2026

Tarihli kayıt, kanonik değil. Güncel durum [PROJECT-STATE](../PROJECT-STATE.md)'te, stack [TECH-STACK](../TECH-STACK.md)'te.

## Özet

Sprint 0'ın ilk iki günü. Teknoloji seçimi yapıldı, monorepo iskeleti kuruldu ve iki platformda çalıştırıldı, plan motorunun çekirdeği property testleriyle yazıldı, içindekiler okuma testi (T05) için fotoğraf yerine MEB'in ücretsiz kitaplarından doğru cevap veri seti çıkarıldı.

| Görev | Durum |
|---|---|
| T02 monorepo iskeleti + CI | Tamam |
| T04 plan motoru çekirdeği + property testleri | Tamam (neden kuralları T14'te, video T32'de) |
| T05 içindekiler çıkarım testi | Veri hazır; model karşılaştırması API anahtarı bekliyor |
| T01, T03, T06-T08 | Kurucularda (aşağıda) |

## Kararlar

- **Platform:** React Native / Expo SDK 58, iOS + Android (karar 10 kapandı).
- **UI:** Tamagui istendi; araştırmada v3'ün 12 günlük olduğu, AI araçlarının eski API ürettiği ve native performans iddiasının bağımsız ölçümle desteklenmediği görüldü. Kurucular öneri istedi → Uniwind + RN Reusables.
- **Yerel veri:** expo-sqlite + Drizzle + kendi sync'imiz (yeni veri işleyen yok, onay öncesi tamamen yerel).
- **Monorepo:** pnpm workspaces; plan motoru mobil, web ve Deno'da aynı kaynaktan çalışsın diye.
- **Kurucu sözleşmesi:** Tamamlandı (karar 1 kapandı).
- **T05 verisi:** Fotoğraf yerine MEB OGM PDF'lerinin içindekiler sayfaları.

Gerekçeler ve elenen seçenekler: [PLAN-2026-10-22](../PLAN-2026-10-22-teknoloji-secimi-ve-t02.md), [TECH-STACK](../TECH-STACK.md).

## Yapılanlar

**T02 iskeleti** (`eff2210`): pnpm 10 monorepo, `apps/mobile` (Expo SDK 58, Expo Router, Uniwind + Reusables, expo-sqlite + Drizzle), `apps/web` (Next.js 16), `packages/plan-engine`, GitHub Actions (Prettier, typecheck, lint, test, `deno check`). Doğrulananlar:

- Android dev build ve iOS dev build açılıyor; "Bugün" ekranı plan motorundan İstanbul tarihini gösteriyor.
- SQLite yazma, `useLiveQuery` ve yeniden başlatmada kalıcılık Android'de denendi (iOS'ta aynı JS, elle denenmedi).
- `plan-engine` `.ts` uzantılı import'larla Metro, Next ve Deno'da derleniyor; Deno'ya import map ile kaynak koddan alınıyor. Supabase deploy'unun `supabase/` dışını paketlemesi T03'te doğrulanacak.
- Lint, render sırasında çağrılan `Date.now()`'ı yakaladı (React Compiler saflık kuralı); düzeltildi.

**TECH-STACK** (`e175ffb`): Kurulu ve planlanan kütüphaneler, sabit sürümler, AI ile kod yazarken sık hatalar, elenen seçenekler.

**T04 plan motoru** (`5942d68`): `buildPlan` sayfa ve test birimlerini günlere dağıtıyor: sınavdan 21 gün önce biter, kitaplar kalan işleri oranında paralel ilerler, boş kapasite sırayla doldurulur, gün en fazla %10 aşılır, aşırı yükte öncelik skoruna göre çekirdek seçilir. Süreler tamsayı saniye. 25 test; rapor 2.6'daki property'ler (video hariç) ve günün açgözlü doldurulması. Testlerin hata yakaladığı, motora bilerek hata sokularak denendi: ilk turda iki hata yakalanmadı (üreteç aşırı yük durumunu nadiren üretiyordu, bir değişmez test edilmiyordu); üreteç ve testler düzeltildi.

**T05 verisi** (`b45912f`): MEB OGM'nin 32 ücretsiz YKS kitabı (3 Adım, Konu Pekiştirme; ≈0,8 GB) `data-private/`'a indirildi. `tools/toc-eval/extract-truth.ts` içindekiler sayfasını metin katmanından okuyor: 32/32 kitap, 670 birim; 649'u (%96,9) başlangıç sayfasında bağımsız olarak doğrulandı, 21'i elle bakılacak listesinde.

## Bulgular

- **MEB kitaplarının içindekilerinde hata var:** 3 Adım AYT Coğrafya'da iki birim aynı sayfayı gösteriyor (sayfadan doğrulanıp düzeltildi), TYT Coğrafya'da numara tekrar ediyor, TYT Matematik'te bir başlık sayfayla uyuşmuyor. Öğrenci onay ekranı gerekli (rapor 2.8).
- **ISBN kitabı tek başına tanımlamıyor:** 3 Adım serisinde dersler ortak takım ISBN'i taşıyor. Barkod aramasında ders seçimi gerekecek.
- **Basılı sayfa PDF sayfasından genellikle 2 geride;** doğru cevap basılı numarayla tutuluyor.
- **Supabase'in yerleşik e-postası production'da OTP göndermiyor;** özel SMTP yeni bir veri işleyen demek (açık karar 13).
- **Elle sync tahmini T16'daki 8 saati aşıyor;** "cihaz asıl kaynak, sunucu kopya" önerisi 8-12 saat (açık karar 14).
- **Öncelik skoru ağırlıkları raporda tanımlı değil** (NOT DEFINED); varsayılan kullanılıyor. Takvim çok sıkışırsa motor bir kitabın önceki bölümünü atlayıp sonrakini seçebilir.
- **Sınırlama:** T05 görüntüleri temiz PDF render'ı; telefon fotoğrafındaki doğruluk daha düşük çıkar.

## Kurucularda bekleyenler

- Supabase hesabı (Enes) → T03 başlar.
- Apple Developer kaydı (T01).
- Marka, App Store adı, alan adı (karar 8). Ad gelince bundle ID `dev.placeholder.ykskoc`'tan App Store Connect kaydından **önce** değiştirilir.
- Rıza metinleri (T07), ton rehberi ve kriz protokolü (T06), bekleme listesi (T08): sonra.
- T05 model karşılaştırması için Anthropic ve Google API anahtarları (`.env`, commit edilmez).
- Açık kararlar 13 (e-posta sağlayıcı) ve 14 (sync kapsamı): T16 öncesi, ≈5 Kasım.

## Ortam notları

- Terminalde PATH'te önce Antigravity'nin Node 20'si geliyor; SDK 58 en az Node 22.13 istiyor. `nvm use` ve `corepack enable pnpm` gerekli.
- CocoaPods Homebrew ile kuruldu (iOS build için).
- Android emülatörü ve iOS simülatörü aynı anda çalışınca makine zorlanıyor; tek cihazla çalışılacak (önce iOS).

## Sıradaki

T09 kurulum akışı (alan, hedef, sınav tarihi, günlük süre, yaş kapısı) ya da API anahtarları gelirse T05 ölçümü; Supabase hesabı açılınca T03.
