import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Hata ve uyarı (lamba kararı 27 Ekim): kırmızı yok; çarpı işareti ve metinle, ana metin renginde.
 * Bilgi yalnız renkle verilmez, Gölge modunda ve renk körlüğünde de okunur.
 */
export function ErrorText({
  children,
  className,
  testID,
}: {
  children: ReactNode;
  className?: string;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      className={cn('flex-row items-start gap-1.5', className)}>
      <Text className="font-sans-bold text-subhead" accessibilityElementsHidden>
        ✕
      </Text>
      <Text className="text-subhead font-sans-semibold flex-1">{children}</Text>
    </View>
  );
}
