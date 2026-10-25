import { diffDays, parseCivilDate, weekdayIndex } from '@yks/plan-engine';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { groupTasks } from '@/features/plan/group';
import { computePlan, refreshToday, useLibraryVersion, useTodayTasks } from '@/features/plan/repo';
import { deleteProfile, useProfile } from '@/features/profile/repo';
import { tr } from '@/i18n/tr';
import { formatCivilDate } from '@/lib/date';
import { useToday } from '@/lib/use-today';

// Bugün ekranı (T13): plan motorunun bugünkü görevleri. Check-in ve neden seçimi T14'te.
export default function TodayScreen() {
  const profile = useProfile();
  const today = useToday();
  const version = useLibraryVersion();
  const tasks = useTodayTasks(today);
  // Uyarılar için plan; `version` SQLite girdilerinin imzası, değişince yeniden hesaplanır.
  const plan = useMemo(() => (version === undefined ? null : computePlan(today)), [today, version]);

  // Bugünün görevlerini cihaza yaz (check-in başladıysa dokunulmaz).
  useEffect(() => {
    if (version !== undefined) refreshToday(today, new Date());
  }, [today, version]);

  if (!profile || !tasks) return null;

  const daysLeft = diffDays(parseCivilDate(profile.examDate), today);
  const restDay = profile.weekdayMinutes[weekdayIndex(today)] === 0;
  const hasSources =
    plan !== null &&
    (plan.days.some((d) => d.tasks.length > 0) ||
      plan.optional.length > 0 ||
      plan.unscheduled.length > 0);
  const totalSeconds = tasks.reduce((a, t) => a + t.estSeconds, 0);
  const groups = groupTasks(tasks);
  const overload = plan?.warnings.find((w) => w.code === 'overload');

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-4 p-6">
        <View className="gap-1">
          <Text variant="h3">{tr.today.title}</Text>
          <Text variant="muted">
            {formatCivilDate(today)} · {tr.weekdays[weekdayIndex(today)]}
          </Text>
          <Text testID="today-countdown" variant="large">
            {tr.today.examCountdown(daysLeft)}
          </Text>
          {groups.length > 0 ? (
            <Text testID="today-total" variant="muted">
              {tr.today.summary(tr.today.duration(totalSeconds), groups.length)}
            </Text>
          ) : null}
        </View>

        {!hasSources && tasks.length === 0 ? (
          <View className="border-border gap-3 rounded-xl border p-4">
            <Text>{tr.today.noBooks}</Text>
            <Button testID="today-add-book" onPress={() => router.push('/book/add')}>
              <Text>{tr.today.addBook}</Text>
            </Button>
          </View>
        ) : null}

        {hasSources && tasks.length === 0 ? (
          <Text testID="today-empty" variant="muted">
            {restDay ? tr.today.restDay : tr.today.nothingLeft}
          </Text>
        ) : null}

        {groups.map((g) => (
          <View
            key={g.libraryItemId + g.kind}
            testID="today-task"
            className="border-border gap-1 rounded-xl border p-4">
            <Text className="font-medium">{g.title}</Text>
            <View className="flex-row justify-between gap-3">
              <Text testID="today-task-range" className="flex-1">
                {tr.today.ranges(g.kind, g.ranges)}
              </Text>
              <Text variant="muted">≈ {tr.today.duration(g.estSeconds)}</Text>
            </View>
            {g.unitCount > 1 ? <Text variant="muted">{tr.today.units(g.unitCount)}</Text> : null}
          </View>
        ))}

        {overload ? (
          <Text testID="today-overload" className="text-destructive text-sm">
            {tr.today.overload(plan?.optional.length ?? 0)}
          </Text>
        ) : null}
        {plan?.warnings.some((w) => w.code === 'unscheduled') ? (
          <Text testID="today-unscheduled" className="text-destructive text-sm">
            {tr.today.unscheduled}
          </Text>
        ) : null}

        {__DEV__ ? (
          <Button testID="reset-onboarding" variant="outline" onPress={deleteProfile}>
            <Text>{tr.today.resetDev}</Text>
          </Button>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
