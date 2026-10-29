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
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        className="bg-foreground mt-px size-6 items-center justify-center rounded-full">
        <Text className="text-background font-sans-bold text-footnote">✓</Text>
      </View>
    );
  }
  if (status === 'mixed') {
    return (
      <View
        testID="status-partial"
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        className="border-foreground mt-px size-6 flex-row overflow-hidden rounded-full border-2">
        <View className="bg-foreground h-full w-1/2" />
      </View>
    );
  }
  return (
    <View
      testID={status === 'skipped' ? 'status-skipped' : 'status-planned'}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      className={`mt-px size-6 rounded-full border-2 ${
        status === 'skipped' ? 'border-foreground border-dashed' : 'border-control'
      }`}
    />
  );
}
