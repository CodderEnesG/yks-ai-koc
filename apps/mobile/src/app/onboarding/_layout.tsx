import { Stack } from 'expo-router';

export default function OnboardingLayout() {
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
