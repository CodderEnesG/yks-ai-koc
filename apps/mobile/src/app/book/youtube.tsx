import { DEFAULT_NOTE_RATIO, DEFAULT_WATCH_SPEED, WATCH_SPEEDS } from '@yks/plan-engine';
import { parsePlaylistId } from '@yks/youtube';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { YouTubeMark } from '@/components/youtube-mark';
import { track } from '@/features/analytics/analytics';
import {
  addPlaylist,
  type ImportedPlaylist,
  importPlaylist,
  YouTubeImportError,
} from '@/features/library/youtube';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { useProfile } from '@/features/profile/repo';
import { useSession } from '@/features/sync/auth';
import { canSync } from '@/features/sync/mapping';
import { tr } from '@/i18n/tr';

const NOTE_CHOICES = [0, DEFAULT_NOTE_RATIO, 0.5] as const;

// YouTube oynatma listesi ekleme (T31). Liste sunucudan (`youtube-import`) gelir; hesap ve onay gerekir.
export default function YouTubeScreen() {
  const y = tr.library.youtube;
  const profile = useProfile();
  const session = useSession();
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportedPlaylist | null>(null);
  const [speed, setSpeed] = useState<number>(DEFAULT_WATCH_SPEED);
  const [note, setNote] = useState<number>(DEFAULT_NOTE_RATIO);
  if (!profile || session === undefined) return null;

  if (!canSync(profile.consentStatus) || !session) {
    const consent = !canSync(profile.consentStatus);
    return (
      <StepScreen
        title={y.title}
        continueLabel={consent ? tr.consent.open : tr.settings.connect}
        canContinue
        onContinue={() => router.push(consent ? '/account/consent' : '/account/sign-in')}>
        <Text testID="youtube-locked">{consent ? y.needConsent : y.needAccount}</Text>
      </StepScreen>
    );
  }

  const fetchList = async () => {
    setBusy(true);
    setError(null);
    try {
      setResult(await importPlaylist(link.trim()));
    } catch (e) {
      setError(y.errors[e instanceof YouTubeImportError ? e.code : 'network']);
    } finally {
      setBusy(false);
    }
  };

  const totalSeconds = result?.videos.reduce((a, v) => a + v.durationSeconds, 0) ?? 0;
  return (
    <StepScreen
      title={y.title}
      subtitle={y.subtitle}
      continueLabel={result ? y.add : y.fetch}
      canContinue={!busy && (result !== null || parsePlaylistId(link) !== null)}
      onContinue={() => {
        if (!result) {
          void fetchList();
          return;
        }
        addPlaylist(result, speed, note, new Date());
        track('kitap_eklendi', { yontem: 'youtube' });
        router.dismissTo('/library');
      }}>
      <View className="gap-2">
        <Text className="font-medium">{y.linkLabel}</Text>
        <TextInput
          testID="youtube-link"
          value={link}
          onChangeText={(v) => {
            setLink(v);
            setResult(null);
          }}
          placeholder={y.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          className="border-input text-foreground rounded-xl border px-4 py-3 text-base"
          placeholderTextColorClassName="accent-muted-foreground"
        />
      </View>
      {busy ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator />
          <Text variant="muted">{y.fetching}</Text>
        </View>
      ) : null}
      {error ? (
        <Text testID="youtube-error" className="text-destructive text-sm">
          {error}
        </Text>
      ) : null}

      {result ? (
        <>
          <View testID="youtube-preview" className="border-border gap-1 rounded-xl border p-4">
            <Text className="font-medium">{result.playlist.title}</Text>
            <Text variant="muted">{result.playlist.channelTitle}</Text>
            <Text>{y.preview(result.videos.length, tr.today.duration(totalSeconds))}</Text>
            <YouTubeMark />
            {result.videos.some((v) => v.madeForKids) ? (
              <Text variant="muted">{y.kidsNote}</Text>
            ) : null}
          </View>
          <View className="gap-2">
            <Text className="font-medium">{y.speedLabel}</Text>
            <View className="flex-row gap-2">
              {WATCH_SPEEDS.map((s) => (
                <Choice
                  key={s}
                  testID={`youtube-speed-${s}`}
                  label={`${s.toLocaleString('tr-TR')}×`}
                  selected={speed === s}
                  onPress={() => setSpeed(s)}
                  className="flex-1 items-center"
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-medium">{y.noteLabel}</Text>
            <Text variant="muted">{y.noteHint}</Text>
            <View className="flex-row gap-2">
              {NOTE_CHOICES.map((n) => (
                <Choice
                  key={n}
                  testID={`youtube-note-${n}`}
                  label={`%${Math.round(n * 100)}`}
                  selected={note === n}
                  onPress={() => setNote(n)}
                  className="flex-1 items-center"
                />
              ))}
            </View>
          </View>
        </>
      ) : null}
    </StepScreen>
  );
}
