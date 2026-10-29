import { isSafeMode } from '@yks/plan-engine';
import { HELP_LINES, NOTIFY_MESSAGE, PDR_APPROVED, SUPPORT_INTRO } from '@yks/safety';
import { useState } from 'react';
import { Linking, ScrollView, Share, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { track } from '@/features/analytics/analytics';
import { startSafeMode, useSafetyDays } from '@/features/safety/safe-mode';
import { tr } from '@/i18n/tr';
import { useToday } from '@/lib/use-today';

// Destek ekranı (T18, rapor 2.10 katman 3): yardım hatları, "velime/rehberime haber ver" ve planı
// hafifletme. Hiçbir şey sunucuya gitmez; onay öncesi 18 yaş altında da açılır. Akut riskte sohbet (T20)
// buraya yönlendirir. Veliye otomatik bildirim yok (açık karar 7); haber vermeyi öğrenci kendisi seçer.
export default function SupportScreen() {
  const s = tr.support;
  const today = useToday();
  const safetyDays = useSafetyDays();
  const [callFailed, setCallFailed] = useState<string | null>(null);

  const call = async (phone: string) => {
    setCallFailed(null);
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      setCallFailed(phone);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-6 p-6">
        <View className="gap-2">
          <Text variant="h1">{s.title}</Text>
          <Text testID="support-intro">{SUPPORT_INTRO}</Text>
          {!PDR_APPROVED ? (
            <Text variant="muted" className="text-xs">
              {s.draft}
            </Text>
          ) : null}
        </View>

        <View className="gap-3">
          <Text className="font-sans-semibold">{s.lines}</Text>
          {HELP_LINES.map((line) => (
            <View key={line.phone} className="gap-1">
              <Button testID={`support-call-${line.phone}`} onPress={() => void call(line.phone)}>
                <Text>{line.name}</Text>
              </Button>
              <Text variant="muted">{line.description}</Text>
            </View>
          ))}
          {callFailed ? <ErrorText>{s.callFailed(callFailed)}</ErrorText> : null}
        </View>

        <View className="gap-2">
          <Button
            testID="support-notify"
            variant="outline"
            onPress={() => void Share.share({ message: NOTIFY_MESSAGE })}>
            <Text>{s.notify}</Text>
          </Button>
          <Text variant="muted">{s.notifyHint}</Text>
        </View>

        <View className="gap-2">
          {safetyDays && isSafeMode([], today, safetyDays) ? (
            <Text testID="support-lightened" className="bg-secondary rounded-xl p-3">
              {s.lightened}
            </Text>
          ) : (
            <>
              <Button
                testID="support-lighten"
                variant="outline"
                onPress={() => {
                  startSafeMode(today);
                  track('guvenli_mod_acildi', { kaynak: 'destek' });
                }}>
                <Text>{s.lighten}</Text>
              </Button>
              <Text variant="muted">{s.lightenHint}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
