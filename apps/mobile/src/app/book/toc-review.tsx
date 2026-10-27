import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { track } from '@/features/analytics/analytics';
import { addCustomBook } from '@/features/library/repo';
import { DEFAULT_MINUTES, editionFromToc, MINUTE_CHOICES } from '@/features/library/rules';
import { useTocDraft } from '@/features/library/toc';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';
import { cn } from '@/lib/utils';

// Okunan içindekilerin öğrenci tarafından kontrolü (rapor 2.8: "30 sn'de kontrol edip onaylar").
export default function TocReviewScreen() {
  const t = tr.library.toc;
  const draft = useTocDraft();
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState(draft.rows);
  const [lastPage, setLastPage] = useState('');
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES.pages);
  const result = editionFromToc(title, rows, Number(lastPage));
  const issueAt = (i: number) => result.issues.find((x) => x.index === i)?.issue;
  const input = 'border-input text-foreground rounded-xl border px-3 py-2';

  return (
    <StepScreen
      title={t.reviewTitle}
      subtitle={t.reviewSubtitle}
      continueLabel={t.save}
      canContinue={result.edition !== null}
      onContinue={() => {
        if (!result.edition) return;
        addCustomBook(result.edition, minutes, new Date());
        track('kitap_eklendi', { yontem: 'icindekiler' });
        draft.set([]);
        router.dismissTo('/library');
      }}>
      <View className="gap-2">
        <Text className="font-medium">{t.bookName}</Text>
        <TextInput
          testID="toc-title"
          value={title}
          onChangeText={setTitle}
          className={cn(input, 'text-lg')}
          placeholderTextColorClassName="accent-muted-foreground"
        />
      </View>
      {rows.map((row, i) => {
        const issue = issueAt(i);
        return (
          <View key={i} testID={`toc-row-${i}`} className="flex-row items-center gap-2">
            <TextInput
              value={row.title}
              onChangeText={(v) => setRows(rows.map((r, j) => (j === i ? { ...r, title: v } : r)))}
              className={cn(input, 'flex-1')}
            />
            <TextInput
              testID={`toc-start-${i}`}
              value={row.start}
              onChangeText={(v) =>
                setRows(rows.map((r, j) => (j === i ? { ...r, start: v.replace(/\D/g, '') } : r)))
              }
              keyboardType="number-pad"
              accessibilityLabel={t.rowStart}
              className={cn(input, 'w-16 text-center', issue && 'border-destructive')}
            />
          </View>
        );
      })}
      {result.issues.some((x) => x.index < rows.length && x.index >= 0) ? (
        <Text testID="toc-issues" className="text-destructive text-sm">
          {result.issues.some((x) => x.issue === 'not_ascending') ? t.issueOrder : t.issueMissing}
        </Text>
      ) : null}
      <View className="gap-2">
        <Text className="font-medium">{t.lastPage}</Text>
        <TextInput
          testID="toc-last-page"
          value={lastPage}
          onChangeText={(v) => setLastPage(v.replace(/\D/g, ''))}
          keyboardType="number-pad"
          className={cn(input, 'w-24 text-center text-lg')}
        />
      </View>
      <View className="gap-2">
        <Text className="font-medium">{tr.library.edition.minutesTitle}</Text>
        <View className="flex-row gap-2">
          {MINUTE_CHOICES.pages.map((m) => (
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
