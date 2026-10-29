import type { CivilDate } from '@yks/plan-engine';
import { useState } from 'react';
import { View } from 'react-native';

import { TextField } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
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
      <Text testID="counts-saved" variant="muted" className="px-1">
        {tr.checkin.countsSaved(saved.correctCount, saved.wrongCount)}
      </Text>
    );
  }

  const toNumber = (v: string) => (v === '' ? null : Number(v));
  return (
    <View className="border-border bg-card gap-4 rounded-lg border p-4">
      <Text className="text-callout font-sans-bold">{tr.checkin.countsTitle}</Text>
      <View className="flex-row items-end gap-2.5">
        <TextField
          testID="counts-correct"
          className="flex-1"
          label={tr.checkin.correct}
          icon={<Icon name={ICONS.check} size={14} />}
          numeric
          center
          value={correct}
          onChangeText={(v) => setCorrect(v.replace(/\D/g, '').slice(0, 4))}
          placeholder="0"
        />
        <TextField
          testID="counts-wrong"
          className="flex-1"
          label={tr.checkin.wrong}
          icon={<Icon name={ICONS.close} size={14} />}
          numeric
          center
          value={wrong}
          onChangeText={(v) => setWrong(v.replace(/\D/g, '').slice(0, 4))}
          placeholder="0"
        />
        <Button
          testID="counts-save"
          disabled={correct === '' && wrong === ''}
          onPress={() => saveCounts(day, toNumber(correct) ?? 0, toNumber(wrong) ?? 0, new Date())}>
          <Text>{tr.checkin.save}</Text>
        </Button>
      </View>
    </View>
  );
}
