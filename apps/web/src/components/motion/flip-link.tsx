'use client';

import * as m from 'motion/react-m';

const DURATION = 0.25;
const STAGGER = 0.025;

// hover.dev "Reveal Links" (ücretsiz; lisans https://www.hover.dev/license): üzerine gelince harfler sırayla
// yukarı kayar, alttan aynısı gelir. Büyük harf zorlaması kaldırıldı; boyut dışarıdan.
export function FlipLink({
  children,
  href,
  className = '',
}: {
  children: string;
  href: string;
  className?: string;
}) {
  const letters = children.split('');
  return (
    <m.a
      initial="initial"
      whileHover="hovered"
      whileFocus="hovered"
      href={href}
      aria-label={children}
      className={`relative block overflow-hidden whitespace-nowrap ${className}`}
      style={{ lineHeight: 1.05 }}>
      <span aria-hidden className="block">
        {letters.map((l, i) => (
          <m.span
            variants={{ initial: { y: 0 }, hovered: { y: '-100%' } }}
            transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
            className="inline-block whitespace-pre"
            key={i}>
            {l}
          </m.span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 block">
        {letters.map((l, i) => (
          <m.span
            variants={{ initial: { y: '100%' }, hovered: { y: 0 } }}
            transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
            className="inline-block whitespace-pre"
            key={i}>
            {l}
          </m.span>
        ))}
      </span>
    </m.a>
  );
}
