import { Stack } from 'expo-router';

export default function AccountLayout() {
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
