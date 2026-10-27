import { useEffect } from 'react';
import { AppState } from 'react-native';

import { refreshPlaylists } from './youtube';

/**
 * YouTube önbelleği (T34): açılışta ve uygulama öne gelince 25 günü geçen listeler yenilenir, 30 günü
 * geçen önbellek silinir. Hesap yoksa ya da onay yoksa yalnız silme yapılır.
 */
export function usePlaylistRefresh(canFetch: boolean): void {
  useEffect(() => {
    const run = () => void refreshPlaylists(new Date(), canFetch).catch(() => undefined);
    run();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') run();
    });
    return () => sub.remove();
  }, [canFetch]);
}
