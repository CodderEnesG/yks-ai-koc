import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ErrorText } from '@/components/error-text';
import { db } from '@/db/client';
import { useSync } from '@/features/sync/use-sync';
import migrations from '../../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

// Gezinme çubukları ve geçiş zeminleri marka renklerinde (global.css ile aynı değerler).
const LAMBA_DARK = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF9F43',
    background: '#1C1330',
    card: '#1C1330',
    text: '#F6EEE0',
    border: '#3A2D57',
    notification: '#FF9F43',
  },
};
const LAMBA_LIGHT = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1C1330',
    background: '#F6EEE0',
    card: '#F6EEE0',
    text: '#1C1330',
    border: '#D9CCB4',
    notification: '#1C1330',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);
  useSync();

  useEffect(() => {
    if (error) SplashScreen.hideAsync();
  }, [error]);

  if (error) {
    return (
      <View className="bg-background flex-1 items-center justify-center p-6">
        <ErrorText>Veritabanı hazırlanamadı: {error.message}</ErrorText>
      </View>
    );
  }
  if (!success) return null;

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? LAMBA_DARK : LAMBA_LIGHT}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="book" />
          <Stack.Screen name="checkin" />
          <Stack.Screen name="account" />
          <Stack.Screen name="support" />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
