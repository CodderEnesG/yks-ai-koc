import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

const LAMP_ICON = require('../../assets/images/lamp-glow.svg');

// Güvenli mod göstergesi (lamba kararı, 28 Ekim): duman yerine lambanın kendisinde gri-turuncu arası
// parlaklık geçişi. Aynı tek-renk simge iki kez üst üste (turuncu taban, gri katman); gri katmanın
// opaklığı animasyonla değişir, böylece lamba yanıktan soluğa doğru "kararır". Zemin her zaman `bg-stage`
// (gece moru), Alaaddin ile aynı sahne (global.css).
const LIT = '#FF9F43';
const DIM = '#BDB2CF';

export function LampGlow({
  dim,
  size = 56,
  className,
}: {
  dim: boolean;
  size?: number;
  className?: string;
}) {
  const dimLayerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(dim ? 1 : 0, { duration: 500 }),
  }));

  return (
    <View
      testID="lamp-glow"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn('bg-stage items-center justify-center rounded-3xl p-4', className)}>
      <View style={{ width: size, height: size }}>
        <Image
          source={LAMP_ICON}
          tintColor={LIT}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
        <Animated.View style={[StyleSheet.absoluteFill, dimLayerStyle]}>
          <Image
            source={LAMP_ICON}
            tintColor={DIM}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}
