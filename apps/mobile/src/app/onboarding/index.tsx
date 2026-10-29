import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { Alaaddin } from '@/components/alaaddin';
import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useOnboarding } from '@/features/onboarding/store';
import { tr } from '@/i18n/tr';

export default function WelcomeScreen() {
  const reset = useOnboarding((s) => s.reset);
  return (
    <SafeAreaView className="bg-background flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Logo yok: marka açılış ekranında; yazı logosu ve lamba aynı ekranda olmaz (DECISIONS.md). */}
      <View className="flex-1 justify-center gap-4 p-6">
        <Alaaddin scene="karsilama" height={240} />
        <Text variant="h1">{tr.onboarding.welcome.title}</Text>
        <Text variant="lead">{tr.onboarding.welcome.body}</Text>
      </View>
      <View className="gap-2 p-6">
        <Button
          testID="start"
          size="lg"
          onPress={() => {
            reset();
            router.push('/onboarding/birth');
          }}>
          <Text>{tr.onboarding.welcome.start}</Text>
        </Button>
        <Button
          testID="restore"
          variant="ghost"
          onPress={() => router.push({ pathname: '/account/sign-in', params: { restore: '1' } })}>
          <Text>{tr.today.restore}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
