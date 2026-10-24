import { View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

// Kütüphane ekranı T10'da.
export default function LibraryScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 gap-4 p-6">
        <Text variant="h3">{tr.library.title}</Text>
        <Text variant="muted">{tr.library.empty}</Text>
      </View>
    </SafeAreaView>
  );
}
