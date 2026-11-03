'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

// hover.dev "Fuzzy Overlay" (ücretsiz; lisans https://www.hover.dev/license): kayan hafif kumlanma. PNG yerine
// globals.css'teki SVG gürültüsü. Kapsayıcıda `overflow-hidden` gerekir. Hareket azaltılmışsa durağan.
export function FuzzyOverlay({ opacity = 0.07 }: { opacity?: number }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      aria-hidden
      initial={{ transform: 'translateX(-10%) translateY(-10%)' }}
      animate={reduce ? undefined : { transform: 'translateX(10%) translateY(10%)' }}
      transition={{ repeat: Infinity, duration: 0.2, ease: 'linear', repeatType: 'mirror' }}
      style={{ opacity }}
      className="noise pointer-events-none absolute -inset-full"
    />
  );
}
