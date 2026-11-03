'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { hero } from '@/content/landing';
import { gsap, MEDIA, useGSAP } from '@/lib/gsap';

import { LampArt } from './lamp';
import type { SmokeControl } from './smoke-canvas';

// three.js yalnız istemcide ve ilk boyamadan sonra yüklenir; ilk HTML'de yok.
const SmokeCanvas = dynamic(() => import('./smoke-canvas'), { ssr: false });

const ORANGE = '#ff9f43';
const DIM = '#bdb2cf';

/** WebGL duman yalnız yeterli cihazda: hareket azaltılmamış, veri tasarrufu kapalı, ≥4 çekirdek ve bellek, WebGL2. */
function canRunSmoke() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

/**
 * Açılış: sayfa sönük lambayla açılır, kaydırdıkça lamba yanar ve duman yoğunlaşır (masaüstünde bölüm kısa süre
 * sabitlenir). Başlık ilk boyamada görünür (LCP), yalnız kaydırınca satırlar ayrışır.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const control = useRef<SmokeControl>({ intensity: 0.35, wind: 0 });
  const [smoke, setSmoke] = useState<'off' | 'loading' | 'on'>('off');

  useEffect(() => {
    if (!canRunSmoke()) return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setSmoke('loading'), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setSmoke('loading'), 600);
    return () => clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA, (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<keyof typeof MEDIA, boolean>;
        if (reduce) {
          gsap.set('[data-art]', { '--lamp-color': ORANGE, '--smoke-opacity': 1 });
          gsap.set('[data-reveal]', { autoAlpha: 1 });
          control.current.intensity = 1;
          return;
        }

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.15 },
        );
        gsap.fromTo(
          '[data-art-inner]',
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.1 },
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: desktop ? '+=70%' : 'bottom 30%',
            scrub: 0.6,
            pin: desktop,
            onUpdate: (self) => {
              control.current.intensity = 0.35 + self.progress * 0.65;
              const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
              control.current.wind = v;
            },
          },
        });
        tl.fromTo(
          '[data-art]',
          { '--lamp-color': DIM },
          { '--lamp-color': ORANGE, ease: 'none', duration: 1 },
          0,
        )
          .fromTo(
            '[data-art]',
            { '--smoke-opacity': 0 },
            { '--smoke-opacity': 1, ease: 'none', duration: 0.6 },
            0.4,
          )
          .to('[data-art-inner]', { scale: 1.08, yPercent: -6, ease: 'none', duration: 1 }, 0)
          .to('[data-hint]', { autoAlpha: 0, y: -12, ease: 'none', duration: 0.25 }, 0)
          .to('[data-line="0"]', { xPercent: -1.5, ease: 'none', duration: 1 }, 0)
          .to('[data-line="2"]', { xPercent: 4, ease: 'none', duration: 1 }, 0);

        if (desktop) {
          const xTo = gsap.quickTo('[data-art-inner]', 'x', { duration: 0.9, ease: 'power3' });
          const yTo = gsap.quickTo('[data-art-inner]', 'y', { duration: 0.9, ease: 'power3' });
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            xTo(nx * 28);
            yTo(ny * 18);
            control.current.wind = nx * 1.4;
          };
          window.addEventListener('pointermove', onMove);
          return () => window.removeEventListener('pointermove', onMove);
        }
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="ust"
      aria-labelledby="hero-title"
      className="scene-night relative flex min-h-svh flex-col overflow-hidden">
      {/* Masaüstünde başlık tam genişlik; lamba kısa ikinci ve üçüncü satırların sağındaki boşlukta durur, duman
          o boşluğa yükselir. Mobilde lamba başlığın üstünde. */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pt-24 pb-10 md:px-10 lg:pt-32">
        <div className="relative order-first mx-auto mt-6 mb-4 w-[72%] max-w-[380px] lg:absolute lg:right-[9%] lg:bottom-[16%] lg:m-0 lg:w-[28%] lg:max-w-[440px]">
          <div data-art-inner className="relative w-full">
            <div
              data-art
              style={{ '--lamp-color': DIM, '--smoke-opacity': 0 } as React.CSSProperties}
              className={`relative aspect-[510/380] w-full ${smoke === 'on' ? '[&_[data-static-smoke]]:hidden' : ''}`}>
              <LampArt className="absolute inset-0 h-full w-full" />
              {smoke !== 'off' ? (
                <SmokeCanvas control={control} onReady={() => setSmoke('on')} />
              ) : null}
            </div>
          </div>
        </div>

        <p data-reveal className="text-muted-foreground mb-6 text-[15px] font-semibold">
          {hero.kicker}
        </p>
        <h1
          id="hero-title"
          className="font-display relative z-10 text-[clamp(2.75rem,7.6vw,7.1rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">
          {hero.title.map((line, i) => (
            <span key={line} data-line={i} className="block lg:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>
        <div className="relative z-10 mt-8 max-w-[34rem]">
          <p data-reveal className="text-muted-foreground text-[19px] leading-[1.5]">
            {hero.lead}
          </p>
          <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#katil"
              className="bg-primary text-primary-foreground focus-visible:outline-emphasis inline-flex min-h-[56px] items-center rounded-md px-7 text-[17px] font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2">
              {hero.cta}
            </a>
            <a
              href="#nasil"
              className="decoration-orange text-[17px] font-semibold underline decoration-2 underline-offset-[6px]">
              {hero.secondary}
            </a>
          </div>
          <p data-reveal className="text-muted-foreground mt-6 text-[15px]">
            {hero.platform}
          </p>
        </div>
      </div>
      <p
        data-hint
        aria-hidden
        className="text-muted-foreground mx-auto mb-8 flex items-center gap-3 text-[14px] font-semibold">
        <span className="bg-orange inline-block h-px w-10" />
        {hero.hint}
      </p>
    </section>
  );
}
