import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

import { cn } from '@/lib/utils';

const LAMP_ICON = require('../../assets/images/lamp-glow.svg');

// Güvenli mod göstergesi (lamba kararı, 28 Ekim): duman yerine lambanın kendisinde gri-turuncu arası
// parlaklık geçişi. Aynı tek-renk simge iki kez üst üste (turuncu taban, gri katman); gri katmanın
// opaklığı animasyonla değişir, böylece lamba yanıktan soluğa doğru "kararır". Zemin her zaman `bg-stage`
// (gece moru), Alaaddin ile aynı sahne; renkler global.css'te (`lamp-lit`, `lamp-dim`).
// Geçiş yanık halden başlar, bileşen açılır açılmaz `dim`e doğru oynar (ilk karede hedef değere atlamaz).
// Sistemde hareket azaltılmışsa Reanimated geçişi atlar.
export function LampGlow({
  dim,
  size = 56,
  className,
}: {
  dim: boolean;
  size?: number;
  className?: string;
}) {
  const lit = useCSSVariable('--color-lamp-lit');
  const dimmed = useCSSVariable('--color-lamp-dim');
  const dimness = useSharedValue(0);
  useEffect(() => {
    dimness.value = withTiming(dim ? 1 : 0, { duration: 500 });
  }, [dim, dimness]);
  const dimLayerStyle = useAnimatedStyle(() => ({ opacity: dimness.value }));

  return (
    <View
      testID="lamp-glow"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn('bg-stage items-center justify-center rounded-3xl p-4', className)}>
      <View style={{ width: size, height: size }}>
        <Image
          source={LAMP_ICON}
          tintColor={typeof lit === 'string' ? lit : undefined}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
        <Animated.View style={[StyleSheet.absoluteFill, dimLayerStyle]}>
          <Image
            source={LAMP_ICON}
            tintColor={typeof dimmed === 'string' ? dimmed : undefined}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}
