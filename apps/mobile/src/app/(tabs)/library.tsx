import { router } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { removeLibraryItem, useLibrary } from '@/features/library/repo';
import { tr } from '@/i18n/tr';

export default function LibraryScreen() {
  const items = useLibrary();
  if (!items) return null;

  const confirmRemove = (id: string, title: string) =>
    Alert.alert(tr.library.removeConfirm(title), undefined, [
      { text: tr.library.cancel, style: 'cancel' },
      {
        text: tr.library.remove,
        style: 'destructive',
        onPress: () => removeLibraryItem(id, new Date()),
      },
    ]);

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-4 p-6">
        <Text variant="h3">{tr.library.title}</Text>
        {items.length === 0 ? <Text variant="muted">{tr.library.empty}</Text> : null}
        {items.map((item) => (
          <View
            key={item.id}
            testID={`library-item-${item.title}`}
            className="border-border gap-1 rounded-xl border p-4">
            <Text className="font-medium">{item.title}</Text>
            <Text variant="muted">
              {tr.library.summary(item.total, item.kind, item.unitCount, item.minutesPerItem)}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              className="self-start px-0"
              onPress={() => confirmRemove(item.id, item.title)}>
              <Text className="text-destructive">{tr.library.remove}</Text>
            </Button>
          </View>
        ))}
        <Button testID="library-add" onPress={() => router.push('/book/add')}>
          <Text>{tr.library.add}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
