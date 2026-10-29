import { istanbulDate } from '@yks/plan-engine';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useOnboarding } from '@/features/onboarding/store';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

// 11. sınıf en küçük ≈15, mezun en büyük için geniş tutuldu.
const MIN_AGE = 14;
const MAX_AGE = 30;

export default function BirthScreen() {
  const draft = useOnboarding();
  const [thisYear] = useState(() => Number(istanbulDate(Date.now()).slice(0, 4)));
  const years = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => thisYear - MIN_AGE - i);

  return (
    <StepScreen
      step={1}
      title={tr.onboarding.birth.title}
      subtitle={tr.onboarding.birth.subtitle}
      canContinue={draft.birthMonth !== undefined && draft.birthYear !== undefined}
      onContinue={() => router.push('/onboarding/grade')}>
      <View className="gap-2">
        <Text className="font-sans-semibold">{tr.onboarding.birth.month}</Text>
        <View className="flex-row flex-wrap gap-2">
          {tr.months.map((name, i) => (
            <Choice
              key={name}
              testID={`month-${i + 1}`}
              label={name}
              selected={draft.birthMonth === i + 1}
              onPress={() => draft.set({ birthMonth: i + 1 })}
              className="w-[31%] items-center px-2"
            />
          ))}
        </View>
      </View>
      <View className="gap-2">
        <Text className="font-sans-semibold">{tr.onboarding.birth.year}</Text>
        <View className="flex-row flex-wrap gap-2">
          {years.map((year) => (
            <Choice
              key={year}
              testID={`year-${year}`}
              label={String(year)}
              selected={draft.birthYear === year}
              onPress={() => draft.set({ birthYear: year })}
              className="w-[23%] items-center px-1"
            />
          ))}
        </View>
      </View>
    </StepScreen>
  );
}
