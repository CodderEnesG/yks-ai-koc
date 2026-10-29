import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Alaaddin, type AlaaddinScene } from '@/components/alaaddin';
import { ICONS, Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Bilgi bandı (lamba-design SCREENS 8): `info` genel bilgi, `safe` hafif mod, `pending` veli onayı bekleniyor.
 * Renkle değil ikon ve metinle ayrılır; en fazla bir eylem. `figure` verilirse ikon yerine küçük bir sahne
 * (ekranda en fazla bir Alaaddin kuralı çağıranda).
 */
export function Banner({
  kind,
  children,
  action,
  figure,
  testID,
}: {
  kind: 'info' | 'safe' | 'pending';
  children: ReactNode;
  action?: { label: string; onPress: () => void; testID?: string };
  figure?: ReactNode | AlaaddinScene;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      className={cn(
        'bg-card flex-row gap-3',
        kind === 'safe' ? 'rounded-xl p-3 pr-4' : 'border-border rounded-lg border p-4',
      )}>
      {figure === undefined ? (
        <View className="bg-background size-9 items-center justify-center rounded-full">
          <Icon name={ICONS[kind]} size={18} />
        </View>
      ) : typeof figure === 'string' ? (
        <Alaaddin scene={figure as AlaaddinScene} height={96} className="w-20 rounded-md py-2" />
      ) : (
        figure
      )}
      <View className="flex-1 items-start justify-center gap-3">
        <Text
          className={cn(kind === 'safe' ? 'text-callout' : 'text-subhead text-muted-foreground')}>
          {children}
        </Text>
        {action ? (
          <Button testID={action.testID} variant="outline" size="sm" onPress={action.onPress}>
            <Text>{action.label}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
