import { router } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { YouTubeMark } from '@/components/youtube-mark';
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
        <Text variant="h1">{tr.library.title}</Text>
        {items.length === 0 ? <Text variant="muted">{tr.library.empty}</Text> : null}
        {items.map((item) => (
          <View
            key={item.id}
            testID={`library-item-${item.title}`}
            className="border-border gap-1 rounded-xl border p-4">
            <Text className="font-sans-semibold">{item.title}</Text>
            {item.playlist ? <YouTubeMark /> : null}
            <Text variant="muted">
              {item.playlist
                ? item.playlist.missing
                  ? tr.library.playlistMissing
                  : tr.library.playlistSummary(
                      item.total,
                      item.playlist.speed,
                      item.playlist.channelTitle,
                    )
                : tr.library.summary(
                    item.total,
                    item.kind === 'tests' ? 'tests' : 'pages',
                    item.unitCount,
                    item.minutesPerItem,
                  )}
            </Text>
            <View className="bg-muted mt-1 h-1.5 overflow-hidden rounded-full">
              <View className="bg-primary h-full" style={{ width: `${item.percentDone}%` }} />
            </View>
            <Text testID="library-percent" variant="muted">
              {tr.library.percentDone(item.percentDone)}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              className="self-start px-0"
              onPress={() => confirmRemove(item.id, item.title)}>
              <Text className="font-sans-semibold underline">{tr.library.remove}</Text>
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
