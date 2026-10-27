import type { CivilDate } from '@yks/plan-engine';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

import { saveCounts, useCheckin } from './checkin';

/** Günün isteğe bağlı doğru/yanlış sayısı (rapor 1.2: check-in'de isteğe bağlı). */
export function CountsForm({ day }: { day: CivilDate }) {
  const saved = useCheckin(day);
  const [correct, setCorrect] = useState('');
  const [wrong, setWrong] = useState('');
  if (saved === undefined) return null;
  if (saved && saved.correctCount !== null && saved.wrongCount !== null) {
    return (
      <Text testID="counts-saved" variant="muted">
        {tr.checkin.countsSaved(saved.correctCount, saved.wrongCount)}
      </Text>
    );
  }

  const input = 'border-input text-foreground flex-1 rounded-xl border px-3 py-2 text-center';
  const toNumber = (v: string) => (v === '' ? null : Number(v));
  return (
    <View className="border-border gap-2 rounded-xl border p-4">
      <Text className="font-sans-semibold">{tr.checkin.countsTitle}</Text>
      <View className="flex-row items-center gap-2">
        <TextInput
          testID="counts-correct"
          value={correct}
          onChangeText={(v) => setCorrect(v.replace(/\D/g, '').slice(0, 4))}
          placeholder={tr.checkin.correct}
          keyboardType="number-pad"
          className={input}
          placeholderTextColorClassName="accent-muted-foreground"
        />
        <TextInput
          testID="counts-wrong"
          value={wrong}
          onChangeText={(v) => setWrong(v.replace(/\D/g, '').slice(0, 4))}
          placeholder={tr.checkin.wrong}
          keyboardType="number-pad"
          className={input}
          placeholderTextColorClassName="accent-muted-foreground"
        />
        <Button
          testID="counts-save"
          size="sm"
          disabled={correct === '' && wrong === ''}
          onPress={() => saveCounts(day, toNumber(correct) ?? 0, toNumber(wrong) ?? 0, new Date())}>
          <Text>{tr.checkin.save}</Text>
        </Button>
      </View>
    </View>
  );
}
