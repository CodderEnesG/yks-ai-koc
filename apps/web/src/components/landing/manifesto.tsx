'use client';

import { useRef } from 'react';

import { VelocityStrip } from '@/components/motion/velocity-strip';
import { manifesto } from '@/content/landing';
import { gsap, MEDIA, SplitText, useGSAP } from '@/lib/gsap';

/**
 * "Herkese aynı müfredat." kaydırdıkça üstü çizilir, yerine "Senin kitabın. Senin hızın." gelir. Sitedeki üstünü
 * çizme motifinin ilki (Neleri yapmıyoruz bölümü aynı hareketi kullanır). Altında plan parçalarından bir şerit.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.reduce, () => {
        gsap.set('[data-strike]', { backgroundSize: '100% 0.085em' });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '[data-struck]', start: 'top 75%', end: 'top 25%', scrub: 0.5 },
        });
        tl.fromTo(
          '[data-strike]',
          { backgroundSize: '0% 0.085em' },
          { backgroundSize: '100% 0.085em', ease: 'none' },
        ).to('[data-struck-text]', { color: '#5c5170', ease: 'none' }, '<');
        SplitText.create('[data-answer]', {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 60,
              autoAlpha: 0,
              rotate: 4,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '[data-answer]',
                start: 'top 80%',
                end: 'top 45%',
                scrub: 0.6,
              },
            }),
        });
        gsap.from('[data-body]', {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-body]',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="manifesto-title" className="scene-cream relative">
      <div className="mx-auto max-w-[1400px] px-5 pt-28 pb-10 md:px-10 md:pt-40">
        <h2 id="manifesto-title" className="sr-only">
          {manifesto.answer.join(' ')}
        </h2>
        <p
          data-struck
          className="font-display text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
          <span data-struck-text data-strike className="strike [--strike-color:var(--foreground)]">
            {manifesto.struck}
          </span>
        </p>
        <p
          data-answer
          aria-hidden
          className="font-display mt-4 text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] md:ml-[18%]">
          {manifesto.answer.map((a) => (
            <span key={a} className="block">
              {a}
            </span>
          ))}
        </p>
        <p
          data-body
          className="text-muted-foreground mt-14 max-w-[36rem] text-[19px] leading-[1.55] md:ml-[18%]">
          {manifesto.body}
        </p>
      </div>
      <VelocityStrip text={manifesto.strip} />
    </section>
  );
}
