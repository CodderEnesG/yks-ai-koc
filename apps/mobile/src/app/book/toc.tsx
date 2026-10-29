import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { extractToc, pickTocImage, TocFailure, useTocDraft } from '@/features/library/toc';
import { useProfile } from '@/features/profile/repo';
import { useSession } from '@/features/sync/auth';
import { canSync } from '@/features/sync/mapping';
import { tr } from '@/i18n/tr';

// Fotoğraf yükleme yalnız hesabı bağlı ve onayı olan öğrencide (rapor 2.11: onaydan önce kapalı).
export default function TocScreen() {
  const t = tr.library.toc;
  const profile = useProfile();
  const session = useSession();
  const setDraft = useTocDraft((s) => s.set);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!profile || session === undefined) return null;

  const blocked = !canSync(profile.consentStatus) ? t.minor : !session ? t.needAccount : null;

  const run = async (source: 'camera' | 'library') => {
    setError(null);
    try {
      const image = await pickTocImage(source);
      if (!image) return;
      setBusy(true);
      setDraft(await extractToc(image));
      router.replace('/book/toc-review');
    } catch (e) {
      setError(t.errors[e instanceof TocFailure ? e.code : 'network']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <View className="flex-1 gap-4 p-6">
        <Text variant="h2">{t.title}</Text>
        <Text variant="muted">{t.body}</Text>
        {blocked ? (
          <>
            <Text testID="toc-blocked">{blocked}</Text>
            {!session && canSync(profile.consentStatus) ? (
              <Button variant="outline" onPress={() => router.push('/account/sign-in')}>
                <Text>{tr.settings.connect}</Text>
              </Button>
            ) : null}
          </>
        ) : busy ? (
          <View className="items-center gap-3 py-8">
            <ActivityIndicator />
            <Text testID="toc-reading">{t.reading}</Text>
          </View>
        ) : (
          <View className="gap-3">
            <Button testID="toc-camera" onPress={() => void run('camera')}>
              <Text>{t.camera}</Text>
            </Button>
            <Button testID="toc-library" variant="outline" onPress={() => void run('library')}>
              <Text>{t.library}</Text>
            </Button>
          </View>
        )}
        {error ? <ErrorText>{error}</ErrorText> : null}
      </View>
    </SafeAreaView>
  );
}
