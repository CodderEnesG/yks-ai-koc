import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';
import { cn } from '@/lib/utils';

export const STEP_COUNT = 6;

interface StepScreenProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  footer?: ReactNode;
}

/**
 * Kurulumun tek bir adımı: başlık, içerik ve altta "Devam". Düğme klavye açılınca klavyenin üstüne
 * yapışır; iOS sayı klavyesinde kapatma tuşu olmadığı için öğrenci klavyeyi kapatmadan devam edebilmeli.
 */
export function StepScreen({
  step,
  title,
  subtitle,
  children,
  canContinue,
  onContinue,
  continueLabel = tr.common.continue,
  footer,
}: StepScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView
        contentContainerClassName="gap-6 p-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <View className="gap-2">
          <Text variant="muted">{tr.onboarding.step(step, STEP_COUNT)}</Text>
          <Text variant="h3">{title}</Text>
          {subtitle ? <Text variant="muted">{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View className="bg-background gap-2 p-6 pt-2">
          {footer}
          <Button testID="continue" disabled={!canContinue} onPress={onContinue}>
            <Text>{continueLabel}</Text>
          </Button>
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

interface ChoiceProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
  className?: string;
}

/** Seçilebilir kart; tek seçimli listelerde kullanılır. */
export function Choice({ label, description, selected, onPress, testID, className }: ChoiceProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'border-border rounded-xl border px-4 py-3 active:opacity-70',
        selected && 'border-primary bg-secondary',
        className,
      )}>
      <Text className={cn('font-medium', selected && 'text-primary')}>{label}</Text>
      {description ? <Text variant="muted">{description}</Text> : null}
    </Pressable>
  );
}

interface StepperProps {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  testID?: string;
}

/** − değer + düzeni; günlük dakika ayarı için. */
export function Stepper({ label, value, step, min, max, format, onChange, testID }: StepperProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="flex-1">{label}</Text>
      <Button
        testID={testID && `${testID}-minus`}
        variant="outline"
        size="icon"
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - step))}>
        <Text>−</Text>
      </Button>
      <Text testID={testID && `${testID}-value`} className="w-28 text-center">
        {format(value)}
      </Text>
      <Button
        testID={testID && `${testID}-plus`}
        variant="outline"
        size="icon"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + step))}>
        <Text>+</Text>
      </Button>
    </View>
  );
}
