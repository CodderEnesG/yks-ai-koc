import { router } from 'expo-router';
import { View } from 'react-native';

import { FIELDS } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function FieldScreen() {
  const draft = useOnboarding();
  return (
    <StepScreen
      step={3}
      title={tr.onboarding.field.title}
      canContinue={draft.field !== undefined}
      onContinue={() => router.push('/onboarding/target')}>
      <View className="gap-3">
        {FIELDS.map((field) => (
          <Choice
            key={field}
            testID={`field-${field}`}
            label={tr.onboarding.field.options[field].label}
            description={tr.onboarding.field.options[field].description}
            selected={draft.field === field}
            onPress={() => draft.set({ field })}
          />
        ))}
      </View>
    </StepScreen>
  );
}
