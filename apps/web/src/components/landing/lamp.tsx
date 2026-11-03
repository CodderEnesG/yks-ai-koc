import { LAMP_PATH, LAMP_VIEWBOX, SMOKE_PATH, SMOKE_TRANSFORM } from './lamp-paths';

/**
 * Marka lambası ve "sakin" duman (inline SVG). Lamba rengi `--lamp-color` değişkeninden gelir; GSAP bu değişkeni
 * griden turuncuya taşıyarak lambayı "yakar" (uygulamadaki LampGlow'un web karşılığı). Duman krem; WebGL duman
 * yüklenince `data-static-smoke` gizlenir. Süs: ekran okuyucu atlar.
 */
export function LampArt({ className }: { className?: string }) {
  return (
    <svg viewBox={LAMP_VIEWBOX} className={className} aria-hidden focusable="false">
      <g data-static-smoke style={{ fill: 'var(--cream)', opacity: 'var(--smoke-opacity, 0)' }}>
        <path transform={SMOKE_TRANSFORM} d={SMOKE_PATH} />
      </g>
      <path
        data-lamp
        fillRule="evenodd"
        d={LAMP_PATH}
        style={{ fill: 'var(--lamp-color, var(--lamp-dim))' }}
      />
    </svg>
  );
}

// Palet dışı renk yok (kılavuz): yanık turuncu, kısık krem, sönük gri.
const MARK_COLORS = { lit: 'var(--orange)', low: 'var(--cream)', off: 'var(--lamp-dim)' } as const;

/** Küçük lamba işareti (bölüm saatlerinin yanında): yanık, kısık ya da sönük. */
export function LampMark({
  state,
  className = 'h-6 w-auto',
}: {
  state: keyof typeof MARK_COLORS;
  className?: string;
}) {
  return (
    <svg viewBox="40 130 315 160" className={className} aria-hidden focusable="false">
      <path fillRule="evenodd" d={LAMP_PATH} style={{ fill: MARK_COLORS[state] }} />
    </svg>
  );
}
