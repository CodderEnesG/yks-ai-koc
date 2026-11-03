'use client';

import { useRef } from 'react';

import { FlipLink } from '@/components/motion/flip-link';
import { FuzzyOverlay } from '@/components/motion/fuzzy-overlay';
import { footer } from '@/content/landing';
import { gsap, MEDIA, useGSAP } from '@/lib/gsap';

/** Alt bilgi: büyük yatay logo kaydırdıkça yerine oturur; bağlantılar hover.dev Reveal Links. */
export function SiteFooter({ contactEmail }: { contactEmail?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        gsap.from('[data-wordmark]', {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });
      });
    },
    { scope: root },
  );

  const links = [
    { href: '/destek', label: 'Destek' },
    { href: '/gizlilik', label: 'Gizlilik' },
    ...(contactEmail ? [{ href: `mailto:${contactEmail}`, label: 'İletişim' }] : []),
  ];

  return (
    <footer ref={root} className="scene-night relative overflow-hidden">
      <FuzzyOverlay />
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-10 md:px-10">
        <nav
          aria-label="Alt bilgi"
          className="flex flex-wrap gap-x-10 gap-y-4 text-[clamp(1.4rem,3vw,2.4rem)] font-bold">
          {links.map((l) => (
            <FlipLink key={l.href} href={l.href}>
              {l.label}
            </FlipLink>
          ))}
        </nav>
        <div
          data-wordmark
          aria-hidden
          className="mask-shape text-cream mt-20 aspect-[1053.7/293.3] w-full"
          style={{ maskImage: 'url(/logo-yatay.svg)' }}
        />
        <div className="text-muted-foreground mt-10 flex flex-wrap justify-between gap-4 text-[14px]">
          <p>© 2026 lamba · {footer.slogan}</p>
          <p>{footer.cookies}</p>
        </div>
      </div>
    </footer>
  );
}
