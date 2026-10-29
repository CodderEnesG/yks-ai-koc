import { isSafeMode } from '@yks/plan-engine';
import { HELP_LINES, NOTIFY_MESSAGE, PDR_APPROVED, SUPPORT_INTRO } from '@yks/safety';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Share, View } from 'react-native';

import { Banner } from '@/components/banner';
import { ICONS, Icon } from '@/components/icon';
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
      <ScrollView contentContainerClassName="gap-6 px-5 pt-3 pb-8">
        <View className="gap-3">
          <Text variant="h1">{s.title}</Text>
          <Text testID="support-intro" className="text-body-lg">
            {SUPPORT_INTRO}
          </Text>
          {!PDR_APPROVED ? (
            <Text className="text-footnote text-muted-foreground">{s.draft}</Text>
          ) : null}
        </View>

        <View className="gap-4">
          <Text className="text-callout font-sans-bold">{s.lines}</Text>
          {HELP_LINES.map((line) => (
            <View key={line.phone} className="gap-1.5">
              {/* Büyük, net arama satırı (UI-RULES kriz kuralları): numara büyük, adı altında. */}
              <Pressable
                testID={`support-call-${line.phone}`}
                accessibilityRole="button"
                accessibilityLabel={s.callLabel(line.name)}
                onPress={() => void call(line.phone)}
                className="bg-primary min-h-[72px] flex-row items-center gap-4 rounded-lg px-5 active:opacity-90">
                <View className="bg-primary-foreground size-11 items-center justify-center rounded-full">
                  <Icon name={ICONS.phone} size={20} tone="primary" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary-foreground font-display text-title-2">
                    {line.phone}
                  </Text>
                  <Text className="text-primary-foreground text-callout font-sans-semibold">
                    {line.name}
                  </Text>
                </View>
              </Pressable>
              <Text variant="muted" className="px-1">
                {line.description}
              </Text>
              {callFailed === line.phone ? <ErrorText>{s.callFailed(line.phone)}</ErrorText> : null}
            </View>
          ))}
        </View>

        <View className="gap-2">
          <Button
            testID="support-notify"
            variant="outline"
            size="lg"
            onPress={() => void Share.share({ message: NOTIFY_MESSAGE })}>
            <Icon name={ICONS.message} size={18} />
            <Text>{s.notify}</Text>
          </Button>
          <Text variant="muted" className="px-1">
            {s.notifyHint}
          </Text>
        </View>

        {safetyDays && isSafeMode([], today, safetyDays) ? (
          <Banner kind="safe" testID="support-lightened">
            {s.lightened}
          </Banner>
        ) : (
          <View className="gap-2">
            <Button
              testID="support-lighten"
              variant="outline"
              size="lg"
              onPress={() => {
                startSafeMode(today);
                track('guvenli_mod_acildi', { kaynak: 'destek' });
              }}>
              <Text>{s.lighten}</Text>
            </Button>
            <Text variant="muted" className="px-1">
              {s.lightenHint}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
