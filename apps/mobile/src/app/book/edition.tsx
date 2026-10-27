import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { track } from '@/features/analytics/analytics';
import { fetchCatalog, fetchUnits } from '@/features/library/catalog';
import { addCatalogBook } from '@/features/library/repo';
import {
  type CatalogEdition,
  DEFAULT_MINUTES,
  editionTitle,
  MINUTE_CHOICES,
} from '@/features/library/rules';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

type Units = Awaited<ReturnType<typeof fetchUnits>>;

// Katalog birimleri sayfa aralığıdır (MEB kitaplarında test sayısı yok); süre sayfa başına sorulur.
export default function EditionScreen() {
  const { id, via } = useLocalSearchParams<{ id: string; via?: 'barkod' | 'katalog' }>();
  const [edition, setEdition] = useState<CatalogEdition | null>(null);
  const [units, setUnits] = useState<Units | null>(null);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES.pages);

  useEffect(() => {
    fetchCatalog().then((all) => setEdition(all.find((e) => e.id === id) ?? null));
    fetchUnits(id).then(setUnits);
  }, [id]);

  if (!edition) return null;

  return (
    <StepScreen
      title={editionTitle(edition)}
      subtitle={edition.publisher}
      continueLabel={tr.library.edition.add}
      canContinue={units !== null && units.length > 0}
      onContinue={() => {
        addCatalogBook(edition, units ?? [], minutes, new Date());
        track('kitap_eklendi', { yontem: via === 'barkod' ? 'barkod' : 'katalog' });
        router.dismissTo('/library');
      }}>
      <Text testID="edition-units">
        {units
          ? `${tr.library.edition.units(units.length)} · ${tr.library.edition.pages(edition.pageCount)}`
          : tr.library.edition.loading}
      </Text>
      <View className="gap-2">
        <Text className="font-medium">{tr.library.edition.minutesTitle}</Text>
        <View className="flex-row gap-2">
          {MINUTE_CHOICES.pages.map((m) => (
            <Choice
              key={m}
              testID={`minutes-${m}`}
              label={tr.library.edition.minutes(m)}
              selected={minutes === m}
              onPress={() => setMinutes(m)}
              className="flex-1 items-center"
            />
          ))}
        </View>
      </View>
    </StepScreen>
  );
}
