import type { Reason } from '@yks/plan-engine';
import { videoUrl } from '@yks/youtube';
import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { YouTubeMark } from '@/components/youtube-mark';
import { tr } from '@/i18n/tr';

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

  return (
    <View testID="today-task" className="bg-card border-border gap-2 rounded-xl border p-4">
      {isVideo ? (
        <>
          <View className="flex-row items-start gap-2">
            <StatusMark status={g.status} />
            <Text testID="video-title" className="font-sans-semibold flex-1">
              {g.video?.title ?? tr.today.videoMissing}
            </Text>
          </View>
          <Text variant="muted">
            {[g.title, g.video?.channelTitle].filter(Boolean).join(' · ')}
          </Text>
          <View className="flex-row items-center justify-between gap-3">
            {/* YouTube içeriğin kaynağı olarak açıkça gösterilir (politika III.F.2). */}
            <YouTubeMark />
            <Text variant="muted">
              {g.video
                ? tr.today.videoDuration(g.video.durationSeconds, g.estSeconds)
                : `≈ ${tr.today.duration(g.estSeconds)}`}
            </Text>
          </View>
          {g.videoKey ? (
            <Button
              testID="video-open"
              size="sm"
              variant="outline"
              onPress={() => void Linking.openURL(videoUrl(g.videoKey!))}>
              <Text>{tr.today.openYouTube}</Text>
            </Button>
          ) : null}
        </>
      ) : (
        <>
          <View className="flex-row items-start gap-2">
            <StatusMark status={g.status} />
            <Text className="font-sans-semibold flex-1">{g.title}</Text>
          </View>
          <View className="flex-row justify-between gap-3">
            <Text testID="today-task-range" className="flex-1">
              {tr.today.ranges(g.kind, g.ranges)}
            </Text>
            <Text variant="muted">≈ {tr.today.duration(g.estSeconds)}</Text>
          </View>
          {g.unitCount > 1 ? <Text variant="muted">{tr.today.units(g.unitCount)}</Text> : null}
        </>
      )}

      {g.status === 'planned' ? (
        <View className="flex-row gap-2">
          <Button
            testID="checkin-done"
            size="sm"
            className="flex-1 px-2"
            onPress={() => markTasks(g.taskIds, 'done', null, new Date())}>
            <Text>{isVideo ? tr.checkin.watched : tr.checkin.done}</Text>
          </Button>
          {g.kind !== 'video' && last > first ? (
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
        <View testID="checkin-status" className="gap-1">
          <Text className="font-sans-semibold">
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
              onPress={() => router.push('/support')}>
              <Text>{tr.support.open}</Text>
            </Button>
          ) : null}
        </View>
      )}
    </View>
  );
}
