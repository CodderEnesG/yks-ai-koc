'use client';

import * as m from 'motion/react-m';
import { type ReactNode, useRef } from 'react';

// hover.dev "Spotlight Button" (ücretsiz; lisans https://www.hover.dev/license) uyarlaması: imleci izleyen bir
// ışık dairesi; metin `mix-blend-difference` ile her iki zeminde okunur. lamba: gece moru zeminde turuncu.
// Olay dinleyicileri React prop'u (temizlik React'te); dokunmatikte yalnız basma küçülmesi kalır.
export function SpotlightButton({
  children,
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    spanRef.current?.animate({ left }, { duration: 250, fill: 'forwards' });
  };
  const leave = () =>
    spanRef.current?.animate({ left: '50%' }, { duration: 100, fill: 'forwards' });

  return (
    <m.button
      type={type}
      disabled={disabled}
      whileTap={{ scale: 0.985 }}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`bg-primary text-primary-foreground focus-visible:outline-emphasis relative min-h-[56px] w-full overflow-hidden rounded-md px-6 text-[17px] font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-100 ${className}`}>
      <span className="pointer-events-none relative z-10">{children}</span>
      <span
        ref={spanRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream"
      />
    </m.button>
  );
}
