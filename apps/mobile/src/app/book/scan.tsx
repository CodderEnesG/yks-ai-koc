import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';

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
      <View className="bg-background flex-1 justify-center gap-4 p-6">
        <Text>{tr.library.scan.permission}</Text>
        <Button onPress={requestPermission}>
          <Text>{tr.library.scan.allow}</Text>
        </Button>
        <Button variant="ghost" onPress={() => router.replace('/book/search')}>
          <Text>{tr.library.scan.manual}</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
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
      <View className="absolute inset-x-0 bottom-0 gap-3 p-6 pb-12">
        <Text className="text-center text-white">{tr.library.scan.title}</Text>
        <Button variant="secondary" onPress={() => router.replace('/book/search')}>
          <Text>{tr.library.scan.manual}</Text>
        </Button>
      </View>
    </View>
  );
}
