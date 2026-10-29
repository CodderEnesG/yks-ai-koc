import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { fetchCatalog } from '@/features/library/catalog';
import {
  type CatalogEdition,
  editionTitle,
  normalizeIsbn,
  searchCatalog,
} from '@/features/library/rules';
import { Choice } from '@/features/onboarding/ui';
import { tr } from '@/i18n/tr';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; via?: 'barkod' }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [catalog, setCatalog] = useState<CatalogEdition[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchCatalog().then(setCatalog, () => setFailed(true));
  }, []);

  const results = catalog ? searchCatalog(catalog, query) : [];
  const searched = query.trim().length > 0;
  const sharedIsbn = normalizeIsbn(query) !== null && results.length > 1;

  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-3 p-6" keyboardShouldPersistTaps="handled">
        <Text variant="h2">{tr.library.search.title}</Text>
        <TextInput
          testID="search-input"
          value={query}
          onChangeText={setQuery}
          placeholder={tr.library.search.placeholder}
          autoFocus={!params.q}
          autoCorrect={false}
          className="border-input text-foreground rounded-xl border px-4 py-3 text-lg"
          placeholderTextColorClassName="accent-muted-foreground"
        />
        {failed ? <ErrorText>{tr.library.search.error}</ErrorText> : null}
        {sharedIsbn ? <Text variant="muted">{tr.library.search.sharedIsbn}</Text> : null}
        {results.map((e) => (
          <Choice
            key={e.id}
            testID={`result-${e.exam}-${e.subject}`}
            label={editionTitle(e)}
            description={`${e.publisher} · ${tr.library.edition.pages(e.pageCount)}`}
            selected={false}
            onPress={() =>
              router.push({
                pathname: '/book/edition',
                params: { id: e.id, via: params.via ?? 'katalog' },
              })
            }
          />
        ))}
        {(searched && catalog && results.length === 0) || failed ? (
          <View className="gap-2">
            {!failed ? <Text variant="muted">{tr.library.search.none}</Text> : null}
            <Button
              testID="search-quick"
              variant="outline"
              onPress={() => router.replace('/book/quick')}>
              <Text>{tr.library.search.quick}</Text>
            </Button>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
