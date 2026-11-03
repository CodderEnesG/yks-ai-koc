'use client';

import { useRef } from 'react';

import { trust } from '@/content/landing';
import { gsap, MEDIA, useGSAP } from '@/lib/gsap';

/**
 * "Neleri yapmıyoruz": yalnız değişmez kurallara dayanan iddialar. Her satır ekranın ortasına gelirken turuncu bir
 * çizgiyle üstü çizilir (manifestodaki motif); açıklama altından gelir. Kart yok, ikon yok: tipografi.
 */
export function Trust() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.reduce, () => {
        gsap.set('[data-strike]', { backgroundSize: '100% 0.085em' });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-item]').forEach((item) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: 'top 82%', end: 'top 40%', scrub: 0.5 },
          });
          tl.from(item.querySelector('[data-no]'), {
            x: -30,
            autoAlpha: 0.2,
            ease: 'none',
            duration: 0.4,
          })
            .fromTo(
              item.querySelector('[data-strike]'),
              { backgroundSize: '0% 0.085em' },
              { backgroundSize: '100% 0.085em', ease: 'none', duration: 0.5 },
            )
            .from(
              item.querySelector('[data-why]'),
              { y: 16, autoAlpha: 0, ease: 'none', duration: 0.4 },
              '-=0.2',
            );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="trust-title" className="scene-night relative">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <h2
          id="trust-title"
          className="font-display text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
          {trust.title}
        </h2>
        <ul className="mt-16">
          {trust.items.map((it) => (
            <li
              data-item
              key={it.no}
              className="border-border grid grid-cols-12 gap-x-6 gap-y-3 border-t py-9 last:border-b md:py-12">
              <p
                data-no
                className="font-display col-span-12 text-[clamp(1.8rem,4.2vw,3.8rem)] leading-[1.02] font-extrabold tracking-[-0.02em] md:col-span-7">
                <span data-strike className="strike [--strike-color:var(--orange)]">
                  {it.no}
                </span>
              </p>
              <p
                data-why
                className="text-muted-foreground col-span-12 self-end text-[18px] leading-[1.5] md:col-span-5">
                {it.why}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
