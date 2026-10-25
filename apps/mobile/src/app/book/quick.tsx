import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { addQuickBook } from '@/features/library/repo';
import {
  DEFAULT_MINUTES,
  type ItemKind,
  MINUTE_CHOICES,
  quickAddSchema,
} from '@/features/library/rules';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function QuickAddScreen() {
  const q = tr.library.quick;
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<ItemKind>('pages');
  const [count, setCount] = useState('');
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES.pages);
  const parsed = quickAddSchema.safeParse({
    title,
    kind,
    count: Number(count),
    minutesPerItem: minutes,
  });

  const input = 'border-input text-foreground rounded-xl border px-4 py-3 text-lg';
  return (
    <StepScreen
      title={q.title}
      continueLabel={q.add}
      canContinue={parsed.success}
      onContinue={() => {
        if (!parsed.success) return;
        addQuickBook(parsed.data, new Date());
        router.dismissTo('/library');
      }}>
      <View className="gap-2">
        <Text className="font-medium">{q.name}</Text>
        <TextInput
          testID="quick-title"
          value={title}
          onChangeText={setTitle}
          placeholder={q.namePlaceholder}
          className={input}
          placeholderTextColorClassName="accent-muted-foreground"
        />
      </View>
      <View className="gap-2">
        <Text className="font-medium">{q.kind}</Text>
        <View className="flex-row gap-3">
          {(['pages', 'tests'] as const).map((k) => (
            <Choice
              key={k}
              testID={`quick-kind-${k}`}
              label={q.kinds[k]}
              selected={kind === k}
              onPress={() => {
                setKind(k);
                setMinutes(DEFAULT_MINUTES[k]);
              }}
              className="flex-1 items-center"
            />
          ))}
        </View>
      </View>
      <View className="gap-2">
        <Text className="font-medium">{q.count[kind]}</Text>
        <TextInput
          testID="quick-count"
          value={count}
          onChangeText={(v) => setCount(v.replace(/\D/g, ''))}
          keyboardType="number-pad"
          className={input}
        />
      </View>
      <View className="gap-2">
        <Text className="font-medium">
          {kind === 'pages'
            ? tr.library.edition.minutesTitle
            : tr.library.edition.minutesTitleTests}
        </Text>
        <View className="flex-row gap-2">
          {MINUTE_CHOICES[kind].map((m) => (
            <Choice
              key={m}
              testID={`minutes-${m}`}
              label={tr.library.edition.minutes(m)}
              selected={minutes === m}
              onPress={() => setMinutes(m)}
              className="flex-1 items-center"
            />
          ))}
        </View>
      </View>
    </StepScreen>
  );
}
