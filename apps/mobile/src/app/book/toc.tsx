import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ICONS, Icon } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { Loading, LockedState } from '@/components/states';
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
      <View className="flex-1 gap-4 px-5 pt-3">
        <Text variant="h2">{t.title}</Text>
        <Text variant="muted">{t.body}</Text>
        {blocked ? (
          <LockedState
            testID="toc-blocked"
            text={blocked}
            action={
              !session && canSync(profile.consentStatus)
                ? { label: tr.settings.connect, onPress: () => router.push('/account/sign-in') }
                : undefined
            }
          />
        ) : busy ? (
          <Loading testID="toc-reading" text={t.reading} />
        ) : (
          <View className="gap-3">
            <Button testID="toc-camera" size="lg" onPress={() => void run('camera')}>
              <Icon name={ICONS.camera} size={18} tone="primary-foreground" />
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
