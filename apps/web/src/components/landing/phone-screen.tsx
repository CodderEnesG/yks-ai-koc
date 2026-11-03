'use client';

import Image from 'next/image';

import type { ScreenKind } from '@/content/landing';
import type { ScreenFiles, ScreenKey } from '@/content/screen-keys';

import {
  ChatScreen,
  CheckinScreen,
  LibraryScreen,
  NotificationScreen,
  ReplanScreen,
  TodayScreen,
} from './mock-screens';

/** Gerçek ekran görüntüsü (açık tema önce) ya da yoksa `undefined`. */
export function shotFor(screens: ScreenFiles, key: ScreenKey) {
  const files = screens[key];
  return files?.acik ?? files?.koyu;
}

function Shot({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="300px" className="object-cover object-top" />;
}

const KIND_TO_KEY: Partial<Record<ScreenKind, ScreenKey>> = { today: 'bugun', checkin: 'checkin' };

/** "Bir gün" bölümünün telefon ekranı: varsa gerçek görüntü, yoksa taklit. */
export function DayScreen({
  kind,
  active,
  screens,
}: {
  kind: ScreenKind;
  active: boolean;
  screens: ScreenFiles;
}) {
  const key = KIND_TO_KEY[kind];
  const src = key ? shotFor(screens, key) : undefined;
  if (src) return <Shot src={src} alt="" />;
  switch (kind) {
    case 'notification':
      return <NotificationScreen />;
    case 'today':
      return <TodayScreen />;
    case 'checkin':
      return <CheckinScreen active={active} />;
    case 'replan':
      return <ReplanScreen active={active} />;
  }
}

/** Ekranlar galerisi: varsa gerçek görüntü, yoksa taklit; ayarların taklidi yok (görüntü gelmezse gösterilmez). */
export function GalleryScreen({
  id,
  screens,
  alt,
}: {
  id: ScreenKey;
  screens: ScreenFiles;
  alt: string;
}) {
  const src = shotFor(screens, id);
  if (src) return <Shot src={src} alt={alt} />;
  switch (id) {
    case 'bugun':
      return <TodayScreen />;
    case 'checkin':
      return <CheckinScreen active />;
    case 'kutuphane':
      return <LibraryScreen />;
    case 'sohbet':
      return <ChatScreen />;
    case 'ayarlar':
      return null;
  }
}
