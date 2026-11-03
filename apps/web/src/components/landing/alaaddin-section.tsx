'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { alaaddin } from '@/content/landing';
import { gsap, MEDIA, useGSAP } from '@/lib/gsap';

/**
 * Alaaddin sohbeti (hover.dev "Text Parallax Content" fikrinden: yapışkan sahne, kaydırdıkça içerik akar).
 * Masaüstünde sahne sabit durur; ilk mesaj gelir, Alaaddin "düşünüyor"a geçer, yanıt yazılır, sakine döner.
 * Ekranda tek Alaaddin (kılavuz). Mobilde mesajlar görünür olunca sırayla gelir.
 */
export function AlaaddinSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });
        tl.from('[data-copy] > *', { y: 50, autoAlpha: 0, stagger: 0.15, duration: 0.6 })
          .from('[data-bubble="0"]', { y: 30, autoAlpha: 0, scale: 0.96, duration: 0.5 })
          .from('[data-typing]', { autoAlpha: 0, duration: 0.2 })
          .to('[data-scene="dusunuyor"]', { autoAlpha: 1, duration: 0.3 }, '<')
          .to('[data-typing]', { autoAlpha: 0, duration: 0.2 }, '+=0.5')
          .from('[data-bubble="1"]', { y: 30, autoAlpha: 0, scale: 0.96, duration: 0.5 })
          .to('[data-scene="dusunuyor"]', { autoAlpha: 0, duration: 0.3 }, '<')
          .from('[data-note]', { autoAlpha: 0, duration: 0.4 })
          .to('[data-stage]', { scale: 0.94, duration: 0.6 }, '+=0.3');
      });
      mm.add(MEDIA.mobile, () => {
        gsap.from('[data-bubble]', {
          y: 24,
          autoAlpha: 0,
          stagger: 0.6,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-chat]', start: 'top 80%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="alaaddin-title"
      className="scene-night relative min-[900px]:h-[260vh]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 items-center min-[900px]:gap-x-10 gap-y-10 px-5 py-28 md:px-10 min-[900px]:sticky min-[900px]:top-0 min-[900px]:h-svh min-[900px]:py-0">
        <div className="col-span-12 min-[900px]:col-span-5">
          <div
            data-stage
            className="bg-card relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[32px]">
            <Image
              src="/alaaddin/sakin.webp"
              alt=""
              fill
              sizes="(min-width: 900px) 460px, 90vw"
              className="object-contain p-6"
            />
            <Image
              data-scene="dusunuyor"
              src="/alaaddin/dusunuyor.webp"
              alt=""
              fill
              sizes="(min-width: 900px) 460px, 90vw"
              className="bg-card invisible object-contain p-6 opacity-0"
            />
          </div>
        </div>
        <div className="col-span-12 min-[900px]:col-span-7">
          <div data-copy>
            <p className="text-muted-foreground font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-extrabold tabular-nums">
              {alaaddin.time}
            </p>
            <h2
              id="alaaddin-title"
              className="font-display mt-5 text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.03em]">
              {alaaddin.title}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-[32rem] text-[19px] leading-[1.55]">
              {alaaddin.body}
            </p>
          </div>
          <div data-chat className="mt-10 max-w-[32rem] space-y-3">
            {alaaddin.chat.map((m, i) => (
              <p
                key={i}
                data-bubble={i}
                className={`w-fit max-w-[88%] rounded-[20px] px-4 py-3 text-[17px] leading-snug ${
                  m.from === 'me'
                    ? 'bg-cream text-night ml-auto rounded-br-[6px]'
                    : 'bg-card rounded-bl-[6px]'
                }`}>
                <span className="sr-only">{m.from === 'me' ? 'Öğrenci: ' : 'Alaaddin: '}</span>
                {m.text}
              </p>
            ))}
            <p
              data-typing
              aria-hidden
              className="bg-card invisible w-fit rounded-[20px] px-4 py-3 text-[17px] opacity-0">
              • • •
            </p>
          </div>
          <p data-note className="text-muted-foreground mt-8 max-w-[32rem] text-[15px]">
            {alaaddin.note}
          </p>
        </div>
      </div>
    </section>
  );
}
