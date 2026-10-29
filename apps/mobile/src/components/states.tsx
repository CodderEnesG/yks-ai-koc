import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Alaaddin, type AlaaddinScene } from '@/components/alaaddin';
import { ICONS, Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

// Boş, hata, yükleniyor ve kilitli durumları (lamba-design SCREENS 8; prototip `ds/primitives.tsx`).
// Suçlamaz, bilgilendirir; en fazla tek eylem. Sahneler süs, anlamı metin taşır.

type Action = { label: string; onPress: () => void; testID?: string };

export function EmptyState({
  scene = 'bos-plan',
  title,
  text,
  action,
  testID,
}: {
  scene?: AlaaddinScene;
  title?: string;
  text: string;
  action?: Action;
  testID?: string;
}) {
  return (
    <View testID={testID} className="border-border bg-card overflow-hidden rounded-xl border">
      <Alaaddin scene={scene} height={176} className="rounded-none pt-5" />
      <View className="gap-4 p-5">
        <View className="gap-1.5">
          {title ? (
            <Text role="heading" className="font-display text-title-3">
              {title}
            </Text>
          ) : null}
          <Text className="text-body">{text}</Text>
        </View>
        {action ? (
          <Button testID={action.testID} size="lg" onPress={action.onPress}>
            <Text>{action.label}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}

export function ErrorState({
  title,
  text,
  onRetry,
  testID,
}: {
  title: string;
  text: string;
  onRetry?: () => void;
  testID?: string;
}) {
  return (
    <View testID={testID} className="bg-card items-center gap-4 rounded-xl p-5">
      <Alaaddin scene="hata" height={136} className="w-full pt-4" />
      <View className="items-center gap-1.5">
        <Text role="heading" className="font-display text-title-3 text-center">
          {title}
        </Text>
        <Text className="text-subhead text-muted-foreground text-center">{text}</Text>
      </View>
      {onRetry ? (
        <Button variant="outline" className="w-full" onPress={onRetry}>
          <Text>{tr.common.retry}</Text>
        </Button>
      ) : null}
    </View>
  );
}

/** Alaaddin "düşünüyor" ve sırayla soluklaşan üç nokta; sistemde hareket azaltılmışsa noktalar durur. */
export function Loading({ text, testID }: { text: string; testID?: string }) {
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={text}
      accessibilityState={{ busy: true }}
      className="bg-card flex-row items-center gap-4 rounded-xl p-3 pr-5">
      <Alaaddin scene="dusunuyor" height={96} className="w-20 rounded-md py-2" />
      <View className="flex-1 gap-2">
        <Text className="text-callout font-sans-semibold">{text}</Text>
        <View className="flex-row gap-1.5">
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </View>
      </View>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.3, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        false,
        undefined,
        ReduceMotion.System,
      ),
    );
  }, [delay, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style} className="bg-foreground size-2 rounded-full" />;
}

export function LockedState({
  text,
  action,
  primary,
  testID,
}: {
  text: string;
  action?: Action;
  primary?: boolean;
  testID?: string;
}) {
  return (
    <View testID={testID} className="border-border bg-card items-start gap-4 rounded-lg border p-5">
      <View className="bg-background size-11 items-center justify-center rounded-full">
        <Icon name={ICONS.lock} size={20} />
      </View>
      <Text className="text-body">{text}</Text>
      {action ? (
        <Button
          testID={action.testID}
          variant={primary ? 'default' : 'outline'}
          size={primary ? 'lg' : 'default'}
          className={primary ? 'w-full' : undefined}
          onPress={action.onPress}>
          <Text>{action.label}</Text>
        </Button>
      ) : null}
    </View>
  );
}
