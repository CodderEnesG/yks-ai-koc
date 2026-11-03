# PLAN-2026-11-03: lamba tanıtım sitesi (T40)

Tarihli plan kaydı. Kurucu onayı: 2026-11-03. Uygulama durumu ve güncel kararlar [PROJECT-STATE](PROJECT-STATE.md)'te; bu belge plan anındaki gerekçeyi tutar. Kaynaklar: final rapor 1.3, 2.11, 3.1, 3.8; [ürün ve iş modeli v1](sources/2026-10-15-urun-ve-is-modeli-v1.pdf) ("örnek bir gün" akışı); lamba-design ve marka kılavuzu; 3 araştırma ajanının bulguları (hover.dev, referans siteler, GSAP/Lenis/R3F uyumu).

## Bağlam

`apps/web` kök sayfası bugün iki paragraf. Landing üç işe yarayacak: beta kitlesini toplamak (T08; rapor 3.8: 100-150 kişi), App Store gönderiminin (T27, 14 Aralık) istediği destek ve gizlilik adreslerini vermek, WhatsApp'ta paylaşılınca düzgün kart göstermek.

Kurucu kararları (2026-11-03): bekleme listesi **kendi formumuz (Supabase)**; **önce öğrenci, sonra veli**; kapsam **/destek, /gizlilik iskeleti, SEO ve paylaşım kartı**; görseller **Alaaddin + kodla kart taklidi + gerçek ekran görüntüleri** (kullanıcı yükleyecek); tasarım **bol animasyonlu, kaydırma güdümlü**; **hover.dev ücretsiz set**, **GSAP + Lenis**, **Three.js: duman shader'ı + 3D lamba slotu + kare dizisi slotu**; skill'ler **kullanıcı düzeyine** kurulur; "AI şablonu" hissi en aza iner.

Araştırma özeti (3 ajan, 2026-11-03): GSAP 3.15 tüm eklentileriyle ücretsiz (ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG). hover.dev ücretsiz bileşenler `motion/react` kullanır, ticari kullanım serbest, Tailwind 4'te küçük sınıf düzeltmeleri gerekir. Lenis 1.3.27 `respectReducedMotion` açık, dokunmatikte native. R3F 9.8.2 React 19.3 ile uyumlu (`<19.4`). **Cloudflare'in 3 MiB Worker sınırı 4 Eylül 2026'da kalktı** (64 MiB sıkıştırmasız); statik dosyalar sayılmaz; asıl sınır ücretsiz planda 10 ms CPU/istek. Referanslar: Sparkle (kaydırdıkça yıldız kazan), Grail, Opal (tek metafor), Fluently (ikon kartı yerine gerçek arayüz parçası), Sleep Well Creative (bölüm sayacı, illüstrasyonlu sahne), INK Games Codrops vakası (Next + R3F + GSAP + Lenis, tek canvas), Apple kare dizisi (poster yedek, kırılım başına ayrı set).

## Yayın kapıları (kod bunları beklemez, canlı bunlara bağlı)

| Kapı | Neyi bekletiyor |
|---|---|
| Karar 8: alan adı (lambayks.com / seninlamban.com; "koç" geçen aday marka kuralıyla çelişir) | `NEXT_PUBLIC_SITE_URL`, paylaşım kartı, iletişim e-postası |
| Karar 15: barındırma (Cloudflare Workers artık boyut sorunu değil; CPU sınırı için statik sayfa + ücretli 5$/ay yedek, ya da Vercel Pro fra1) | Yayın |
| T07: aydınlatma metni (avukat) | Formun açılması (`NEXT_PUBLIC_WAITLIST_OPEN`), /gizlilik içeriği |
| Karar 13: e-posta sağlayıcı | Çift onaylı kayıt; o gelene kadar tek adımlı kayıt, davetler elle |
| Kullanıcı: ekran görüntüleri | Bölüm 4-5'in gerçek görselleri (gelene kadar kart taklidi) |
| Muhammed (isteğe bağlı): lamba GLB'si, 45-90 karelik lamba yanış dizisi | 3D lamba ve kare dizisi slotları (gelmezse duman shader'ı ve ekran geçişleri kalır) |

## Tasarım fikri

Tek metafor, baştan sona: **sayfa gece moruyla ve sönük bir lambayla açılır; kaydırdıkça fitil yanar, ışık günün planını aydınlatır, akşam check-in'de kısılır, Pazar velinin önüne "lamba ışığında" bir rapor gelir.** Üst çubukta ince bir "fitil" çizgisi ilerlemeyi gösterir (Sparkle'ın yıldız sayacı fikri). Her bölüm bu hikâyenin bir saati; süs animasyonu yok, her hareket bir şeyi anlatır.

"AI şablonu" karşı kuralları (kaynaklar: Anthropic frontend-design, DevDigest 16 kalıp, NN/g): ortalanmış hero + rozet + iki düğme yok; üçlü ikon kartı yok; numaralı 1-2-3 adım kartı yok; mor-mavi gradyan, glow, cam efekti yok; sahte yorum, logo duvarı, yuvarlak sayı yok; her bölümde aynı "fade-up" yok; scrolljack yok (Lenis kaydırmayı yavaşlatmaz, yumuşatır). Tipografi (Bricolage, çok büyük, asimetrik dizgi) ana tasarım öğesi; gerçek Türkçe arayüz (TYT/AYT, sayfa aralığı, net) ve değişen durumlu Alaaddin kimliği taşır. Marka: turuncu yalnız gece moru zeminde, kırmızı/yeşil yok, logo dumansız (owner kararı), bir ekranda en fazla bir Alaaddin, parıltılı lamba yalnız özel anda (listeye katılınca).

Landing sanat yönetimli: bölümler gece moru ve krem arasında geçer; sistem temasını izlemez. /destek ve /gizlilik mevcut `PageShell` ile tema izler.

## Bölümler ve hareket

Masaüstü → mobil davranışı `gsap.matchMedia()` ile; "(prefers-reduced-motion: reduce)" dalında pin, parallax, duman ve kaydırma-süpürme kapanır, yalnız kısa opaklık geçişleri kalır.

| # | Bölüm | İçerik | Hareket (masaüstü) | Mobil |
|---|---|---|---|---|
| 1 | Üst çubuk | Yatay dumansız logo, 3 çapa (Nasıl çalışır · Veliler · SSS), "Listeye katıl" | Aşağı kaydırınca gizlenir, yukarıda çıkar; altında **fitil çizgisi** (ScrollTrigger progress). Çapalar hover.dev **Reveal Links** | Çapalar gizli, logo + düğme |
| 2 | Hero · "Kibrit" | H1 "Kendi kitaplarınla, her gün ne yapacağını bil." Alt metin 2 cümle. Tek düğme. Sağda SVG lamba (turuncu simge), ağzından **WebGL duman** | SplitText satır maskesi ile başlık; lamba `lamp-dim` griden turuncuya ScrollTrigger ile yanar (LampGlow'un web karşılığı); duman yoğunluğu kaydırma ve fare ile artar; DrawSVG ile fitil çizilir (<600 ms, preloader yok) | Duman yalnız GPU tier ≥2 ve `saveData` kapalıysa; yoksa statik SVG duman (`duman-durumlari/sakin`). LCP = H1 metni |
| 3 | "Herkes aynı kitaptan çalışmıyor" | Hazır müfredat yerine senin kitabın, senin hızın (mağaza metninden) | hover.dev **Velocity Text**: "TYT Matematik · s. 212-221 · Test 14-15 · Vektörler · 24 dk video · Yaptım · Yarım kaldı" kaydırma hızıyla eğilir; zemin gece morundan kreme tween | Kısa pin (1.2×vh) |
| 4 | "Bir gün" · ürünün kalbi | 4 saat: **07:30** "Bugünün planı hazır: ≈ 2 sa · 2 kitap" → **gün içi** görev kartı (kitap: "s. 41-58 · ≈ 50 dk"; video kartı: başlık, kanal, süre, "YouTube'da aç") → **21:00** check-in (Yaptım / Yarım kaldı / Yapamadım; "Konu zor geldi") → **gece** plan kendini yeniden kurar ("s. 38-41 iki güne bölündü, seri bozulmadı"). Örnek v1 kaynağındaki "Elif"ten, temsili kitap adlarıyla; MVP'de olmayan tekrar/deneme/FSRS geçmez | 100svh pin; solda telefon (hover.dev **Floating Phone** CSS 3D), sağda bölüm metni. Ekran içinde **gerçek ekran görüntüleri** scrub ile geçer (**kare dizisi slotu**: aynı ScrollTrigger; kareler gelirse `imageSequenceScrub` canvas'a döner). Kart taklidi gerçek DOM: check-in çipleri basılır, kartlar **Flip** ile yeniden dizilir. Lamba köşede: akşam kısılır, gece söner, sabah yanar | Pin yok; 4 saat alt alta, her biri kendi görüntüsüyle, `whileInView` kısa geçiş |
| 5 | "Uygulamayı açınca" | Gerçek ekran görüntüleri: Bugün, kütüphane, Alaaddin sohbeti, ayarlar/destek | hover.dev **Horizontal Scroll Carousel** (dikey kaydırma yatay galeri) | Native yatay `scroll-snap` (Lenis dokunmatikte kapalı) |
| 6 | Alaaddin | "Takıldığında Alaaddin'e yaz." Soru çözmez, senin yerine çalışmaz; zor günde plan cezalandırmadan hafifler. Küçük not: "Alaaddin bir yapay zekâ; velin sohbetini görmez" | hover.dev **Text Parallax Content** uyarlaması: yapışkan Alaaddin sahnesi; kaydırdıkça durum sakin → düşünüyor → mutlu; sohbet balonları SplitText ile yazılır | Sahne tek görsel (sakin), balonlar sırayla |
| 7 | Veliler için | "Çalıştığını görün, konuştuklarını değil." Haftalık rapor; sohbet asla gösterilmez; 18 yaş altı için veli onayı, aynı linkten geri çekilir | Zemin kreme döner; iki sütun: solda yapışkan başlık, sağda **rapor kartı taklidi** kendini kurar (günler tiklenir, çubuklar uzar; sayılar "örnek" etiketli) | Tek sütun |
| 8 | "Neleri yapmıyoruz" | Soru ve çözüm yok · içindekiler fotoğrafı okunur, silinir · sohbet veliye gitmez · veli onayı olmadan 18 yaş altının verisi sunucuya gitmez · herkese aynı müfredat yok | Tipografik liste; her satırın altı DrawSVG ile çizilir, "yok" kelimeleri üstü çizilir. Kart yok | Aynı |
| 9 | Öğretmen ve koçlar | Tek satır: "Öğrencilerinle pilot denemek ister misin?" → formda rol | — | — |
| 10 | Bekleme listesi (`#katil`) | E-posta, rol, sınıf (isteğe bağlı), aydınlatma onayı. 18 yaş altı seçeneği göndermez, veliye WhatsApp paylaşım linki verir | hover.dev **Spotlight Button**; başarıda Alaaddin **mutlu** + **parıltılı lamba** (markanın tek özel anı) | Aynı |
| 11 | SSS | Ücretli mi · hangi kitaplar · Android ne zaman · soru çözüyor mu · velim ne görür · 18 yaşından küçüğüm · verilerimi nasıl silerim | hover.dev **Vertical Accordion** → `<details>` üstüne GSAP yükseklik | Aynı |
| 12 | Alt bilgi | Slogan, Destek · Gizlilik · İletişim, © 2026 lamba | Reveal Links; gece moru bölümlerde çok hafif **Fuzzy Overlay** (reduced-motion'da kapalı) | Aynı |

Şimdilik yok (sonra): kullanıcı yorumları ve sayılar, fiyat, App Store rozeti, sınava geri sayım (ÖSYM takvimi), blog, analitik (çerezsiz çözüm seçilene kadar).

## Teknik yapı

### Paketler (`apps/web`, sürümler sabit; TECH-STACK'e satır)
`gsap` 3.15.0, `@gsap/react` 2.1.2, `lenis` 1.3.27, `motion` 14.9.0 (hover.dev bileşenleri için), `three` 0.187.0, `@react-three/fiber` 9.8.2, `@types/three` 0.187.0, `detect-gpu` (GPU katmanı; drei alınmaz, GLB için three'nin `GLTFLoader`'ı). Bütçe: ilk yük JS < 150 KB gz (three hariç); three + R3F ≈ 250 KB gz yalnız istemcide, ilk boyamadan sonra, `next/dynamic` `ssr:false`; ekran görüntüleri `next/image` AVIF/WebP ≤ 120 KB; mobil ilk görünüm toplam < 1,5 MB.

### Dosyalar
- `src/app/page.tsx`: statik sunucu bileşeni, bölümleri dizer. Metinler tek dosyada `src/content/landing.ts` (mobildeki `i18n/tr.ts` kalıbı), SSS `src/content/sss.ts` (landing + /destek ortak).
- `src/components/landing/`: `gsap.ts` (tek yerde `registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin)`, `ScrollTrigger.config({ignoreMobileResize:true})`), `smooth-scroll.tsx` (`ReactLenis root`, `autoRaf:false`, `anchors:true`, GSAP ticker'a bağlı; yalnız `!ScrollTrigger.isTouch`), `wick-progress.tsx`, `site-header.tsx`, `hero.tsx`, `lamp.tsx` (SVG + yanma), `smoke/` (R3F Canvas, dinamik yük, `frameloop="demand"`, ekran dışında durur, `fallback` statik SVG, context kaybı için error boundary), `lamp-3d/` (**slot**: GLB varsa yüklenir, yoksa `lamp.tsx`), `book-marquee.tsx`, `one-day.tsx` (pin + Flip), `phone.tsx`, `screen-sequence.tsx` (**slot**: görüntü geçişi; kare dizisi gelince `imageSequenceScrub`), `mock/task-card.tsx`, `mock/checkin.tsx`, `mock/report-card.tsx`, `screens-carousel.tsx`, `alaaddin-section.tsx`, `parents.tsx`, `trust.tsx`, `waitlist-form.tsx` (`'use client'`), `faq.tsx`, `site-footer.tsx`.
- `src/components/motion/`: hover.dev kopyaları (`"use client"` eklenir; Tailwind 4: `outline-hidden`, `blur-xs`, `rounded-xs`, `ring-3`; `layoutId` kullananlar alınmaz ya da `"use no memo"`; `lenis/react` import yolu).
- Yeniden kullanılanlar: `src/components/ui.tsx` (`buttonClass`, `inputClass`, `labelClass`, `ErrorLine`, `Card`, `Notice`, `PageShell`), `src/lib/supabase.ts`, mobildeki `assets/images/alaaddin/*.webp` (720 px, ~35 KB) ve `lamp-glow.svg` → `public/`.
- `globals.css`: `--stage`, `--lamp-lit`, `--lamp-dim` token'ları; `scroll-margin`; `html { scroll-behavior:auto }` (Lenis yönetir).
- `public/`: yatay dumansız logolar, Alaaddin sahneleri, `duman-durumlari/sakin` SVG (lamba-design'dan), `ekran/` (kullanıcı yükler), `parilti` simge.
- `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WAITLIST_OPEN`, `NEXT_PUBLIC_CONTACT_EMAIL`.
- Next 16 notu: kodlamadan önce `apps/web/node_modules/next/dist/docs/` altındaki metadata, opengraph-image, robots, sitemap, images, lazy-loading belgeleri okunur. `cacheComponents` ile rota gizlenince `useGSAP` temizlenir, görününce `ScrollTrigger.refresh()`; `document.fonts.ready` ve görüntü yüklenince refresh.

### GSAP / Lenis kuralları
`useGSAP` her zaman `scope` ile; olay işleyicileri `contextSafe`; ScrollTrigger'lar sayfa sırasıyla; pin'li sahneler `100svh`; yalnız `transform`/`opacity`; `gsap.matchMedia` dalları: `desktop (min-width: 900px)`, `mobile`, `reduce`. SplitText 3.13+ ekran okuyucu etiketini kendisi ekler. Lenis: `syncTouch` kapalı, `data-lenis-prevent` yatay galeride.

### Bekleme listesi (Supabase)
- 18 yaş altı öğrenci kendi e-postasını bırakamaz (değişmez kural). Rol: `ogrenci_18` | `veli` | `ogretmen`; "18 yaşından küçüğüm" formu göndermez, `wa.me` ile veliye sayfa linki.
- Migration `supabase/migrations/20261103120000_waitlist.sql`: `public.waitlist_entry` (`email` ≤254 ve `consent_request` regex'i, `lower(email)` tekil; `role`; `grade` null | `11` | `12` | `mezun`; `notice_version`; `ip_hash` null olabilir; `created_at`; `invited_at`). RLS açık, anon/authenticated `revoke all`, tabloya grant yok. `join_waitlist(p_email, p_role, p_grade, p_notice_version, p_trap)`: `security definer`, `set search_path = ''`, yalnız `anon, authenticated`; bal tuzağı doluysa sessiz çıkış; tekrar e-posta `on conflict do nothing` (varlık sızmaz); hız sınırı IP+gün hash'i başına saatte 5, toplam saatte 300 (`P0001 rate_limited`); IP `grant_consent`'teki gibi `x-forwarded-for`'dan, isteğe tuzlu hash. `run_retention()` `create or replace`: `ip_hash` 2 gün sonra null; kaydın silinme süresi **NOT DEFINED** (öneri davet + 6 ay, avukata). `retention.test.sql` anahtarları güncellenir.
- `supabase/tests/database/waitlist.test.sql` (pgTAP): RLS açık; anon okuyamaz/yazamaz; RPC satır ekler; tekrar e-posta hata vermez, ikinci satır açmaz; geçersiz rol/e-posta/sınıf reddedilir; tuzak satır açmaz; hız sınırı çalışır.
- Form `supabase.rpc('join_waitlist', …)`; `WAITLIST_OPEN` kapalıysa "Liste çok yakında". Listeden çıkma: iletişim e-postasına yazılır, elle silinir.

### Ek sayfalar ve SEO
- `src/app/destek/page.tsx`: SSS, iletişim, hesap ve veri silme (Ayarlar → Verileri sil), veli onayını geri çekme.
- `src/app/gizlilik/page.tsx`: KVKK başlık iskeleti + YouTube API Hizmetleri ve Google Gizlilik Politikası linkleri; T07 gelene kadar `noindex`, "hazırlanıyor".
- `layout.tsx`: `metadataBase`, `%s · lamba`, `openGraph` `tr_TR`. `opengraph-image.tsx` (`next/og`, gece moru, krem logo, slogan; yazı tipi `apps/mobile/assets/fonts`). `icon.svg`, `apple-icon.png` dumansız simgeden. `robots.ts` (`/onay/`, `/rapor/` engelli), `sitemap.ts` (`/`, `/destek`, `/gizlilik`); `/onay/[token]` ve `/rapor/[token]` `robots: {index:false}`.

### Ekran görüntüleri (kullanıcıdan)
`apps/web/public/ekran/{bugun,checkin,kutuphane,sohbet,ayarlar}-{acik,koyu}.png`; iPhone 6.9" (1320×2868), durum çubuğu `xcrun simctl status_bar … override --time 9:41`. Demo hesap; kişisel veri, kitap kapağı, sayfa görüntüsü, gerçek yayınevi içindekiler kontrolü yok (değişmez kural + telif); kitaplar hızlı ekleme ile temsili adlarla ya da MEB. Sohbet örneği kriz içermez. Aynı set T27'de kullanılır.

## Belgeler
- PROJECT-STATE: yeni görev **T40**; owner kararları (Tally yerine kendi form, 18 yaş altı e-posta bırakmaz, animasyon yığını); karar 15 notu güncellenir (3 MiB sınırı kalktı; asıl sınır CPU); yayın kapıları; saklama süresi NOT DEFINED; skill'lerin kullanıcı düzeyinde kurulu olduğu (repoda değil).
- TECH-STACK: web satırına gsap, @gsap/react, lenis, motion, three, @react-three/fiber, detect-gpu; hover.dev kopya kuralı (`src/components/motion/`, lisans notu).

## Sıra
0. Skill'ler (kullanıcı düzeyi): `npx skills add greensock/gsap-skills -g` ve `npx skills add cloudai-x/threejs-skills -g` (bayrak `npx skills --help` ile teyit edilir; olmazsa `/plugin marketplace add greensock/gsap-skills` + `/plugin install gsap-skills@gsap-skills`). Lenis ve kare dizisi için skill yok; README ve GSAP helper kullanılır.
1. Next 16 belgeleri → 2. paketler (`pnpm --filter @yks/web add …`, sürüm sabit) → 3. varlıklar → 4. token, layout, smooth-scroll, header + fitil → 5. hero + lamba + duman (fallback'le) → 6. bölüm 3-4 (marquee, "Bir gün", kart taklitleri, Flip, görüntü slotu) → 7. bölüm 5-8 → 8. migration + pgTAP + form → 9. SSS, footer, /destek, /gizlilik → 10. SEO dosyaları → 11. 3D lamba slotu (GLB gelirse) → 12. belgeler → 13. doğrulama.

## Doğrulama
- `pnpm --filter @yks/web typecheck`, `lint`, `build`; `/`, `/destek`, `/gizlilik`, `/robots.txt`, `/sitemap.xml` statik (○); three ayrı chunk'ta ve ilk HTML'de yok.
- `next start` + `curl`: meta, OG, robots, sitemap; sonra sunucu kapatılır. `npx lighthouse --preset=mobile` (headless Chrome; simülatör değil): LCP < 2,5 s, INP yok (etkileşim), CLS < 0,1; sonuç dürüstçe raporlanır.
- pgTAP: yerel Supabase'i ben başlatmam; kullanıcı `supabase test db` koşar ya da CI.
- Kullanıcı kontrolü: Chrome ve Safari masaüstü (Lenis + duman), iPhone Safari ve WhatsApp iç tarayıcısı, orta sınıf Android (4× CPU yavaşlatma, Fast 3G), `prefers-reduced-motion` açıkken, klavyeyle gezinme; `NEXT_PUBLIC_WAITLIST_OPEN=1` ile kayıt, tekrar kayıt, "18 yaşından küçüğüm" yolu.
- Uzak projeye migration ve yayın ayrı onayla; bu planın parçası değil.
