import type { Reason } from '@yks/plan-engine';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { REASONS, markPartial, markTasks } from '@/features/plan/checkin';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

// Neden seçimi (tek dokunuş). `through` varsa yarım kaldı: o sayfaya/teste kadar yapıldı.
export default function ReasonScreen() {
  const params = useLocalSearchParams<{ ids: string; through?: string }>();
  const ids = params.ids.split(',');
  const [reason, setReason] = useState<Reason | null>(null);

  return (
    <StepScreen
      title={tr.checkin.reasonTitle}
      subtitle={tr.checkin.reasonSubtitle}
      continueLabel={tr.checkin.save}
      canContinue={reason !== null}
      onContinue={() => {
        if (!reason) return;
        if (params.through) markPartial(ids, Number(params.through), reason, new Date());
        else markTasks(ids, 'skipped', reason, new Date());
        router.dismissTo('/');
      }}>
      <View className="gap-3">
        {REASONS.map((r) => (
          <Choice
            key={r}
            testID={`reason-${r}`}
            label={tr.checkin.reasons[r]}
            selected={reason === r}
            onPress={() => setReason(r)}
          />
        ))}
      </View>
    </StepScreen>
  );
}
