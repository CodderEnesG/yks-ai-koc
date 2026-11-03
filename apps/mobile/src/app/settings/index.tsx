import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { ErrorText } from '@/components/error-text';
import { NavCard, Section } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { LockedState } from '@/components/states';
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

// Ayarlar artık sekme değil (lamba kararı, 28 Ekim): Bugün'ün dişli ikonundan açılır, geri okuyla
// kapanır (bkz. settings/_layout.tsx). Bölümler kartta; turuncu ana düğme ekranda en fazla bir tane (hesap
// bölümündeki eylem), silme kırmızısız: kalın çerçeve, çöp kutusu, "Geri alınamaz" ve sistem onayı.
export default function SettingsScreen() {
  const profile = useProfile();
  const session = useSession();
  const morning = useMorningTime();
  const [status, setStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const s = tr.settings;
  if (!profile || session === undefined || morning === undefined) return null;

  const last = lastPushedAt();
  const syncNow = async () => {
    setSyncing(true);
    try {
      setStatus(s.syncDone(await push()));
    } catch {
      setStatus(s.syncFailed);
    } finally {
      setSyncing(false);
    }
  };

  const runDelete = async () => {
    setDeleting(true);
    setDeleteError(false);
    try {
      await deleteAccountAndData();
      // Ayarlar sekmelerin üstüne itilmiş ekran: önce yığın köke indirilir, yoksa eski sekmeler
      // kurulumun altında kalır (Android geri, iOS kenardan kaydırma onlara döner).
      if (router.canDismiss()) router.dismissAll();
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
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-7 px-5 pt-3 pb-10">
        <Text variant="h1">{s.title}</Text>

        <Section title={s.account} icon={ICONS.person} plain={!canSync(profile.consentStatus)}>
          {!canSync(profile.consentStatus) ? (
            <LockedState
              testID="account-minor"
              text={profile.consentStatus === 'withdrawn' ? s.minorWithdrawn : s.minorPending}
              primary
              action={{
                label: tr.consent.open,
                onPress: () => router.push('/account/consent'),
                testID: 'consent-open',
              }}
            />
          ) : session ? (
            <>
              <View className="flex-row items-center gap-3">
                <View className="bg-background size-10 items-center justify-center rounded-full">
                  <Icon name={ICONS.check} size={18} />
                </View>
                <View className="flex-1">
                  <Text testID="account-connected" className="text-callout font-sans-semibold">
                    {s.connected(session.user.email ?? '')}
                  </Text>
                  <Text variant="muted">{last ? s.lastSync(formatTime(last)) : s.neverSynced}</Text>
                </View>
              </View>
              <View className="gap-2">
                <Button testID="sync-now" variant="outline" disabled={syncing} onPress={syncNow}>
                  <Icon
                    name={ICONS.backup}
                    size={18}
                    tone={syncing ? 'muted-foreground' : 'foreground'}
                  />
                  <Text>{s.syncNow}</Text>
                </Button>
                {status ? (
                  <Text testID="sync-status" variant="muted" className="px-1">
                    {status}
                  </Text>
                ) : null}
              </View>
              <ReportShare />
              <Button variant="ghost" className="self-start" onPress={() => void signOut()}>
                <Icon name={ICONS.signOut} size={18} />
                <Text>{s.signOut}</Text>
              </Button>
            </>
          ) : (
            <>
              <Text className="text-callout">{s.accountHint}</Text>
              <Button testID="account-connect" onPress={() => router.push('/account/sign-in')}>
                <Text>{s.connect}</Text>
              </Button>
            </>
          )}
        </Section>

        <Section title={s.morning} icon={ICONS.bell}>
          <Text variant="muted">{s.morningHint}</Text>
          <View className="flex-row flex-wrap gap-2">
            {MORNING_CHOICES.map((t) => (
              <Choice
                key={t}
                testID={`morning-${t}`}
                label={t}
                selected={morning === t}
                onPress={() => setMorningTime(t)}
                className="w-[23%] items-center px-1"
              />
            ))}
          </View>
        </Section>

        <Section title={s.support} icon={ICONS.support} plain>
          <NavCard
            testID="support-open"
            icon={ICONS.support}
            title={tr.support.settingsTitle}
            description={tr.support.settingsHint}
            onPress={() => router.push('/support')}
          />
        </Section>

        <Section title={s.deleteTitle} icon={ICONS.trash}>
          <Text className="text-callout">{s.deleteHint(!!session)}</Text>
          <Text className="text-callout font-sans-bold">{s.irreversible}</Text>
          <Button
            testID="delete-data"
            variant="destructive"
            disabled={deleting}
            onPress={confirmDelete}>
            <Icon
              name={ICONS.trash}
              size={18}
              tone={deleting ? 'muted-foreground' : 'foreground'}
            />
            <Text>{s.deleteButton(!!session)}</Text>
          </Button>
          {deleteError ? <ErrorText testID="delete-failed">{s.deleteFailed}</ErrorText> : null}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
