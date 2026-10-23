import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { db } from '@/db/client';
import migrations from '../../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success || error) SplashScreen.hideAsync();
  }, [success, error]);

  if (error) {
    return (
      <View className="bg-background flex-1 items-center justify-center p-6">
        <Text className="text-destructive">Veritabanı hazırlanamadı: {error.message}</Text>
      </View>
    );
  }
  if (!success) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppTabs />
      <PortalHost />
    </ThemeProvider>
  );
}
