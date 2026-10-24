import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MAX_DAY_MINUTES, MINUTE_STEP, splitWeek } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { StepScreen, Stepper } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

const DEFAULT_WEEKDAY = 120;
const DEFAULT_WEEKEND = 240;

export default function TimeScreen() {
  const draft = useOnboarding();
  const [days, setDays] = useState(
    () => draft.weekdayMinutes ?? splitWeek(DEFAULT_WEEKDAY, DEFAULT_WEEKEND),
  );
  const [perDay, setPerDay] = useState(
    () => new Set(days.slice(0, 5)).size > 1 || new Set(days.slice(5)).size > 1,
  );
  const atLeastOne = days.some((m) => m > 0);

  const stepper = (label: string, value: number, onChange: (v: number) => void, testID: string) => (
    <Stepper
      key={testID}
      testID={testID}
      label={label}
      value={value}
      step={MINUTE_STEP}
      min={0}
      max={MAX_DAY_MINUTES}
      format={tr.onboarding.time.hours}
      onChange={onChange}
    />
  );

  return (
    <StepScreen
      step={6}
      title={tr.onboarding.time.title}
      subtitle={tr.onboarding.time.subtitle}
      canContinue={atLeastOne}
      onContinue={() => {
        draft.set({ weekdayMinutes: days });
        router.push('/onboarding/done');
      }}>
      <View className="gap-4">
        {perDay
          ? tr.weekdays.map((name, i) =>
              stepper(
                name,
                days[i]!,
                (v) => setDays(days.map((d, j) => (j === i ? v : d))),
                `day-${i}`,
              ),
            )
          : [
              stepper(
                tr.onboarding.time.weekday,
                days[0]!,
                (v) => setDays(splitWeek(v, days[5]!)),
                'weekday',
              ),
              stepper(
                tr.onboarding.time.weekend,
                days[5]!,
                (v) => setDays(splitWeek(days[0]!, v)),
                'weekend',
              ),
            ]}
      </View>
      {!perDay ? (
        <Button testID="per-day" variant="ghost" onPress={() => setPerDay(true)}>
          <Text>{tr.onboarding.time.perDay}</Text>
        </Button>
      ) : null}
      {!atLeastOne ? (
        <Text className="text-destructive text-sm">{tr.onboarding.time.atLeastOne}</Text>
      ) : null}
    </StepScreen>
  );
}
