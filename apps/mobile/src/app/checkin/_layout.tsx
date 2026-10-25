import { Stack } from 'expo-router';

export default function CheckinLayout() {
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
