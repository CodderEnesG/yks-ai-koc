import { useEffect } from 'react';
import { AppState } from 'react-native';

import type { Profile } from '@/features/profile/repo';

import { refreshConsentStatus } from './consent';

/** Onay bekleyen ya da onaylı 18 yaş altı öğrencide durumu açılışta ve uygulama öne gelince sorar. */
export function useConsentWatch(status: Profile['consentStatus'] | undefined): void {
  const watching = status === 'pending' || status === 'granted';
  useEffect(() => {
    if (!watching) return;
    const run = () => void refreshConsentStatus().catch(() => undefined);
    run();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') run();
    });
    return () => sub.remove();
  }, [watching]);
}
