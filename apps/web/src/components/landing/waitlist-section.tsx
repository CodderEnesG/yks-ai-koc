'use client';

import { useRef } from 'react';

import { waitlist } from '@/content/landing';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

import { WaitlistForm } from './waitlist-form';

export function WaitlistSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        SplitText.create('[data-wl-title]', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: '[data-wl-title]', start: 'top 80%' },
            }),
        });
        gsap.from('[data-wl-form]', {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-wl-form]', start: 'top 85%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="katil"
      aria-labelledby="waitlist-title"
      className="scene-night relative">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 min-[900px]:gap-x-10 gap-y-12 px-5 py-28 md:px-10 md:py-40">
        <div className="col-span-12 min-[900px]:col-span-6">
          <h2
            id="waitlist-title"
            data-wl-title
            className="font-display text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.95] font-extrabold tracking-[-0.035em]">
            {waitlist.title}
          </h2>
          <p className="text-muted-foreground mt-6 max-w-[30rem] text-[19px] leading-[1.55]">
            {waitlist.body}
          </p>
          <p className="border-orange mt-10 max-w-[30rem] border-l-2 pl-4 text-[17px] leading-snug">
            {waitlist.coaches}
          </p>
        </div>
        <div data-wl-form className="relative col-span-12 min-[900px]:col-span-6">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
