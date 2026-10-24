import { diffDays, istanbulDate, parseCivilDate, weekdayIndex } from '@yks/plan-engine';
import { useState } from 'react';
import { View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { deleteProfile, useProfile } from '@/features/profile/repo';
import { tr } from '@/i18n/tr';
import { formatCivilDate } from '@/lib/date';

// Gerçek "Bugün" ekranı (görev listesi, check-in) T13'te.
export default function TodayScreen() {
  const profile = useProfile();
  // Gün değişimini (gece yarısı, uygulama öne gelince) izleyen kanca T13'te.
  const [today] = useState(() => istanbulDate(Date.now()));
  if (!profile) return null;

  const daysLeft = diffDays(parseCivilDate(profile.examDate), today);

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 gap-4 p-6">
        <Text variant="h3">{tr.today.title}</Text>
        <Text variant="muted">
          {formatCivilDate(today)} · {tr.weekdays[weekdayIndex(today)]}
        </Text>
        <Text testID="today-countdown" variant="large">
          {tr.today.examCountdown(daysLeft)}
        </Text>
        <Text variant="muted">{tr.today.planSoon}</Text>
        {__DEV__ ? (
          <Button testID="reset-onboarding" variant="outline" onPress={deleteProfile}>
            <Text>{tr.today.resetDev}</Text>
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
