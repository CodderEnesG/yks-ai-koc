'use client';

import { useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef } from 'react';

// hover.dev "Velocity Text" (ücretsiz; lisans https://www.hover.dev/license) uyarlaması: yapışkan bir şerit,
// kaydırdıkça yana kayar ve kaydırma hızıyla eğilir. Orijinal 1000vh; burada mobilde 160vh, masaüstünde 220vh.
// Hareket azaltılmışsa şerit yerine durağan, satırlara kırılan metin (CSS ile; sunucu tercihi bilmez, hidrasyon
// aynı kalsın diye iki hali de çizilir).
export function VelocityStrip({ text }: { text: string }) {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });
  const velocity = useVelocity(scrollYProgress);
  const skewRaw = useTransform(velocity, [-0.5, 0.5], ['30deg', '-30deg']);
  const skewX = useSpring(skewRaw, { mass: 3, stiffness: 400, damping: 50 });
  const xRaw = useTransform(scrollYProgress, [0, 1], ['0%', '-62%']);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

  return (
    <>
      <p
        aria-hidden
        className="font-display hidden px-5 py-16 text-4xl leading-[0.95] font-extrabold tracking-tight motion-reduce:block md:px-10">
        {text}
      </p>
      <section
        ref={targetRef}
        aria-hidden
        className="relative h-[160vh] motion-reduce:hidden md:h-[220vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <m.p
            style={{ skewX, x }}
            className="font-display origin-bottom-left text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] font-extrabold tracking-[-0.04em] whitespace-nowrap">
            {text}
            {text}
          </m.p>
        </div>
      </section>
    </>
  );
}
