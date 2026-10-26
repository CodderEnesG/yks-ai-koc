import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useSession } from './auth';
import { push } from './sync';

const INTERVAL_MS = 60_000;

/** Girişte, uygulama öne gelince ve açıkken dakikada bir değişenleri gönderir. Hata sessiz geçer, sonra yeniden denenir. */
export function useSync(): void {
  const session = useSession();
  const signedIn = !!session;
  useEffect(() => {
    if (!signedIn) return;
    const run = () => void push().catch(() => undefined);
    run();
    const timer = setInterval(run, INTERVAL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') run();
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [signedIn]);
}
