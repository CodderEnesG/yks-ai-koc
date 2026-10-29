import type { Reason } from '@yks/plan-engine';
import { videoUrl } from '@yks/youtube';
import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { ICONS, Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { YouTubeMark } from '@/components/youtube-mark';
import { tr } from '@/i18n/tr';
import { cn } from '@/lib/utils';

import { markTasks } from './checkin';
import type { TaskGroup } from './group';
import { StatusMark } from './status-mark';

/**
 * Bugünün bir kitabı (aralık, süre) ya da bir videosu (T33: başlık, kanal, YouTube etiketi, "YouTube'da
 * aç"; oynatıcı yok, izleme verisi toplanmaz) ve check-in (yaptım / yarım kaldı / yapamadım).
 */
export function TaskCard({ group: g }: { group: TaskGroup }) {
  const ids = g.taskIds.join(',');
  const first = g.ranges[0]!.first;
  const last = g.ranges.at(-1)!.last;
  const reason = g.reasons[0] as Reason | undefined;
  const isVideo = g.kind === 'video';
  const multi = !isVideo && last > first;

  return (
    <View
      testID="today-task"
      className={cn(
        'border-border flex-row gap-3 rounded-lg border p-4',
        g.status === 'done' ? 'bg-background' : 'bg-card',
      )}>
      <StatusMark status={g.status} />
      <View className="flex-1 gap-3">
        <View className="gap-1">
          {isVideo ? (
            <>
              <Text testID="video-title" className="font-sans-bold">
                {g.video?.title ?? tr.today.videoMissing}
              </Text>
              <Text variant="muted">
                {[g.title, g.video?.channelTitle].filter(Boolean).join(' · ')}
              </Text>
            </>
          ) : (
            <Text className="font-sans-bold">{g.title}</Text>
          )}
          <View className="flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1">
            {isVideo ? (
              // YouTube içeriğin kaynağı olarak açıkça gösterilir (politika III.F.2).
              <YouTubeMark />
            ) : (
              <Text testID="today-task-range" className="text-callout font-sans-semibold">
                {tr.today.ranges(g.kind, g.ranges)}
              </Text>
            )}
            <Text variant="muted">
              {isVideo && g.video
                ? tr.today.videoDuration(g.video.durationSeconds, g.estSeconds)
                : `≈ ${tr.today.duration(g.estSeconds)}`}
            </Text>
          </View>
          {g.unitCount > 1 ? <Text variant="muted">{tr.today.units(g.unitCount)}</Text> : null}
        </View>

        {isVideo && g.videoKey && g.status === 'planned' ? (
          <Button
            testID="video-open"
            size="sm"
            variant="outline"
            className="self-start"
            onPress={() => void Linking.openURL(videoUrl(g.videoKey!))}>
            <Text>{tr.today.openYouTube}</Text>
            <Icon name={ICONS.external} size={16} />
          </Button>
        ) : null}

        {g.status === 'planned' ? (
          <View className="border-border flex-row gap-2 border-t pt-3">
            {/* "Yaptım" her kartta tekrar eder: turuncu değil, ön plan dolgusu (tonal). */}
            <Button
              testID="checkin-done"
              size="sm"
              variant="tonal"
              className="flex-1 px-2"
              onPress={() => markTasks(g.taskIds, 'done', null, new Date())}>
              <Text>{isVideo ? tr.checkin.watched : tr.checkin.done}</Text>
            </Button>
            {multi ? (
              <Button
                testID="checkin-partial"
                size="sm"
                variant="outline"
                className="flex-1 px-2"
                onPress={() =>
                  router.push({
                    pathname: '/checkin/partial',
                    params: { ids, first: String(first), last: String(last), kind: g.kind },
                  })
                }>
                <Text>{tr.checkin.partial}</Text>
              </Button>
            ) : null}
            <Button
              testID="checkin-skip"
              size="sm"
              variant="outline"
              className="flex-1 px-2"
              onPress={() => router.push({ pathname: '/checkin/reason', params: { ids } })}>
              <Text>{isVideo ? tr.checkin.notWatched : tr.checkin.skip}</Text>
            </Button>
          </View>
        ) : (
          <View testID="checkin-status" className="border-border items-start gap-1.5 border-t pt-3">
            <Text className="text-callout font-sans-bold">
              {g.status === 'done'
                ? isVideo
                  ? tr.checkin.statusWatched
                  : tr.checkin.statusDone
                : g.status === 'skipped'
                  ? `${tr.checkin.statusSkipped}${reason ? ` · ${tr.checkin.reasons[reason]}` : ''}`
                  : `${tr.checkin.statusPartial(tr.today.ranges(g.kind, g.doneRanges))}${reason ? ` · ${tr.checkin.reasons[reason]}` : ''}`}
            </Text>
            {reason ? <Text variant="muted">{tr.checkin.effects[reason]}</Text> : null}
            {reason === 'kotu_hissediyorum' ? (
              <Button
                testID="checkin-support"
                size="sm"
                variant="outline"
                className="mt-1.5"
                onPress={() => router.push('/support')}>
                <Icon name={ICONS.support} size={16} />
                <Text>{tr.support.open}</Text>
              </Button>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}
