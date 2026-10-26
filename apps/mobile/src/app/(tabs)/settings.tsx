import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Choice } from '@/features/onboarding/ui';
import { useProfile } from '@/features/profile/repo';
import { MORNING_CHOICES, setMorningTime, useMorningTime } from '@/features/settings/prefs';
import { signOut, useSession } from '@/features/sync/auth';
import { canSync } from '@/features/sync/mapping';
import { lastPushedAt, push } from '@/features/sync/sync';
import { tr } from '@/i18n/tr';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function SettingsScreen() {
  const profile = useProfile();
  const session = useSession();
  const morning = useMorningTime();
  const [status, setStatus] = useState<string | null>(null);
  const s = tr.settings;
  if (!profile || session === undefined || morning === undefined) return null;

  const last = lastPushedAt();
  const syncNow = async () => {
    try {
      setStatus(s.syncDone(await push()));
    } catch {
      setStatus(s.syncFailed);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-6 p-6">
        <Text variant="h3">{s.title}</Text>

        <View className="gap-2">
          <Text className="font-medium">{s.morning}</Text>
          <Text variant="muted">{s.morningHint}</Text>
          <View className="flex-row flex-wrap gap-2">
            {MORNING_CHOICES.map((t) => (
              <Choice
                key={t}
                testID={`morning-${t}`}
                label={t}
                selected={morning === t}
                onPress={() => setMorningTime(t)}
                className="w-[23%] items-center"
              />
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-medium">{s.account}</Text>
          {!canSync(profile.consentStatus) ? (
            <Text testID="account-minor" variant="muted">
              {s.minorPending}
            </Text>
          ) : session ? (
            <>
              <Text testID="account-connected">{s.connected(session.user.email ?? '')}</Text>
              <Text variant="muted">{last ? s.lastSync(formatTime(last)) : s.neverSynced}</Text>
              <Button testID="sync-now" variant="outline" onPress={syncNow}>
                <Text>{s.syncNow}</Text>
              </Button>
              {status ? (
                <Text testID="sync-status" variant="muted">
                  {status}
                </Text>
              ) : null}
              <Button variant="ghost" onPress={() => void signOut()}>
                <Text>{s.signOut}</Text>
              </Button>
            </>
          ) : (
            <>
              <Text variant="muted">{s.accountHint}</Text>
              <Button testID="account-connect" onPress={() => router.push('/account/sign-in')}>
                <Text>{s.connect}</Text>
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
