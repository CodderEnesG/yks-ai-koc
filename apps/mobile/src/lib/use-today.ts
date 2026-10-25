import { type CivilDate, istanbulDate } from '@yks/plan-engine';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const DAY_MS = 86_400_000;
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000;

/** İstanbul'daki bugünün tarihi; gece yarısında ve uygulama öne gelince güncellenir. */
export function useToday(): CivilDate {
  const [today, setToday] = useState(() => istanbulDate(Date.now()));

  useEffect(() => {
    const refresh = () => setToday(istanbulDate(Date.now()));
    const now = Date.now();
    const untilMidnight = DAY_MS - ((now + ISTANBUL_OFFSET_MS) % DAY_MS) + 1000;
    const timer = setTimeout(refresh, untilMidnight);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [today]);

  return today;
}
