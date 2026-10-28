import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useAnalyticsGate } from '@/features/analytics/use-analytics';
import { useConsentWatch } from '@/features/consent/use-consent-watch';
import { usePlaylistRefresh } from '@/features/library/use-playlist-refresh';
import { useProfile } from '@/features/profile/repo';
import { useSession } from '@/features/sync/auth';
import { canSync } from '@/features/sync/mapping';
import { tr } from '@/i18n/tr';

export default function TabsLayout() {
  const profile = useProfile();
  const scheme = useColorScheme();
  useConsentWatch(profile?.consentStatus);
  useAnalyticsGate(profile?.consentStatus);
  const session = useSession();
  usePlaylistRefresh(!!session && !!profile && canSync(profile.consentStatus));

  useEffect(() => {
    if (profile !== undefined) SplashScreen.hideAsync();
  }, [profile]);

  if (profile === undefined) return null;
  if (profile === null) return <Redirect href="/onboarding" />;

  return (
    // Seçili sekme marka vurgusunda (koyu: turuncu, açık: gece moru); ikonlar SF Symbols (Figma 1. sürüm).
    // Ayarlar artık burada değil (lamba kararı, 28 Ekim): Bugün'ün dişli ikonundan açılır. Sıra: Bugün,
    // Alaaddin, Kütüphane — günün en sık kullanılan iki yüzeyi (plan + koç) yan yana.
    <NativeTabs tintColor={scheme === 'dark' ? '#FF9F43' : '#1C1330'}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{tr.today.title}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'sun.max', selected: 'sun.max.fill' }} md="today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="coach">
        <NativeTabs.Trigger.Label>{tr.chat.title}</NativeTabs.Trigger.Label>
        {/* Genel bir sohbet ikonu yerine marka lambası: Alaaddin'e özgü bir kimlik (lamba kararı, 28 Ekim). */}
        <NativeTabs.Trigger.Icon src={require('../../../assets/images/alaaddin-tab-icon.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>{tr.library.title}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }}
          md="menu_book"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
