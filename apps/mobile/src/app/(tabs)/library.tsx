import { router } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import { ProgressBar } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { EmptyState } from '@/components/states';
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

  const add = () => router.push('/book/add');

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top']}>
      <ScrollView contentContainerClassName="gap-5 px-5 pt-3 pb-8">
        <Text variant="h1">{tr.library.title}</Text>
        {items.length === 0 ? (
          <EmptyState
            text={tr.library.empty}
            action={{ label: tr.library.add, onPress: add, testID: 'library-add' }}
          />
        ) : (
          <>
            <View className="gap-3">
              {items.map((item) => (
                <View
                  key={item.id}
                  testID={`library-item-${item.title}`}
                  className="border-border bg-card gap-3 rounded-lg border p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-0.5">
                      <Text className="font-sans-bold">{item.title}</Text>
                      <Text variant="muted">
                        {item.playlist
                          ? tr.library.playlistSummary(
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
                    </View>
                    {item.playlist ? <YouTubeMark /> : null}
                  </View>
                  {item.playlist?.missing ? (
                    <View className="flex-row items-start gap-2">
                      <Icon name={ICONS.refresh} size={16} />
                      <Text className="text-subhead flex-1">{tr.library.playlistMissing}</Text>
                    </View>
                  ) : null}
                  <ProgressBar
                    value={item.percentDone}
                    label={tr.library.progressLabel(item.title)}
                  />
                  <View className="-my-1.5 flex-row items-center justify-between gap-3">
                    <Text testID="library-percent" variant="muted">
                      {tr.library.percentDone(item.percentDone)}
                    </Text>
                    {/* Kaldırma geri alınamaz: sistem onayıyla; renk değil ikon ve metin. */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-2"
                      accessibilityLabel={`${item.title}, ${tr.library.remove}`}
                      onPress={() => confirmRemove(item.id, item.title)}>
                      <Icon name={ICONS.close} size={14} />
                      <Text className="underline">{tr.library.remove}</Text>
                    </Button>
                  </View>
                </View>
              ))}
            </View>
            <Button testID="library-add" size="lg" onPress={add}>
              <Icon name={ICONS.plus} size={18} tone="primary-foreground" />
              <Text>{tr.library.add}</Text>
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
