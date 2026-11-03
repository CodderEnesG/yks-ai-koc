'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

// hover.dev "Floating Phone" (ücretsiz; lisans https://www.hover.dev/license) uyarlaması: CSS 3B eğik telefon,
// ekran öne arkaya süzülür. lamba renkleri, iPhone oranı (1320×2868) ve dışarıdan verilen ekran içeriği.
export function FloatingPhone({
  children,
  tilt = true,
  className = 'w-[260px]',
}: {
  children: ReactNode;
  tilt?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const float = tilt && !reduce;
  return (
    <div className={className} style={{ perspective: 1400 }}>
      <div
        data-phone-tilt
        style={{
          transformStyle: 'preserve-3d',
          transform: tilt ? 'rotateY(-22deg) rotateX(10deg)' : undefined,
        }}
        className="rounded-[44px] bg-[#2a1f45]">
        <m.div
          initial={{ transform: 'translateZ(6px) translateY(-2px)' }}
          animate={float ? { transform: 'translateZ(28px) translateY(-8px)' } : undefined}
          transition={{ repeat: Infinity, repeatType: 'mirror', duration: 2.4, ease: 'easeInOut' }}
          className="relative rounded-[44px] border-[3px] border-r-[6px] border-b-[6px] border-[#3a2d57] border-t-[#4a3c6b] border-l-[#4a3c6b] bg-[#120c20] p-[7px]">
          <div className="absolute top-[14px] left-1/2 z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#120c20]" />
          <div className="relative aspect-[1320/2868] w-full overflow-hidden rounded-[36px] bg-[#f6eee0]">
            {children}
          </div>
        </m.div>
      </div>
    </div>
  );
}
