import { istanbulDate, weekdayIndex } from '@yks/plan-engine';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from '@/components/screen';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { db } from '@/db/client';
import { appMeta } from '@/db/schema';

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// T02 spike ekranı: plan-engine, Uniwind + Reusables ve expo-sqlite + Drizzle birlikte çalışıyor mu.
// Gerçek "Bugün" ekranı T13'te.
export default function TodayScreen() {
  // Gün değişimini (gece yarısı, uygulama öne gelince) izleyen gerçek kanca T13'te.
  const [today] = useState(() => istanbulDate(Date.now()));
  const { data } = useLiveQuery(db.select().from(appMeta).where(eq(appMeta.key, 'spike_taps')));
  const taps = Number(data[0]?.value ?? 0);

  const increment = async () => {
    await db
      .insert(appMeta)
      .values({ key: 'spike_taps', value: String(taps + 1) })
      .onConflictDoUpdate({ target: appMeta.key, set: { value: String(taps + 1) } });
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 gap-4 p-6">
        <Text variant="h3">Bugün</Text>
        <Text variant="muted">
          {today} · {WEEKDAYS[weekdayIndex(today)]}
        </Text>
        <Text>Yerel kayıt sayacı: {taps}</Text>
        <Button onPress={increment}>
          <Text>Artır</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
