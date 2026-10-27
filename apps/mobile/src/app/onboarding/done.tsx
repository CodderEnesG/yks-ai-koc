import { diffDays, istanbulDate, parseCivilDate } from '@yks/plan-engine';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { startAnalytics, track } from '@/features/analytics/analytics';
import { isMinor, profileIssues, profileSchema } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { saveProfile } from '@/features/profile/repo';
import { tr } from '@/i18n/tr';

export default function DoneScreen() {
  const draft = useOnboarding();
  const [today] = useState(() => istanbulDate(Date.now()));
  const parsed = profileSchema.safeParse({ ...draft, target: draft.target ?? null });
  const issues = parsed.success ? profileIssues(parsed.data, today) : [];

  // Eksik ya da tutarsız adım varsa kurulumun başına dön; normal akışta buraya gelinmez.
  if (!parsed.success || issues.length > 0) {
    return (
      <SafeAreaView className="bg-background flex-1 justify-center gap-4 p-6">
        <Text>
          {issues.includes('exam_in_past')
            ? tr.onboarding.exam.invalid
            : tr.onboarding.welcome.title}
        </Text>
        <Button onPress={() => router.replace('/onboarding')}>
          <Text>{tr.onboarding.welcome.start}</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const profile = parsed.data;
  const minor = isMinor(profile.birthYear, profile.birthMonth, today);
  const daysLeft = diffDays(parseCivilDate(profile.examDate), today);
  const weeklyHours = profile.weekdayMinutes.reduce((a, b) => a + b, 0) / 60;

  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <View className="flex-1 gap-4 p-6">
        <Text variant="h3">{tr.onboarding.done.title}</Text>
        <Text testID="done-days-left">{tr.onboarding.done.daysLeft(daysLeft)}</Text>
        <Text>{tr.onboarding.done.weeklyHours(weeklyHours)}</Text>
        {minor ? (
          <View
            testID="minor-notice"
            className="border-border bg-muted gap-2 rounded-xl border p-4">
            <Text className="font-sans-semibold">{tr.onboarding.done.minorTitle}</Text>
            <Text variant="muted">{tr.onboarding.done.minorBody}</Text>
          </View>
        ) : null}
      </View>
      <View className="p-6">
        <Button
          testID="finish"
          size="lg"
          onPress={() => {
            saveProfile(profile, today, new Date());
            // 18 yaş altında veli onayına kadar analitik yok (değişmez kural).
            if (!minor) {
              startAnalytics();
              track('onboarding_tamam', { sinif: profile.grade, alan: profile.field });
            }
            draft.reset();
            router.replace('/');
          }}>
          <Text>{tr.onboarding.done.finish}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
