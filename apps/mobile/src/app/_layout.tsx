import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { db } from '@/db/client';
import migrations from '../../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) SplashScreen.hideAsync();
  }, [error]);

  if (error) {
    return (
      <View className="bg-background flex-1 items-center justify-center p-6">
        <Text className="text-destructive">Veritabanı hazırlanamadı: {error.message}</Text>
      </View>
    );
  }
  if (!success) return null;

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
