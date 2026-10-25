import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Stepper, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

// Yarım kaldı: önce nereye kadar (son yapılan sayfa/test), sonra neden.
export default function PartialScreen() {
  const params = useLocalSearchParams<{
    ids: string;
    first: string;
    last: string;
    kind: 'pages' | 'tests';
  }>();
  const first = Number(params.first);
  const last = Number(params.last);
  const [through, setThrough] = useState(() => Math.floor((first + last - 1) / 2));

  return (
    <StepScreen
      title={tr.checkin.partialTitle}
      canContinue={through >= first && through < last}
      onContinue={() =>
        router.push({
          pathname: '/checkin/reason',
          params: { ids: params.ids, through: String(through) },
        })
      }>
      <Stepper
        testID="partial-through"
        label={tr.today.ranges(params.kind, [{ first, last }])}
        value={through}
        step={1}
        min={first}
        max={last - 1}
        format={(n) => tr.checkin.partialThrough(params.kind, n)}
        onChange={setThrough}
      />
    </StepScreen>
  );
}
