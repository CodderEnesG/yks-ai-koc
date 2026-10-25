import type { Reason } from '@yks/plan-engine';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

import { markTasks } from './checkin';
import type { TaskGroup } from './group';

/** Bugünün bir kitabı: aralık, süre ve check-in (yaptım / yarım kaldı / yapamadım). */
export function TaskCard({ group: g }: { group: TaskGroup }) {
  const ids = g.taskIds.join(',');
  const first = g.ranges[0]!.first;
  const last = g.ranges.at(-1)!.last;
  const reason = g.reasons[0] as Reason | undefined;

  return (
    <View testID="today-task" className="border-border gap-2 rounded-xl border p-4">
      <Text className="font-medium">{g.title}</Text>
      <View className="flex-row justify-between gap-3">
        <Text testID="today-task-range" className="flex-1">
          {tr.today.ranges(g.kind, g.ranges)}
        </Text>
        <Text variant="muted">≈ {tr.today.duration(g.estSeconds)}</Text>
      </View>
      {g.unitCount > 1 ? <Text variant="muted">{tr.today.units(g.unitCount)}</Text> : null}

      {g.status === 'planned' ? (
        <View className="flex-row gap-2">
          <Button
            testID="checkin-done"
            size="sm"
            className="flex-1"
            onPress={() => markTasks(g.taskIds, 'done', null, new Date())}>
            <Text>{tr.checkin.done}</Text>
          </Button>
          {g.kind !== 'video' && last > first ? (
            <Button
              testID="checkin-partial"
              size="sm"
              variant="outline"
              className="flex-1"
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
            className="flex-1"
            onPress={() => router.push({ pathname: '/checkin/reason', params: { ids } })}>
            <Text>{tr.checkin.skip}</Text>
          </Button>
        </View>
      ) : (
        <View testID="checkin-status" className="gap-1">
          <Text className="font-medium">
            {g.status === 'done'
              ? tr.checkin.statusDone
              : g.status === 'skipped'
                ? `${tr.checkin.statusSkipped}${reason ? ` · ${tr.checkin.reasons[reason]}` : ''}`
                : `${tr.checkin.statusPartial(tr.today.ranges(g.kind, g.doneRanges))}${reason ? ` · ${tr.checkin.reasons[reason]}` : ''}`}
          </Text>
          {reason ? <Text variant="muted">{tr.checkin.effects[reason]}</Text> : null}
        </View>
      )}
    </View>
  );
}
