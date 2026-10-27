import { Stack } from 'expo-router';

import { tr } from '@/i18n/tr';

export default function CheckinLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerBackButtonDisplayMode: 'minimal',
        // Görünmez ama ekran okuyucu ve uçtan uca testler geri düğmesini bu adla bulur.
        headerBackTitle: tr.common.back,
        headerShadowVisible: false,
      }}
    />
  );
}
