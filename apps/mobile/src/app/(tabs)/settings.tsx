import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { deleteAccountAndData } from '@/features/account/delete';
import { Choice } from '@/features/onboarding/ui';
import { useProfile } from '@/features/profile/repo';
import { ReportShare } from '@/features/report/report-share';
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
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
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

  const runDelete = async () => {
    setDeleting(true);
    setDeleteError(false);
    try {
      await deleteAccountAndData();
      router.replace('/onboarding');
    } catch {
      setDeleteError(true);
      setDeleting(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(s.deleteConfirmTitle, s.deleteConfirmBody, [
      { text: s.cancel, style: 'cancel' },
      { text: s.deleteConfirm, style: 'destructive', onPress: () => void runDelete() },
    ]);

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
            <>
              <Text testID="account-minor" variant="muted">
                {profile.consentStatus === 'withdrawn' ? s.minorWithdrawn : s.minorPending}
              </Text>
              <Button testID="consent-open" onPress={() => router.push('/account/consent')}>
                <Text>{tr.consent.open}</Text>
              </Button>
            </>
          ) : session ? (
            <>
              <Text testID="account-connected">{s.connected(session.user.email ?? '')}</Text>
              <Text variant="muted">{last ? s.lastSync(formatTime(last)) : s.neverSynced}</Text>
              <ReportShare />
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

        <View className="gap-2">
          <Text className="font-medium">{tr.support.settingsTitle}</Text>
          <Text variant="muted">{tr.support.settingsHint}</Text>
          <Button testID="support-open" variant="outline" onPress={() => router.push('/support')}>
            <Text>{tr.support.open}</Text>
          </Button>
        </View>

        <View className="gap-2">
          <Text className="font-medium">{s.deleteTitle}</Text>
          <Text variant="muted">{s.deleteHint(!!session)}</Text>
          <Button
            testID="delete-data"
            variant="destructive"
            disabled={deleting}
            onPress={confirmDelete}>
            <Text>{s.deleteButton(!!session)}</Text>
          </Button>
          {deleteError ? (
            <Text testID="delete-failed" className="text-destructive text-sm">
              {s.deleteFailed}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
