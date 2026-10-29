import { diffDays, istanbulDate, parseCivilDate } from '@yks/plan-engine';
import { router } from 'expo-router';
import { type SFSymbol, SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { View } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { Alaaddin } from '@/components/alaaddin';
import { ICONS, Icon } from '@/components/icon';
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
        <Alaaddin scene="hata" height={180} />
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
      <View className="flex-1 justify-center gap-4 px-5">
        <Text variant="h2">{tr.onboarding.done.title}</Text>
        {/* Kurulumun bitişi tek seferlik dönüm noktası: Alaaddin "mutlu", özetin yanında (lamba-design 1.8). */}
        <View className="bg-card flex-row items-stretch gap-4 rounded-xl p-3 pr-5">
          <Alaaddin scene="mutlu" height={128} className="w-24 rounded-md py-2" />
          <View className="flex-1 justify-center gap-3">
            <SummaryRow
              icon="calendar"
              androidIcon="calendar_month"
              testID="done-days-left"
              text={tr.onboarding.done.daysLeft(daysLeft)}
            />
            <SummaryRow
              icon="clock"
              androidIcon="schedule"
              text={tr.onboarding.done.weeklyHours(weeklyHours)}
            />
          </View>
        </View>
        {minor ? (
          <View
            testID="minor-notice"
            className="border-border bg-card flex-row gap-3 rounded-lg border p-4">
            <View className="bg-background size-9 items-center justify-center rounded-full">
              <Icon name={ICONS.pending} size={18} />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-callout font-sans-bold">{tr.onboarding.done.minorTitle}</Text>
              <Text variant="muted">{tr.onboarding.done.minorBody}</Text>
            </View>
          </View>
        ) : null}
      </View>
      <View className="px-5 pt-2 pb-6">
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

function SummaryRow({
  icon,
  androidIcon,
  text,
  testID,
}: {
  icon: SFSymbol;
  androidIcon: 'calendar_month' | 'schedule';
  text: string;
  testID?: string;
}) {
  const color = useCSSVariable('--color-foreground');
  return (
    <View className="flex-row items-center gap-3">
      <SymbolView
        name={{ ios: icon, android: androidIcon }}
        size={22}
        tintColor={typeof color === 'string' ? color : undefined}
        fallback={null}
      />
      <Text testID={testID} className="text-callout font-sans-semibold flex-1">
        {text}
      </Text>
    </View>
  );
}
