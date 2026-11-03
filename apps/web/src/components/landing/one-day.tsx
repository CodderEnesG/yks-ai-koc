'use client';

import { useInView } from 'motion/react';
import { useRef, useState } from 'react';

import { FloatingPhone } from '@/components/motion/floating-phone';
import { oneDay } from '@/content/landing';
import type { ScreenFiles } from '@/content/screen-keys';
import { gsap, MEDIA, ScrollTrigger, useGSAP } from '@/lib/gsap';

import { LampMark } from './lamp';
import { DayScreen } from './phone-screen';

type Chapter = (typeof oneDay.chapters)[number];

/**
 * Ürünün kalbi: bir günün dört saati (ürün ve iş modeli v1, "Örnek bir gün"). Masaüstünde telefon solda yapışık
 * durur, sağdaki saat bölümleri geçtikçe ekranı değişir; telefon kaydırdıkça düzleşir. Mobilde her saat kendi
 * telefonuyla alt alta.
 */
export function OneDay({ screens }: { screens: ScreenFiles }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]');
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        chapters.forEach((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          }),
        );
      });
      mm.add(MEDIA.desktop, () => {
        gsap.fromTo(
          '[data-sticky-phone] [data-phone-tilt]',
          { rotateY: -26, rotateX: 12 },
          {
            rotateY: -6,
            rotateX: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        chapters.forEach((el) => {
          gsap.from(el.querySelectorAll('[data-rise]'), {
            y: 48,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          });
        });
        gsap.from('[data-day-title]', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-day-title]', start: 'top 85%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="nasil" aria-labelledby="day-title" className="scene-night relative">
      <div className="mx-auto max-w-[1400px] px-5 pt-28 md:px-10 md:pt-36">
        <p className="text-muted-foreground text-[15px] font-semibold">{oneDay.kicker}</p>
        <h2
          id="day-title"
          data-day-title
          className="font-display mt-4 max-w-[16ch] text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
          {oneDay.title}
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-5 pb-24 md:px-10">
        <div
          data-sticky-phone
          className="sticky top-0 col-span-5 hidden h-svh items-center justify-center min-[900px]:flex">
          <FloatingPhone className="w-[min(300px,22vw)]">
            {oneDay.chapters.map((c, i) => (
              <div
                key={c.time}
                aria-hidden={active !== i}
                className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                  active === i ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
                }`}>
                <DayScreen kind={c.screen} active={active === i} screens={screens} />
              </div>
            ))}
          </FloatingPhone>
        </div>

        <ol className="col-span-12 min-[900px]:col-span-7">
          {oneDay.chapters.map((c) => (
            <ChapterBlock key={c.time} chapter={c} screens={screens} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChapterBlock({ chapter: c, screens }: { chapter: Chapter; screens: ScreenFiles }) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(phoneRef, { amount: 0.5 });
  return (
    <li
      data-chapter
      className="flex flex-col justify-center py-16 min-[900px]:min-h-svh min-[900px]:py-0">
      <div data-rise className="flex items-center gap-4">
        <span className="font-display text-[clamp(3.6rem,9vw,8.5rem)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
          {c.time}
        </span>
        <LampMark state={c.lamp} className="h-[clamp(1.6rem,3vw,2.6rem)] w-auto" />
      </div>
      <h3
        data-rise
        className="font-display mt-6 text-[clamp(1.8rem,3.4vw,3rem)] leading-tight font-bold">
        {c.title}
      </h3>
      <p data-rise className="text-muted-foreground mt-4 max-w-[30rem] text-[19px] leading-[1.55]">
        {c.body}
      </p>
      <div ref={phoneRef} className="mt-10 flex justify-center min-[900px]:hidden">
        <FloatingPhone tilt={false} className="w-[min(260px,70vw)]">
          <DayScreen kind={c.screen} active={inView} screens={screens} />
        </FloatingPhone>
      </div>
    </li>
  );
}
