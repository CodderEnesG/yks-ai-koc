'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { alaaddin, sample } from '@/content/landing';
import { Flip, gsap, MEDIA, useGSAP } from '@/lib/gsap';

// Uygulama ekranlarının kodla yapılmış kopyaları (gerçek ekran görüntüsü gelene kadar ve gelmeyen ekranlar için).
// Uygulamanın açık temasıyla aynı kurallar: kırmızı/yeşil yok; durum renkle değil şekille (boş daire planlı, dolu
// daire tik yaptım, yarım daire yarım kaldı). Telefon içinde ≈250 px genişliğe göre ölçülü.

type Status = 'planned' | 'done' | 'partial';

function StatusMark({ status }: { status: Status }) {
  return (
    <span
      aria-hidden
      className="relative mt-[1px] flex size-[15px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[#1c1330]">
      {status === 'done' ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[#1c1330] text-[9px] leading-none font-bold text-[#f6eee0]">
          ✓
        </span>
      ) : null}
      {status === 'partial' ? (
        <span className="absolute inset-y-0 left-0 w-1/2 bg-[#1c1330]" />
      ) : null}
    </span>
  );
}

function AppHeader() {
  return (
    <div className="px-3.5 pt-9 pb-2">
      <p className="font-display text-[22px] leading-none font-bold text-[#1c1330]">
        {sample.header.title}
      </p>
      <p className="mt-1 text-[10.5px] text-[#5c5170]">{sample.header.meta}</p>
    </div>
  );
}

function TaskCard({
  book,
  range,
  meta,
  status = 'planned',
  buttons = false,
  flipId,
  note,
}: {
  book: string;
  range: string;
  meta: string;
  status?: Status;
  buttons?: boolean;
  flipId?: string;
  note?: string;
}) {
  return (
    <div
      data-flip-id={flipId}
      className={`rounded-[12px] border border-[#d9ccb4] p-2.5 ${status === 'done' ? 'bg-[#f6eee0]' : 'bg-[#fbf6ec]'}`}>
      <div className="flex gap-2">
        <StatusMark status={status} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11.5px] leading-tight font-bold text-[#1c1330]">{book}</p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-semibold text-[#1c1330]">{range}</p>
            <p className="truncate text-[10px] text-[#5c5170]">{meta}</p>
          </div>
          {note ? <p className="mt-1 text-[10px] font-semibold text-[#1c1330]">{note}</p> : null}
        </div>
      </div>
      {buttons ? (
        <div className="mt-2 flex gap-1 border-t border-[#d9ccb4] pt-2">
          <span className="flex-1 rounded-[7px] bg-[#1c1330] py-1 text-center text-[9.5px] font-semibold text-[#f6eee0]">
            Yaptım
          </span>
          <span className="flex-1 rounded-[7px] border border-[#5c5170] py-1 text-center text-[9.5px] font-semibold text-[#1c1330]">
            Yarım kaldı
          </span>
          <span className="flex-1 rounded-[7px] border border-[#5c5170] py-1 text-center text-[9.5px] font-semibold text-[#1c1330]">
            Yapamadım
          </span>
        </div>
      ) : null}
    </div>
  );
}

function VideoCard({ status = 'planned' }: { status?: Status }) {
  return (
    <div className="rounded-[12px] border border-[#d9ccb4] bg-[#fbf6ec] p-2.5">
      <div className="flex gap-2">
        <StatusMark status={status} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11.5px] leading-tight font-bold text-[#1c1330]">
            {sample.video.title}
          </p>
          <p className="truncate text-[10px] text-[#5c5170]">{sample.video.list}</p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <p className="text-[10px] font-semibold text-[#1c1330]">YouTube</p>
            <p className="truncate text-[10px] text-[#5c5170]">{sample.video.meta}</p>
          </div>
        </div>
      </div>
      {status === 'planned' ? (
        <span className="mt-2 ml-[23px] inline-block rounded-[7px] border border-[#5c5170] px-2 py-1 text-[9.5px] font-semibold text-[#1c1330]">
          YouTube’da aç ↗
        </span>
      ) : null}
    </div>
  );
}

export function NotificationScreen() {
  return (
    <div className="flex h-full flex-col items-center bg-[#1c1330] px-3 pt-14 text-[#f6eee0]">
      <p className="text-[11px] text-[#bdb2cf]">Salı</p>
      <p className="font-display text-[64px] leading-none font-bold tracking-tight">07:30</p>
      <div className="mt-8 w-full rounded-[16px] bg-[#2a1f45] p-3">
        <div className="flex items-center gap-2">
          <Image
            src="/lamba-simge.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 rounded-[5px]"
          />
          <p className="text-[10px] font-semibold tracking-wide text-[#bdb2cf]">lamba</p>
          <p className="ml-auto text-[10px] text-[#bdb2cf]">şimdi</p>
        </div>
        <p className="mt-2 text-[12.5px] font-bold">{sample.notification.title}</p>
        <p className="text-[11.5px] leading-snug text-[#f6eee0]/90">{sample.notification.body}</p>
      </div>
    </div>
  );
}

export function TodayScreen() {
  return (
    <div className="h-full bg-[#f6eee0]">
      <AppHeader />
      <div className="space-y-2 px-3">
        {sample.tasks.map((t, i) => (
          <TaskCard key={t.id} book={t.book} range={t.range} meta={t.meta} buttons={i === 0} />
        ))}
        <VideoCard />
      </div>
    </div>
  );
}

export function CheckinScreen({ active }: { active: boolean }) {
  const { checkin } = sample;
  return (
    <div data-active={active} className="group relative h-full bg-[#f6eee0]">
      <AppHeader />
      <div className="space-y-2 px-3">
        {sample.tasks.map((t) => {
          const done = checkin.done.includes(t.id);
          const partial = checkin.partial.id === t.id;
          return (
            <TaskCard
              key={t.id}
              book={t.book}
              range={t.range}
              meta={t.meta}
              status={done ? 'done' : partial ? 'partial' : 'planned'}
              note={
                done ? 'Yaptım' : partial ? `Yarım kaldı · ${checkin.partial.range}` : undefined
              }
            />
          );
        })}
        <VideoCard status="done" />
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-full rounded-t-[18px] border-t border-[#d9ccb4] bg-[#fbf6ec] px-3 pt-3 pb-6 transition-transform delay-300 duration-700 ease-out group-data-[active=true]:translate-y-0">
        <p className="text-[12px] font-bold text-[#1c1330]">Fizik neden yarım kaldı?</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {checkin.reasons.map((r) => (
            <span
              key={r}
              className={`rounded-full border px-2 py-1 text-[9.5px] font-semibold transition-colors delay-[1400ms] duration-300 ${
                r === checkin.chosen
                  ? 'border-[#1c1330] text-[#1c1330] group-data-[active=true]:bg-[#1c1330] group-data-[active=true]:text-[#f6eee0]'
                  : 'border-[#5c5170] text-[#1c1330]'
              }`}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Gece yeniden plan: kalan sayfalar (s. 38-41) kartı ikiye bölünüp yarına ve perşembeye uçar. Kartlar Flip.fit ile
 * kalan kartın yerinden başlar, kendi yerlerine oturur.
 */
export function ReplanScreen({ active }: { active: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const { replan } = sample;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !active) return;
      const source = root.querySelector<HTMLElement>('[data-leftover]');
      const moved = gsap.utils.toArray<HTMLElement>('[data-moved]', root);
      const mm = gsap.matchMedia();
      mm.add(MEDIA.reduce, () => {
        gsap.set(source, { autoAlpha: 0, height: 0, marginBottom: -12 });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!source) return;
        const tl = gsap.timeline({ delay: 0.5 });
        moved.forEach((card, i) => {
          const vars = Flip.fit(card, source, { scale: true, getVars: true }) as gsap.TweenVars;
          tl.from(card, { ...vars, duration: 0.9, ease: 'power3.inOut' }, i * 0.12);
        });
        tl.to(source, { autoAlpha: 0, scale: 0.92, duration: 0.4 }, 0.1);
        // Kalan kartın yeri kartlar oturduktan sonra kapanır; liste yukarı kayar.
        tl.to(
          source,
          { height: 0, marginBottom: -12, duration: 0.45, ease: 'power2.inOut' },
          '>0.25',
        );
        tl.from('[data-note]', { autoAlpha: 0, y: 6, duration: 0.4 }, '>-0.1');
      });
    },
    { scope, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="relative h-full bg-[#f6eee0]">
      <div className="px-3.5 pt-9 pb-2">
        <p className="font-display text-[22px] leading-none font-bold text-[#1c1330]">Plan</p>
        <p className="mt-1 text-[10.5px] text-[#5c5170]">Yeniden kuruldu · 23:30</p>
      </div>
      <div className="relative px-3">
        <div data-leftover className="relative z-10">
          <TaskCard
            book={replan.leftover.book}
            range={replan.leftover.range}
            meta={replan.leftover.meta}
            status="partial"
          />
        </div>
        {replan.days.map((day) => (
          <div key={day.label} className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold tracking-wide text-[#5c5170]">{day.label}</p>
            <div className="space-y-2">
              {day.tasks.map((t) => (
                <div key={t.id} data-moved={'moved' in t ? '' : undefined}>
                  <TaskCard book={t.book} range={t.range} meta={t.meta} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <p data-note className="mt-3 text-center text-[10.5px] font-semibold text-[#1c1330]">
          {replan.note}
        </p>
      </div>
    </div>
  );
}

export function LibraryScreen() {
  return (
    <div className="h-full bg-[#f6eee0]">
      <div className="px-3.5 pt-9 pb-2">
        <p className="font-display text-[22px] leading-none font-bold text-[#1c1330]">Kütüphane</p>
        <p className="mt-1 text-[10.5px] text-[#5c5170]">3 kitap · 1 liste</p>
      </div>
      <div className="space-y-2 px-3">
        {sample.library.map((b) => (
          <div key={b.book} className="rounded-[12px] border border-[#d9ccb4] bg-[#fbf6ec] p-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-[11.5px] font-bold text-[#1c1330]">{b.book}</p>
              <p className="text-[10.5px] font-semibold text-[#1c1330]">%{b.progress}</p>
            </div>
            {b.video ? <p className="text-[10px] text-[#5c5170]">YouTube oynatma listesi</p> : null}
            <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-[#d9ccb4]">
              <div
                className="h-full rounded-full bg-[#1c1330]"
                style={{ width: `${b.progress}%` }}
              />
            </div>
          </div>
        ))}
        <div className="rounded-[12px] border border-dashed border-[#5c5170] p-2.5 text-center text-[11px] font-semibold text-[#1c1330]">
          + Kitap ya da liste ekle
        </div>
      </div>
    </div>
  );
}

export function ChatScreen() {
  return (
    <div className="flex h-full flex-col bg-[#f6eee0]">
      <div className="px-3.5 pt-9 pb-2">
        <p className="font-display text-[22px] leading-none font-bold text-[#1c1330]">Alaaddin</p>
      </div>
      <div className="mx-3 flex items-center justify-center rounded-[14px] bg-[#1c1330] py-2">
        <Image src="/alaaddin/sakin.webp" alt="" width={33} height={96} className="h-24 w-auto" />
      </div>
      <div className="mt-3 space-y-2 px-3">
        {alaaddin.chat.map((m, i) => (
          <p
            key={i}
            className={`max-w-[85%] rounded-[12px] px-2.5 py-1.5 text-[10.5px] leading-snug ${
              m.from === 'me'
                ? 'ml-auto bg-[#1c1330] text-[#f6eee0]'
                : 'border border-[#d9ccb4] bg-[#fbf6ec] text-[#1c1330]'
            }`}>
            {m.text}
          </p>
        ))}
      </div>
    </div>
  );
}
