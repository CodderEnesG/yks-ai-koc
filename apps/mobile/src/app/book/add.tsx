import { router } from 'expo-router';
import { View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { Choice } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function AddBookScreen() {
  const o = tr.library.addOptions;
  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <View className="gap-3 p-6">
        <Text variant="h3">{o.title}</Text>
        <Choice
          testID="add-scan"
          label={o.scan.label}
          description={o.scan.description}
          selected={false}
          onPress={() => router.push('/book/scan')}
        />
        <Choice
          testID="add-search"
          label={o.search.label}
          description={o.search.description}
          selected={false}
          onPress={() => router.push('/book/search')}
        />
        <Choice
          testID="add-quick"
          label={o.quick.label}
          description={o.quick.description}
          selected={false}
          onPress={() => router.push('/book/quick')}
        />
      </View>
    </SafeAreaView>
  );
}
