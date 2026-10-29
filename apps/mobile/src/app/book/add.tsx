import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { NavCard } from '@/components/fields';
import { ICONS } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';

// Kaynak ekleme yolu seçimi (lamba-design 3.1): seçim kartı değil gezinme kartı; dokununca açar.
export default function AddBookScreen() {
  const o = tr.library.addOptions;
  const options = [
    { id: 'add-scan', icon: ICONS.barcode, item: o.scan, path: '/book/scan' },
    { id: 'add-search', icon: ICONS.search, item: o.search, path: '/book/search' },
    { id: 'add-toc', icon: ICONS.camera, item: o.toc, path: '/book/toc' },
    { id: 'add-quick', icon: ICONS.edit, item: o.quick, path: '/book/quick' },
    { id: 'add-youtube', icon: ICONS.play, item: o.youtube, path: '/book/youtube' },
  ] as const;
  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-3 px-5 pt-3 pb-8">
        <Text variant="h2" className="mb-2">
          {o.title}
        </Text>
        {options.map((x) => (
          <NavCard
            key={x.id}
            testID={x.id}
            icon={x.icon}
            title={x.item.label}
            description={x.item.description}
            onPress={() => router.push(x.path)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
