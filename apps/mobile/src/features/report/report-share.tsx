import { useState } from 'react';
import { Linking, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { useReportConsent } from '@/features/consent/consent';
import { useSession } from '@/features/sync/auth';
import { tr } from '@/i18n/tr';

import { reportLink } from './report';

/**
 * "Velime gönder" (rapor 2.12): haftalık rapor linkini WhatsApp'la paylaştırır. Yalnız hesabı bağlı ve
 * velisi rapora rıza vermiş öğrencide görünür.
 */
export function ReportShare() {
  const r = tr.report;
  const session = useSession();
  const consented = useReportConsent();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!session || !consented) return null;

  const share = async () => {
    setBusy(true);
    setError(null);
    try {
      const url = await reportLink();
      if (!url) {
        setError(r.noConsent);
        return;
      }
      setLink(url);
      await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(r.message(url))}`);
    } catch {
      setError(r.failed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="gap-2">
      <Button testID="report-share" variant="outline" disabled={busy} onPress={share}>
        <Text>{r.share}</Text>
      </Button>
      {link ? (
        <Text testID="report-link" selectable variant="muted" className="text-sm">
          {link}
        </Text>
      ) : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </View>
  );
}
