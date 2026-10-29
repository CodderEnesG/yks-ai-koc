import { Image } from 'expo-image';
import { useColorScheme } from 'react-native';

const LOGO = {
  light: require('../../assets/images/youtube-logo-acik-zemin.svg'),
  dark: require('../../assets/images/youtube-logo-koyu-zemin.svg'),
} as const;

/**
 * YouTube kaynak etiketi (politika III.F.2: içeriğin YouTube'dan geldiği açıkça görünür). Resmi YouTube
 * logosu kendi renkleriyle, marka paletinin bilinçli istisnası (lamba kararı 27 Ekim). Dosyalar lamba-design
 * prototipinden, değiştirilmeden (açık zeminde koyu, koyu zeminde beyaz yazılı sürüm); yeniden
 * renklendirilmez, oranı korunur. Kaynağın YouTube marka sayfası olduğu yayından önce teyit edilecek.
 */
export function YouTubeMark() {
  const scheme = useColorScheme();
  return (
    <Image
      testID="youtube-mark"
      accessible
      accessibilityRole="image"
      accessibilityLabel="YouTube"
      source={scheme === 'dark' ? LOGO.dark : LOGO.light}
      style={{ height: 20, aspectRatio: 492 / 110 }}
      contentFit="contain"
    />
  );
}
