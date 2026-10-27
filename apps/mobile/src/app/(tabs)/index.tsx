import { diffDays, isSafeMode, parseCivilDate, weekdayIndex } from '@yks/plan-engine';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { trackPlanCreatedOnce } from '@/features/analytics/analytics';
import { loadReasonEvents } from '@/features/plan/checkin';
import { CountsForm } from '@/features/plan/counts-form';
import { groupTasks } from '@/features/plan/group';
import {
  computePlan,
  refreshToday,
  useLibraryVersion,
  useStreak,
  useTodayTasks,
} from '@/features/plan/repo';
import { syncNotifications } from '@/features/notifications/sync';
import { useSafetyDays } from '@/features/safety/safe-mode';
import { useMorningTime } from '@/features/settings/prefs';
import { TaskCard } from '@/features/plan/task-card';
import { deleteProfile, useProfile } from '@/features/profile/repo';
import { ReportShare } from '@/features/report/report-share';
import { tr } from '@/i18n/tr';
import { formatCivilDate } from '@/lib/date';
import { useToday } from '@/lib/use-today';

// Bugün ekranı (T13): plan motorunun bugünkü görevleri. Check-in ve neden seçimi T14'te.
export default function TodayScreen() {
  const profile = useProfile();
  const today = useToday();
  const version = useLibraryVersion();
  const tasks = useTodayTasks(today);
  const streak = useStreak(today);
  // Uyarılar için plan; `version` SQLite girdilerinin imzası, değişince yeniden hesaplanır.
  const plan = useMemo(() => (version === undefined ? null : computePlan(today)), [today, version]);

  // Bugünün görevlerini cihaza yaz (check-in başladıysa dokunulmaz).
  useEffect(() => {
    if (version !== undefined) refreshToday(today, new Date());
  }, [today, version]);

  // Önümüzdeki 7 günün bildirimleri: plan ya da bugünün check-in durumu değişince yeniden kurulur.
  const checkedInToday =
    tasks !== undefined && tasks.length > 0 && tasks.every((t) => t.status !== 'planned');
  const hasPlan = plan !== null && plan.days.some((d) => d.tasks.length > 0);
  const morning = useMorningTime();
  const [scheduled, setScheduled] = useState<number | null>(null);
  useEffect(() => {
    if (plan && hasPlan) void syncNotifications({ today, plan, checkedInToday }).then(setScheduled);
  }, [today, plan, hasPlan, checkedInToday, morning]);

  useEffect(() => {
    if (hasPlan) trackPlanCreatedOnce();
  }, [hasPlan]);

  // Güvenli mod bandı: "kötü hissediyorum" sonrası ya da risk sinyalinden (Destek ekranı, sohbet) 3 gün.
  // Görevler değişince yeniden okunur.
  const safetyDays = useSafetyDays();
  const safeMode = useMemo(
    () => (tasks && safetyDays ? isSafeMode(loadReasonEvents(), today, safetyDays) : false),
    [tasks, today, safetyDays],
  );

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
      <KeyboardAwareScrollView
        contentContainerStyle={{ gap: 16, padding: 24 }}
        bottomOffset={24}
        keyboardShouldPersistTaps="handled">
        <View className="gap-1">
          <Text variant="h3">{tr.today.title}</Text>
          <Text variant="muted">
            {formatCivilDate(today)} · {tr.weekdays[weekdayIndex(today)]}
          </Text>
          <Text testID="today-countdown" variant="large">
            {tr.today.examCountdown(daysLeft)}
          </Text>
          {streak && streak.days > 0 ? (
            <Text testID="today-streak" className="font-sans-semibold">
              {tr.today.streak(streak.days)}
            </Text>
          ) : null}
          {groups.length > 0 ? (
            <Text testID="today-total" variant="muted">
              {tr.today.summary(
                tr.today.duration(totalSeconds),
                new Set(groups.filter((g) => g.kind !== 'video').map((g) => g.libraryItemId)).size,
                groups.filter((g) => g.kind === 'video').length,
              )}
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

        {profile.consentStatus === 'pending' || profile.consentStatus === 'withdrawn' ? (
          <View className="bg-secondary gap-2 rounded-xl p-3">
            <Text variant="muted">
              {profile.consentStatus === 'withdrawn'
                ? tr.settings.minorWithdrawn
                : tr.settings.minorPending}
            </Text>
            <Button
              testID="today-consent"
              size="sm"
              variant="outline"
              onPress={() => router.push('/account/consent')}>
              <Text>{tr.consent.open}</Text>
            </Button>
          </View>
        ) : null}

        {/* Pazar: haftalık raporu veliye gönderme zamanı (rapor 2.12). */}
        {weekdayIndex(today) === 6 ? <ReportShare /> : null}

        {safeMode ? (
          <View className="bg-secondary gap-2 rounded-xl p-3">
            <Text testID="safe-mode">{tr.checkin.safeMode}</Text>
            <Button
              testID="safe-mode-support"
              size="sm"
              variant="outline"
              onPress={() => router.push('/support')}>
              <Text>{tr.support.open}</Text>
            </Button>
          </View>
        ) : null}

        {groups.map((g) => (
          <TaskCard key={g.libraryItemId + g.kind} group={g} />
        ))}

        {groups.length > 0 && groups.every((g) => g.status !== 'planned') ? (
          <CountsForm day={today} />
        ) : null}

        {overload ? (
          <ErrorText testID="today-overload">
            {tr.today.overload(plan?.optional.length ?? 0)}
          </ErrorText>
        ) : null}
        {plan?.warnings.some((w) => w.code === 'unscheduled') ? (
          <ErrorText testID="today-unscheduled">{tr.today.unscheduled}</ErrorText>
        ) : null}

        {__DEV__ && scheduled !== null ? (
          <Text testID="dev-scheduled" variant="muted">{`Kurulu bildirim: ${scheduled}`}</Text>
        ) : null}
        {__DEV__ ? (
          <Button testID="reset-onboarding" variant="outline" onPress={deleteProfile}>
            <Text>{tr.today.resetDev}</Text>
          </Button>
        ) : null}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
