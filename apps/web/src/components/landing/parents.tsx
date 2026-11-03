'use client';

import { useRef } from 'react';

import { parents } from '@/content/landing';
import { gsap, MEDIA, useGSAP } from '@/lib/gsap';

const STATUS_LABEL = { done: 'tamam', missed: 'yapılmadı', rest: 'dinlenme' } as const;

/**
 * Veliler: solda yapışık başlık, sağda haftalık raporun kendini kurduğu örnek. Durumlar renkle değil şekille
 * (dolu daire + tik tamam, kesik çizgili daire yapılmadı, boş daire dinlenme). Sayılar "örnek" etiketli.
 */
export function Parents() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '[data-report]', start: 'top 72%' },
          defaults: { ease: 'power3.out' },
        });
        tl.from('[data-report]', { y: 60, autoAlpha: 0, rotate: 1.5, duration: 0.9 })
          .from('[data-day]', { scale: 0.4, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, '-=0.4')
          .from('[data-tick]', { drawSVG: 0, stagger: 0.06, duration: 0.35 }, '-=0.3')
          .from(
            '[data-stat]',
            { textContent: 0, snap: { textContent: 1 }, duration: 1, stagger: 0.1 },
            '-=0.2',
          )
          .from(
            '[data-bar]',
            { scaleX: 0, transformOrigin: 'left center', stagger: 0.12, duration: 0.9 },
            '<',
          )
          .from('[data-report-foot]', { autoAlpha: 0, y: 10, duration: 0.4 });
        gsap.from('[data-point]', {
          x: -24,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-points]', start: 'top 80%' },
        });
      });
      mm.add(MEDIA.desktop, () => {
        gsap.to('[data-report]', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });
    },
    { scope: root },
  );

  const { report } = parents;

  return (
    <section
      ref={root}
      id="veliler"
      aria-labelledby="parents-title"
      className="scene-cream relative">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 min-[900px]:gap-x-10 gap-y-14 px-5 py-28 md:px-10 md:py-40">
        <div className="col-span-12 min-[900px]:col-span-6">
          <div className="min-[900px]:sticky min-[900px]:top-28">
            <p className="text-muted-foreground font-display text-[clamp(2rem,4vw,3.6rem)] leading-none font-extrabold">
              {parents.time}
            </p>
            <h2
              id="parents-title"
              className="font-display mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
              {parents.title.map((t) => (
                <span key={t} className="block">
                  {t}
                </span>
              ))}
            </h2>
            <p className="text-muted-foreground mt-6 max-w-[32rem] text-[19px] leading-[1.55]">
              {parents.body}
            </p>
            <ul data-points className="mt-8 max-w-[32rem] space-y-3">
              {parents.points.map((p) => (
                <li data-point key={p} className="flex gap-3 text-[17px] leading-snug">
                  <span aria-hidden className="mt-[3px] font-bold">
                    ✓
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 flex items-start justify-center min-[900px]:col-span-6 min-[900px]:pt-24">
          <figure
            data-report
            aria-label={`${report.label}: ${report.title}`}
            className="bg-card border-border w-full max-w-[460px] rounded-[28px] border p-6 md:p-8">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-[26px] font-bold">{report.title}</p>
              <p className="text-muted-foreground border-border rounded-full border px-3 py-1 text-[13px] font-semibold">
                {report.label}
              </p>
            </div>

            <ol className="mt-6 grid grid-cols-7 gap-1.5">
              {report.days.map((day) => (
                <li key={day.d} className="flex flex-col items-center gap-2">
                  <span data-day className="block size-9">
                    <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
                      {day.s === 'done' ? (
                        <>
                          <circle cx="18" cy="18" r="17" className="fill-foreground" />
                          <path
                            data-tick
                            d="M11 18.5l5 5 9-11"
                            fill="none"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="stroke-card"
                          />
                        </>
                      ) : (
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          strokeWidth="2"
                          strokeDasharray={day.s === 'missed' ? '4 4' : undefined}
                          className="stroke-control"
                        />
                      )}
                    </svg>
                  </span>
                  <span className="text-muted-foreground text-[12px] font-semibold">{day.d}</span>
                  <span className="sr-only">{STATUS_LABEL[day.s]}</span>
                </li>
              ))}
            </ol>

            <dl className="border-border mt-7 grid grid-cols-3 gap-3 border-t pt-6">
              {report.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-muted-foreground text-[13px] font-semibold">{s.label}</dt>
                  <dd className="font-display mt-1 text-[28px] leading-none font-extrabold tabular-nums">
                    <span data-stat>{s.value}</span>
                    {s.suffix}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="border-border mt-7 space-y-4 border-t pt-6">
              {report.books.map((b) => (
                <li key={b.book}>
                  <div className="flex items-baseline justify-between gap-3 text-[15px]">
                    <span className="truncate font-semibold">{b.book}</span>
                    <span className="font-semibold tabular-nums">%{b.progress}</span>
                  </div>
                  <div className="bg-border mt-2 h-2 overflow-hidden rounded-full">
                    <div
                      data-bar
                      className="bg-foreground h-full rounded-full"
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <figcaption data-report-foot className="text-muted-foreground mt-6 text-[14px]">
              {report.footer}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
