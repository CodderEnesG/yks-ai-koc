import { type CivilDate, diffDays, istanbulDate, parseCivilDate } from '@yks/plan-engine';
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { defaultExamDate } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';
import { formatCivilDate } from '@/lib/date';

function toCivilDate(day: string, month: string, year: string): CivilDate | null {
  const value = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  try {
    return parseCivilDate(value);
  } catch {
    return null;
  }
}

export default function ExamScreen() {
  const draft = useOnboarding();
  const [today] = useState(() => istanbulDate(Date.now()));
  const estimated = draft.grade ? defaultExamDate(draft.grade, today) : null;
  const [custom, setCustom] = useState(
    draft.examDate !== undefined && draft.examDate !== estimated,
  );
  const [parts, setParts] = useState(() => {
    const [y = '', m = '', d = ''] = (draft.examDate ?? '').split('-');
    return { day: d, month: m, year: y };
  });

  const typed = toCivilDate(parts.day, parts.month, parts.year);
  const chosen = custom || estimated === null ? typed : estimated;
  const valid = chosen !== null && diffDays(chosen, today) > 0;

  const input = (key: keyof typeof parts, label: string, maxLength: number) => (
    <View className="flex-1 gap-1">
      <Text variant="muted">{label}</Text>
      <TextInput
        testID={`exam-${key}`}
        value={parts[key]}
        onChangeText={(value) => setParts({ ...parts, [key]: value.replace(/\D/g, '') })}
        keyboardType="number-pad"
        maxLength={maxLength}
        className="border-input text-foreground rounded-xl border px-4 py-3 text-center text-lg"
      />
    </View>
  );

  return (
    <StepScreen
      step={5}
      title={tr.onboarding.exam.title}
      subtitle={tr.onboarding.exam.subtitle}
      canContinue={valid}
      onContinue={() => {
        draft.set({ examDate: chosen ?? undefined });
        router.push('/onboarding/time');
      }}>
      {estimated !== null && !custom ? (
        <View className="gap-3">
          <View className="border-primary bg-secondary rounded-xl border px-4 py-4">
            <Text testID="exam-estimated" variant="large">
              {formatCivilDate(estimated)}
            </Text>
            <Text variant="muted">{tr.common.estimated}</Text>
          </View>
          <Button testID="exam-change" variant="outline" onPress={() => setCustom(true)}>
            <Text>{tr.onboarding.exam.change}</Text>
          </Button>
        </View>
      ) : (
        <View className="gap-3">
          {estimated === null ? <Text variant="muted">{tr.onboarding.exam.none}</Text> : null}
          <View className="flex-row gap-3">
            {input('day', tr.onboarding.exam.day, 2)}
            {input('month', tr.onboarding.exam.month, 2)}
            {input('year', tr.onboarding.exam.year, 4)}
          </View>
          {parts.year.length === 4 && !valid ? (
            <Text className="text-destructive text-sm">{tr.onboarding.exam.invalid}</Text>
          ) : null}
          {estimated !== null ? (
            <Button variant="ghost" onPress={() => setCustom(false)}>
              <Text>{tr.onboarding.exam.useDefault}</Text>
            </Button>
          ) : null}
        </View>
      )}
    </StepScreen>
  );
}
