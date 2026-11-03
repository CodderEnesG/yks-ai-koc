'use client';

import 'lenis/dist/lenis.css';

import { type LenisRef, ReactLenis, useLenis } from 'lenis/react';
import { LazyMotion } from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';

import { gsap, ScrollTrigger } from '@/lib/gsap';

const loadMotionFeatures = () => import('./motion-features').then((mod) => mod.default);

// Yumuşak kaydırma (Lenis) GSAP'ın tek döngüsünde döner; ScrollTrigger her kaydırmada güncellenir (Lenis README).
// Dokunmatikte kaydırma native kalır (`syncTouch` kapalı); sistemde hareket azaltılmışsa Lenis yumuşatmaz.
// hover.dev bileşenleri `m.*` ile yazılı; animasyon özellikleri LazyMotion ile sonradan yüklenir.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    // Yazı tipleri yüklenince satır kırılımları değişir; tetik noktaları yeniden hesaplanır.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, anchors: true, lerp: 0.12 }}>
      <ScrollTriggerSync />
      <LazyMotion features={loadMotionFeatures} strict>
        {children}
      </LazyMotion>
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}
