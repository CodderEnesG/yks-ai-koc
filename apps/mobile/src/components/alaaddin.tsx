import { Image } from 'expo-image';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

// brand/cizimler/renkli'den kırpılıp 600 px yüksekliğe indirildi (3x ekranda 200 pt).
const SCENES = {
  karsilama: require('../../assets/images/alaaddin/karsilama.png'),
  mutlu: require('../../assets/images/alaaddin/mutlu.png'),
  hata: require('../../assets/images/alaaddin/hata.png'),
  'bos-plan': require('../../assets/images/alaaddin/bos-plan.png'),
  'gun-tamam': require('../../assets/images/alaaddin/gun-tamam.png'),
  mola: require('../../assets/images/alaaddin/mola.png'),
} as const;

export type AlaaddinScene = keyof typeof SCENES;

/**
 * Alaaddin sahnesi (marka kılavuzu): ekranda en fazla bir tane, yanında kısa bir cümle. Zemin her temada
 * gece moru `stage` (açık zemin sürümü yok; lamba-design DECISIONS.md). Süs; ekran okuyucu atlar, anlamı
 * yanındaki metin taşır.
 */
export function Alaaddin({
  scene,
  height = 200,
  className,
}: {
  scene: AlaaddinScene;
  height?: number;
  className?: string;
}) {
  return (
    <View
      testID={`alaaddin-${scene}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn('bg-stage items-center rounded-3xl py-4', className)}>
      <Image source={SCENES[scene]} style={{ height, width: '100%' }} contentFit="contain" />
    </View>
  );
}
