import {
  diffDays,
  isDayComplete,
  isSafeMode,
  parseCivilDate,
  weekdayIndex,
} from '@yks/plan-engine';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Alaaddin } from '@/components/alaaddin';
import { Banner } from '@/components/banner';
import { Chip } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
import { LampGlow } from '@/components/lamp-glow';
import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { EmptyState } from '@/components/states';
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
import { cn } from '@/lib/utils';
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

  const allChecked = tasks.length > 0 && tasks.every((t) => t.status !== 'planned');
  const dayDone = isDayComplete(tasks.map((t) => ({ status: t.status, seconds: t.estSeconds })));
  const streakDays = streak?.days ?? 0;

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top']}>
      <KeyboardAwareScrollView
        contentContainerClassName="gap-5 px-5 pt-3 pb-8"
        bottomOffset={24}
        keyboardShouldPersistTaps="handled">
        {/* Başlık bloğu (lamba-design 2.1). Sağ üstte dişli: Ayarlar sekme değil (lamba kararı, 28 Ekim). */}
        <View className="gap-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text variant="h1">{tr.today.title}</Text>
              <Text variant="muted">
                {formatCivilDate(today)} · {tr.weekdays[weekdayIndex(today)]}
              </Text>
            </View>
            <Button
              testID="settings-open"
              variant="ghost"
              size="icon"
              accessibilityLabel={tr.settings.title}
              onPress={() => router.push('/settings')}>
              <Icon name={{ ios: 'gearshape', android: 'settings' }} size={22} />
            </Button>
          </View>
          <View className="gap-2.5">
            {/* Güvenli modda geri sayım küçülür ve vurgusuzdur (baskı azaltılır). */}
            <Text
              testID="today-countdown"
              accessibilityLabel={tr.today.examCountdown(daysLeft)}
              className={cn(
                'font-display tracking-tight',
                safeMode ? 'text-title-3' : 'text-title-2',
              )}>
              {tr.today.examBefore}
              <Text
                className={cn(
                  'font-display tracking-tight',
                  safeMode ? 'text-title-3' : 'text-display text-emphasis',
                )}>
                {daysLeft}
              </Text>
              {tr.today.examAfter}
            </Text>
            {streakDays > 0 || groups.length > 0 ? (
              <View className="flex-row flex-wrap items-center gap-x-3 gap-y-2">
                {streakDays > 0 ? (
                  <Chip testID="today-streak" icon={ICONS.calendar}>
                    {tr.today.streak(streakDays)}
                  </Chip>
                ) : null}
                {groups.length > 0 ? (
                  <Text testID="today-total" variant="muted">
                    {tr.today.summary(
                      tr.today.duration(totalSeconds),
                      new Set(groups.filter((g) => g.kind !== 'video').map((g) => g.libraryItemId))
                        .size,
                      groups.filter((g) => g.kind === 'video').length,
                    )}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>

        {!hasSources && tasks.length === 0 ? (
          <EmptyState
            text={tr.today.noBooks}
            action={{
              label: tr.today.addBook,
              onPress: () => router.push('/book/add'),
              testID: 'today-add-book',
            }}
          />
        ) : null}

        {hasSources && tasks.length === 0 ? (
          <View className="bg-stage overflow-hidden rounded-xl">
            <Alaaddin
              scene={restDay ? 'mola' : 'gun-tamam'}
              height={176}
              className="rounded-none pt-5"
            />
            <Text
              testID="today-empty"
              className="text-stage-foreground px-5 pt-1 pb-5 text-subhead">
              {restDay ? tr.today.restDay : tr.today.nothingLeft}
            </Text>
          </View>
        ) : null}

        {profile.consentStatus === 'pending' || profile.consentStatus === 'withdrawn' ? (
          <Banner
            kind="pending"
            action={{
              label: tr.consent.open,
              onPress: () => router.push('/account/consent'),
              testID: 'today-consent',
            }}>
            {profile.consentStatus === 'withdrawn'
              ? tr.settings.minorWithdrawn
              : tr.settings.minorPending}
          </Banner>
        ) : null}

        {/* Pazar: haftalık raporu veliye gönderme zamanı (rapor 2.12). */}
        {weekdayIndex(today) === 6 ? <ReportShare /> : null}

        {/* Hafif mod: duman yerine lambanın kararması (lamba kararı, 28 Ekim). */}
        {safeMode ? (
          <Banner
            kind="safe"
            testID="safe-mode"
            figure={<LampGlow dim size={40} className="rounded-md p-3" />}
            action={{
              label: tr.support.open,
              onPress: () => router.push('/support'),
              testID: 'safe-mode-support',
            }}>
            {tr.checkin.safeMode}
          </Banner>
        ) : null}

        {/* Gün tamam (seri kuralı, plan motoru): sahneli kart; ekranda tek Alaaddin. */}
        {dayDone ? (
          <View testID="today-day-done" className="bg-stage overflow-hidden rounded-xl">
            <Alaaddin scene="gun-tamam" height={200} className="rounded-none pt-5" />
            <View className="gap-1 px-5 pt-1 pb-5">
              <Text role="heading" className="text-stage-foreground font-display text-title-3">
                {tr.today.dayDoneTitle}
              </Text>
              <Text className="text-stage-foreground text-subhead">
                {tr.today.dayDoneBody(streakDays)}
              </Text>
            </View>
          </View>
        ) : null}

        {groups.length > 0 ? (
          <View className="gap-3">
            {dayDone ? (
              <Text className="text-footnote text-muted-foreground font-sans-semibold tracking-widest uppercase">
                {tr.today.doneHeading}
              </Text>
            ) : null}
            {groups.map((g) => (
              // Aynı listenin videoları aynı kaynak ve türü paylaşır; anahtar görev kimliklerinden.
              <TaskCard key={g.taskIds.join(',')} group={g} />
            ))}
          </View>
        ) : null}

        {allChecked ? <CountsForm day={today} /> : null}

        {/* Check-in bitti ama gün tamam değil: kutlamasız, sakin kapanış. */}
        {allChecked && !dayDone ? (
          <View
            testID="today-closed"
            className="bg-card flex-row items-center gap-3 rounded-lg p-4">
            <View className="bg-background size-9 items-center justify-center rounded-full">
              <Icon name={ICONS.moon} size={18} />
            </View>
            <Text className="text-callout font-sans-semibold flex-1">{tr.today.dayClosed}</Text>
          </View>
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
