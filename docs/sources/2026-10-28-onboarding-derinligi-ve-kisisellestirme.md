# Onboarding derinliği ve kişiselleştirmenin elde tutmaya etkisi: kaynak taraması

**Sonuç (özet):** Taranan kaynaklar "onboarding'i uzat" tezini desteklemiyor; tersine çoğu kaynak hızlı
"ilk değer anı"nın (fast time-to-value) daha güçlü bir elde tutma öngörücüsü olduğunu söylüyor.
Kişiselleştirmenin elde tutmayı artırdığı iddiası var ve makul, ama mekanizma genelde "formu uzatmak"
değil, "az ve doğru soru + kullanım sırasında kademeli veri toplama" (progressive profiling). Bu
projenin bugünkü mimarisi (kısa kurulum + sohbet/check-in'den kademeli bağlam) zaten ikinci modele
yakın. **Hakemli bir çalışma bulunamadı**; aşağıdaki hemen hepsi pazarlama/ürün blog yazısı ve
vaka anlatımı, rakamlar teyitsiz — tahmin olarak okunmalı (bkz. AGENTS.md kanıt disiplini).

## Soru

Gelen hipotez: "Bu tür hedefli uygulamalarda onboarding'in uzun tutulması kullanıcı sadakatini artırıp
churn'ü azaltıyor; öğrenciyi daha yakından tanımak sunulan planı/koçu daha kişisel kılıyor."

## Bulgular

1. **Uzun onboarding yerine hızlı değer anı.** Birden çok kaynak, kurulumu kısaltıp ilk oturumda somut
   bir sonuca ("aha moment") ulaştırmanın D1/D7 elde tutmayı yükselttiğini söylüyor. Bir edtech vaka
   çalışması, ~7 dakikalık kurulum akışını "15 dakikada ilk kazanım" tasarımına indirdiğinde D1'in
   %38'den %64'e, D7'nin %18'den %41'e çıktığını bildiriyor ([loyalty.cx](https://loyalty.cx/edtech-churn-rate/)).
   Başka bir kaynak, ilk oturumda 3+ çekirdek eylemi tamamlayanların, 1 eylem tamamlayanlara göre ~4 kat
   daha yüksek elde tutumla kaldığını Reforge'a atfediyor ([MikeCrunch](https://www.mikecrunch.com/education-app-retention-playbook-onboarding-activation/)).
2. **Kişiselleştirme ile elde tutma ilişkisi var ama kanıt zayıf/dolaylı.** Yaygın tekrarlanan bir rakam,
   kişiselleştirilmiş ilk-çalıştırma deneyiminin elde tutmayı %35 artırdığını söylüyor, ama birincil
   kaynağı belirsiz ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)). Calm
   örneği: tek bir "hedef seçimi" sorusu önerilen içeriği, varsayılan oturum süresini ve hatırlatma
   mesajını değiştiriyor — ölçülmüş bir sonuç değil, anekdot ([Kanopy Labs](https://kanopylabs.com/blog/mobile-app-onboarding-ux-patterns-reduce-churn)).
3. **Duolingo örneği (en yakın emsal):** Seviye tespiti var ama kısa; 2024 revizyonunda akış "quiz" gibi
   değil "iki yönlü konuşma" gibi hissettirilecek şekilde **kısaltıldı**, uzatılmadı
   ([UX Collective](https://uxdesign.cc/duolingos-onboarding-2-years-on-3cbccad139f7)). Bu, "öğrenciyi
   tanı" ihtiyacıyla "hızlı başla" ihtiyacının aynı akışta birlikte çözülebileceğini gösteriyor, "uzun
   tut" değil.
4. **Karşı emsal (farklı bağlam):** Çalışan (employee) onboarding literatüründe uzun/kapsamlı oryantasyon
   ile yüksek 1 yıllık tutunma arasında korelasyon bulunmuş ([ECO/SmartyTrain](https://eco.thesmartytrain.com/insights/high-retention-orgs-spend-4x-longer-inducting-new-joiners);
   [ImpactingEd](https://impactinged.pitt.edu/ojs/ImpactingEd/article/view/220)). Bu çalışmalar işe alım
   bağlamında, tüketici mobil uygulamasına **doğrudan taşınabilirliği şüpheli** — farklı katılımcı
   motivasyonu ve zaman ufku var.
5. **Kademeli (progressive) kişiselleştirme önerisi.** Ürün tasarımı kaynakları, kayıt anında asgari bilgi
   alıp kalan kişiselleştirme sinyallerini kullanım sırasında bağlamsal olarak toplamayı öneriyor; "soru
   duvarı" en kötü onboarding deseni olarak işaretleniyor (genel ürün blog görüşü, ölçüm yok).

## Bu projeye özgü gerilim (AGENTS.md'deki değişmez kurallarla)

- **Veri minimizasyonu ve veli onayı.** Onboarding'e yeni kişisel/davranışsal sorular eklemek, "LLM'e
  kişisel veri ayıklanmadan gitmez" ve "veli onayı gelmeden 18 yaş altı kullanıcının verisi sunucuya
  gitmez" kurallarıyla doğrudan kesişiyor: her yeni soru aydınlatma metnine (T07) ve veli rıza kapsamına
  eklenecek bir madde demek, yalnız bir ürün kararı değil.
- **T09 zaten "az soru" ilkesiyle kurulu** (6 adım, tahmini 1-2 dk); PostHog'ta `onboarding_tamam` olayı
  var ama adım adım bırakma (drop-off) ölçülmüyor — "uzatsak ne olur" sorusunun bugün ölçülecek verisi yok.

## Öneri — **OPEN QUESTION**, owner kararı gerekli

Onboarding'i toptan uzatmak yerine:

1. Önce **ölçüm ekle**: T09'un adım adım tamamlama/bırakma oranı (PostHog), bugünkü 6 adımın nerede
   terk edildiğini göstersin.
2. Yeni eklenecek her soru için "bu sinyal plan motorunu veya koçu somut olarak nasıl değiştiriyor"
   testi uygulanmalı (örn. "en çok zorlandığın ders" → plan motorunda öncelik skoruna girer mi, yoksa
   yalnız söylem için mi kalır).
3. Derin kişiselleştirme sinyalleri (zorlandığı ders, motivasyon kaynağı, çalışma tarzı) **kurulumda
   değil, kademeli olarak** check-in nedenleri ve sohbetten toplanabilir — bu zaten mevcut mimaride var
   (T17 koç bağlamı: son 7 gün, son nedenler, sınava kalan gün).
4. Kabul edilirse kapsam T09'u genişletir ya da yeni görev olur; görev numarası owner kararıyla verilir
   (AGENTS.md: görev kimlikleri owner tarafından atanır).

## Sınırlama

Bu bir literatür taraması değil, web aramasının (büyük ölçüde pazarlama/ürün blogları) özetidir. Hakemli
çalışma bulunamadı, rakamların birincil kaynağı çoğu zaman belirsiz, bazı kaynaklar birbiriyle çelişiyor.
"Kamuya açık güçlü kanıt bulunamadı" ifadesi "iddia yanlış" anlamına gelmez — yalnız bu taramanın onu
doğrulayamadığı anlamına gelir.
