import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// GSAP eklentileri tek yerde kaydedilir (gsap-plugins: bileşen içinde değil, bir kez). Sunucuda GSAP çalışmaz;
// yalnız istemci bileşenleri bu modülü kullanır.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin);
  // Mobil adres çubuğu açılıp kapanınca yeniden hesaplama yapma (iOS Safari'de sıçrama).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * `gsap.matchMedia()` koşulları. Hareket azaltılmışsa pin, sürükleme ve kaydırmaya bağlı hareket kapanır; yalnız
 * kısa opaklık geçişleri kalır.
 */
export const MEDIA = {
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export { DrawSVGPlugin, Flip, gsap, ScrollTrigger, SplitText, useGSAP };
