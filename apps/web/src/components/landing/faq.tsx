'use client';

import { useRef } from 'react';

import { SSS } from '@/content/sss';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Sık sorulanlar: native `<details>` (klavye ve ekran okuyucu tarayıcıdan); açılıp kapanırken yükseklik GSAP ile
 * akar. Hareket azaltılmışsa anında açılır.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const toggle = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    const details = e.currentTarget.parentElement as HTMLDetailsElement;
    const body = details.querySelector<HTMLElement>('[data-answer]');
    if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (details.open) {
      gsap.to(body, {
        height: 0,
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          details.open = false;
          gsap.set(body, { clearProps: 'all' });
        },
      });
    } else {
      details.open = true;
      gsap.fromTo(
        body,
        { height: 0, autoAlpha: 0 },
        { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power2.out', clearProps: 'height' },
      );
    }
  });

  return (
    <section ref={root} id="sss" aria-labelledby="faq-title" className="scene-cream relative">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 min-[900px]:gap-x-10 gap-y-10 px-5 py-28 md:px-10 md:py-40">
        <h2
          id="faq-title"
          className="font-display col-span-12 text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.03em] min-[900px]:col-span-4">
          Sorular
        </h2>
        <div className="col-span-12 min-[900px]:col-span-8">
          {SSS.map((item) => (
            <details key={item.q} className="group border-border border-t last:border-b">
              <summary
                onClick={toggle}
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.15rem,2vw,1.5rem)] font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="font-display text-[28px] leading-none transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div data-answer className="overflow-hidden">
                <p className="text-muted-foreground max-w-[44rem] pb-7 text-[18px] leading-[1.55]">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
