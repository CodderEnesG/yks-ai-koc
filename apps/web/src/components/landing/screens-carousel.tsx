'use client';

import { useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useRef, useState } from 'react';

import { FloatingPhone } from '@/components/motion/floating-phone';
import { screensSection } from '@/content/landing';
import { type ScreenFiles, SCREEN_KEYS } from '@/content/screen-keys';

import { GalleryScreen, shotFor } from './phone-screen';

// hover.dev "Horizontal Scroll Carousel" (ücretsiz; lisans https://www.hover.dev/license) uyarlaması: masaüstünde
// dikey kaydırma galeriyi yana taşır (kayma miktarı ölçülerek). Mobilde native yatay kaydırma (scroll-snap).
export function ScreensCarousel({ screens }: { screens: ScreenFiles }) {
  const items = SCREEN_KEYS.filter((k) => k !== 'ayarlar' || shotFor(screens, k));
  const target = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 80));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const cards = items.map((id) => (
    <figure key={id} className="w-[min(270px,68vw)] shrink-0 snap-center">
      <FloatingPhone tilt={false} className="w-full">
        <GalleryScreen id={id} screens={screens} alt={screensSection.captions[id]} />
      </FloatingPhone>
      <figcaption className="font-display mt-5 text-[19px] font-bold">
        {screensSection.captions[id]}
      </figcaption>
    </figure>
  ));

  return (
    <section aria-labelledby="screens-title" className="scene-cream relative">
      <div className="mx-auto max-w-[1400px] px-5 pt-28 md:px-10 md:pt-36">
        <h2
          id="screens-title"
          className="font-display max-w-[14ch] text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
          {screensSection.title}
        </h2>
        <p className="text-muted-foreground mt-5 max-w-[30rem] text-[19px]">
          {screensSection.body}
        </p>
      </div>

      {/* Mobil ve hareket azaltılmış: native yatay kaydırma. İki hal de çizilir, CSS seçer (hidrasyon aynı kalır). */}
      <div
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pt-12 pb-24 min-[900px]:hidden motion-reduce:min-[900px]:flex">
        {cards}
      </div>

      <section
        ref={target}
        aria-hidden
        className="relative hidden h-[260vh] min-[900px]:block motion-reduce:min-[900px]:hidden">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <m.div
            ref={track}
            style={{ x }}
            className="flex gap-14 pr-10 pl-[max(40px,calc((100vw-1400px)/2+40px))]">
            {cards}
          </m.div>
        </div>
      </section>
    </section>
  );
}
