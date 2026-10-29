import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';

import { ICONS, Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { normalizeIsbn } from '@/features/library/rules';
import { tr } from '@/i18n/tr';

// Barkod okuma (expo-camera). Görüntü kaydedilmez; yalnız ISBN okunup arama ekranına geçilir.
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View className="bg-background flex-1 justify-center gap-6 px-5">
        <View className="bg-card size-14 items-center justify-center rounded-full">
          <Icon name={ICONS.barcode} size={26} />
        </View>
        <Text className="text-body-lg">{tr.library.scan.permission}</Text>
        <View className="gap-2">
          <Button size="lg" onPress={requestPermission}>
            <Text>{tr.library.scan.allow}</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.replace('/book/search')}>
            <Text>{tr.library.scan.manual}</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-stage flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={({ data }) => {
          const isbn = normalizeIsbn(data);
          if (!isbn || handled.current) return;
          handled.current = true;
          router.replace({ pathname: '/book/search', params: { q: isbn, via: 'barkod' } });
        }}
      />
      {/* Hedef çerçeve: ISBN barkodu yatay ve geniş; tarama kameranın tamamında yapılır, çerçeve yol gösterir. */}
      <View
        pointerEvents="none"
        className="absolute inset-0 items-center justify-center"
        accessibilityElementsHidden>
        <View
          testID="scan-frame"
          className="border-stage-foreground h-40 w-72 rounded-lg border-2"
        />
      </View>
      <View className="absolute inset-x-0 bottom-0 gap-3 p-6 pb-12">
        <Text className="text-stage-foreground text-center">{tr.library.scan.title}</Text>
        <Button variant="secondary" onPress={() => router.replace('/book/search')}>
          <Text>{tr.library.scan.manual}</Text>
        </Button>
      </View>
    </View>
  );
}
