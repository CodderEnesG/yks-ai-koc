import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { parseTarget, TARGET_KINDS, type TargetKind } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function TargetScreen() {
  const draft = useOnboarding();
  const [kind, setKind] = useState<TargetKind>(draft.target?.kind ?? 'siralama');
  const [text, setText] = useState(draft.target ? String(draft.target.value) : '');
  const target = parseTarget(kind, text);
  const showError = text.trim() !== '' && target === null;

  const next = () => router.push('/onboarding/exam');

  return (
    <StepScreen
      step={4}
      title={tr.onboarding.target.title}
      subtitle={tr.onboarding.target.subtitle}
      canContinue={target !== null}
      onContinue={() => {
        draft.set({ target });
        next();
      }}
      footer={
        <Button
          testID="skip"
          variant="ghost"
          onPress={() => {
            draft.set({ target: null });
            next();
          }}>
          <Text>{tr.common.skip}</Text>
        </Button>
      }>
      <View className="flex-row gap-3">
        {TARGET_KINDS.map((k) => (
          <Choice
            key={k}
            testID={`target-${k}`}
            label={tr.onboarding.target.kinds[k]}
            selected={kind === k}
            onPress={() => setKind(k)}
            className="flex-1 items-center"
          />
        ))}
      </View>
      <View className="gap-2">
        <TextInput
          testID="target-input"
          value={text}
          onChangeText={setText}
          placeholder={tr.onboarding.target.placeholder[kind]}
          keyboardType={kind === 'puan' ? 'decimal-pad' : 'number-pad'}
          className="border-input text-foreground rounded-xl border px-4 py-3 text-lg"
          placeholderTextColorClassName="accent-muted-foreground"
        />
        {showError ? (
          <Text className="text-destructive text-sm">{tr.onboarding.target.invalid[kind]}</Text>
        ) : null}
      </View>
    </StepScreen>
  );
}
