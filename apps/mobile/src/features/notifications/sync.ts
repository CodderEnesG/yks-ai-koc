import type { CivilDate, PlanResult } from '@yks/plan-engine';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { tr } from '@/i18n/tr';

import { buildSchedule } from './schedule';

const CHANNEL_ID = 'plan';

// Uygulama açıkken gelen bildirim de banner olarak görünsün.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** İzin yoksa ister (Android 13+ için önce kanal gerekir). İzin verilmediyse false. */
export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: tr.notifications.channel,
      importance: AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Önümüzdeki 7 günün bildirimlerini plana göre baştan kurar. */
export async function syncNotifications(args: {
  today: CivilDate;
  plan: PlanResult;
  checkedInToday: boolean;
}): Promise<number> {
  if (!(await ensurePermission())) return 0;
  const loads = args.plan.days.map((d) => ({
    date: d.date,
    seconds: d.seconds,
    books: new Set(d.tasks.map((t) => t.sourceId)).size,
  }));
  const schedule = buildSchedule({
    today: args.today,
    now: Date.now(),
    loads,
    checkedInToday: args.checkedInToday,
  });

  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const n of schedule) {
    const content =
      n.kind === 'morning'
        ? {
            title: tr.notifications.morningTitle,
            body: tr.notifications.morningBody(tr.today.duration(n.seconds), n.books),
          }
        : n.kind === 'evening'
          ? { title: tr.notifications.eveningTitle, body: tr.notifications.eveningBody }
          : { title: tr.notifications.lateTitle, body: tr.notifications.lateBody };
    await Notifications.scheduleNotificationAsync({
      identifier: n.id,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: n.at,
        channelId: CHANNEL_ID,
      },
    });
  }
  return schedule.length;
}
