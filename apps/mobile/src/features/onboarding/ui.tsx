import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';
import { cn } from '@/lib/utils';

export const STEP_COUNT = 6;

interface StepScreenProps {
  /** Kurulum adımı; kurulum dışı ekranlarda verilmez. */
  step?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  footer?: ReactNode;
}

// Klavyenin üstüne yapışan alt bölümün (Devam + isteğe bağlı ikinci düğme) payı.
const FOOTER_OFFSET = 140;

/**
 * Form ekranı: başlık, içerik ve altta "Devam". Düğme klavye açılınca klavyenin üstüne yapışır; iOS
 * sayı klavyesinde kapatma tuşu olmadığı için öğrenci klavyeyi kapatmadan devam edebilmeli. İçerik
 * klavye ve alt bölüm kadar boşluk bırakır, odaklanan alan görünür kalır.
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
      {step !== undefined ? (
        <Stack.Screen options={{ headerTitle: () => <StepProgress step={step} /> }} />
      ) : null}
      <KeyboardAwareScrollView
        contentContainerStyle={{ gap: 24, padding: 24 }}
        bottomOffset={FOOTER_OFFSET}
        extraKeyboardSpace={FOOTER_OFFSET}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <View className="gap-2">
          {step !== undefined ? (
            <Text variant="muted">{tr.onboarding.step(step, STEP_COUNT)}</Text>
          ) : null}
          <Text variant="h2">{title}</Text>
          {subtitle ? <Text variant="muted">{subtitle}</Text> : null}
        </View>
        {children}
      </KeyboardAwareScrollView>
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

/** Üst çubukta, geri okunun yanında kurulum ilerlemesi: biten ve şu anki adım dolu bölüt. */
function StepProgress({ step }: { step: number }) {
  return (
    <View
      testID="step-progress"
      accessibilityRole="progressbar"
      accessibilityLabel={tr.onboarding.step(step, STEP_COUNT)}
      accessibilityValue={{ min: 0, max: STEP_COUNT, now: step }}
      className="w-44 flex-row gap-1.5">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <View
          key={i}
          className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-foreground' : 'bg-border')}
        />
      ))}
    </View>
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

/**
 * Seçilebilir kart ya da çip; tek seçimli listelerde kullanılır. Seçili hali ana metin renginde dolgu ve tik
 * (lamba-design DECISIONS.md, 3. sürüm): turuncu ekranda yalnız tek ana eylemde.
 */
export function Choice({ label, description, selected, onPress, testID, className }: ChoiceProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'border-control min-h-11 justify-center rounded-xl border px-4 py-3 active:opacity-70',
        selected && 'bg-foreground border-foreground',
        className,
      )}>
      <View className="flex-row items-center gap-2">
        {selected ? <Text className="text-background font-sans-bold">✓</Text> : null}
        <View className="shrink gap-0.5">
          <Text className={cn('font-sans-semibold', selected && 'text-background')}>{label}</Text>
          {description ? (
            <Text variant="muted" className={cn(selected && 'text-background')}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
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
