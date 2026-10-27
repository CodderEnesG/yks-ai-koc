import { Text } from '@/components/ui/text';

/**
 * YouTube kaynak etiketi (politika III.F.2: içeriğin YouTube'dan geldiği açıkça görünür). Kırmızı, marka
 * paletinin bilinçli istisnası: YouTube'un kendi rengi. Yayından önce resmi YouTube logosuyla değişir.
 */
export function YouTubeMark() {
  return (
    <Text testID="youtube-mark" className="text-xs font-sans-semibold text-[#FF0000]">
      ▶ YouTube
    </Text>
  );
}
