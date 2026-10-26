import { Stack } from 'expo-router';

export default function SupportLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
      }}
    />
  );
}
