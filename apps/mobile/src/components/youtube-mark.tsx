import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

const YOUTUBE_ICON = require('../../assets/images/youtube-icon.svg');

/**
 * YouTube kaynak etiketi (politika III.F.2: içeriğin YouTube'dan geldiği açıkça görünür). Resmi YouTube
 * simgesi kendi renkleriyle (kırmızı), marka paletinin bilinçli istisnası. Simge yeniden renklendirilmez
 * (YouTube marka kuralı); yayından önce gerçek marka kaynaklarından piksel doğrulaması yapılacak.
 */
export function YouTubeMark() {
  return (
    <View testID="youtube-mark" className="flex-row items-center gap-1">
      <Image source={YOUTUBE_ICON} style={{ width: 20, height: 14 }} contentFit="contain" />
      <Text className="text-xs font-sans-semibold">YouTube</Text>
    </View>
  );
}
