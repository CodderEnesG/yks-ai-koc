import { Image } from 'expo-image';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

// Sahneler lamba-design prototipinden (`src/assets/cizimler`, 720 px yükseklikte webp); `mola` brand/cizimler/
// renkli'den kırpıldı (600 px). 3x ekranda 200-240 pt'ye kadar keskin.
const SCENES = {
  karsilama: require('../../assets/images/alaaddin/karsilama.webp'),
  mutlu: require('../../assets/images/alaaddin/mutlu.webp'),
  hata: require('../../assets/images/alaaddin/hata.webp'),
  dusunuyor: require('../../assets/images/alaaddin/dusunuyor.webp'),
  sakin: require('../../assets/images/alaaddin/sakin.webp'),
  'bos-plan': require('../../assets/images/alaaddin/bos-plan.webp'),
  'gun-tamam': require('../../assets/images/alaaddin/gun-tamam.webp'),
  mola: require('../../assets/images/alaaddin/mola.webp'),
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
