import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useConsentWatch } from '@/features/consent/use-consent-watch';
import { useProfile } from '@/features/profile/repo';
import { tr } from '@/i18n/tr';

export default function TabsLayout() {
  const profile = useProfile();
  useConsentWatch(profile?.consentStatus);

  useEffect(() => {
    if (profile !== undefined) SplashScreen.hideAsync();
  }, [profile]);

  if (profile === undefined) return null;
  if (profile === null) return <Redirect href="/onboarding" />;

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{tr.today.title}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>{tr.library.title}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{tr.settings.title}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
