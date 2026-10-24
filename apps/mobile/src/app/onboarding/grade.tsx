import { router } from 'expo-router';
import { View } from 'react-native';

import { GRADES } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function GradeScreen() {
  const draft = useOnboarding();
  return (
    <StepScreen
      step={2}
      title={tr.onboarding.grade.title}
      canContinue={draft.grade !== undefined}
      onContinue={() => router.push('/onboarding/field')}>
      <View className="gap-3">
        {GRADES.map((grade) => (
          <Choice
            key={grade}
            testID={`grade-${grade}`}
            label={tr.onboarding.grade.options[grade]}
            selected={draft.grade === grade}
            // Sınıf değişirse tahmini sınav tarihi de değişir; eski seçim taşınmasın.
            onPress={() => draft.set({ grade, examDate: undefined })}
          />
        ))}
      </View>
    </StepScreen>
  );
}
