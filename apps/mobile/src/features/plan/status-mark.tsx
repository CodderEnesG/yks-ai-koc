import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

import type { TaskGroup } from './group';

/**
 * Görev kartı durumu şekille (lamba kararı 27 Ekim): planlı boş halka, tamamlandı dolu tik, yarım yarısı
 * dolu halka, yapılmadı kesik halka. Renge bağlı değil; Gölge modunda ve renk körlüğünde de okunur.
 */
export function StatusMark({ status }: { status: TaskGroup['status'] }) {
  const label = tr.today.statusLabel[status];
  if (status === 'done') {
    return (
      <View
        testID="status-done"
        accessibilityLabel={label}
        className="bg-foreground h-5 w-5 items-center justify-center rounded-full">
        <Text className="text-background font-sans-bold text-xs leading-none">✓</Text>
      </View>
    );
  }
  if (status === 'mixed') {
    return (
      <View
        testID="status-partial"
        accessibilityLabel={label}
        className="border-foreground h-5 w-5 flex-row overflow-hidden rounded-full border-2">
        <View className="bg-foreground h-full w-1/2" />
      </View>
    );
  }
  return (
    <View
      testID={status === 'skipped' ? 'status-skipped' : 'status-planned'}
      accessibilityLabel={label}
      className={`border-control h-5 w-5 rounded-full border-2 ${
        status === 'skipped' ? 'border-dashed' : ''
      }`}
    />
  );
}
