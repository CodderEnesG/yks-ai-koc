import { useEffect } from 'react';

import type { Profile } from '@/features/profile/repo';
import { canSync } from '@/features/sync/mapping';

import { startAnalytics, stopAnalytics } from './analytics';

/** Analitik yalnız reşit ya da veli onaylı öğrencide açık; onay geri çekilince kapanır. */
export function useAnalyticsGate(status: Profile['consentStatus'] | undefined): void {
  useEffect(() => {
    if (status === undefined) return;
    if (canSync(status)) startAnalytics();
    else void stopAnalytics();
  }, [status]);
}
