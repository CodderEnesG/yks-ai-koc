'use client';

import { useRef } from 'react';

import { FlipLink } from '@/components/motion/flip-link';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const LINKS = [
  { href: '#nasil', label: 'Nasıl çalışır' },
  { href: '#veliler', label: 'Veliler' },
  { href: '#sss', label: 'SSS' },
];

/**
 * Sabit üst çubuk (her zaman gece moru; turuncu yalnız gece zemininde). Aşağı kaydırınca gizlenir, yukarıda
 * döner. Alttaki ince "fitil" sayfanın ne kadarının okunduğunu gösterir.
 */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = ref.current;
      const wick = header?.querySelector('[data-wick]');
      if (!header || !wick) return;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          gsap.set(wick, { scaleX: self.progress });
          const hide = self.direction === 1 && self.scroll() > 200;
          gsap.to(header, {
            yPercent: hide ? -100 : 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="scene-night fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-5 md:px-10">
        <a
          href="#ust"
          aria-label="lamba, başa dön"
          className="mask-shape text-cream block h-[35px] w-[126px] shrink-0"
          style={{ maskImage: 'url(/logo-yatay.svg)' }}
        />
        <nav
          aria-label="Sayfa"
          className="ml-auto hidden items-center gap-7 text-[15px] font-semibold md:flex">
          {LINKS.map((l) => (
            <FlipLink key={l.href} href={l.href}>
              {l.label}
            </FlipLink>
          ))}
        </nav>
        <a
          href="#katil"
          className="bg-primary text-primary-foreground focus-visible:outline-emphasis ml-auto inline-flex min-h-[44px] items-center rounded-md px-4 text-[15px] font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 md:ml-0">
          Listeye katıl
        </a>
      </div>
      <div
        data-wick
        aria-hidden
        className="bg-orange absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0"
      />
    </header>
  );
}
