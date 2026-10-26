// İçindekiler fotoğrafı (T11): seç/çek → telefonda küçült → Edge Function toc-extract → satırlar.
// Görüntü yalnız istek gövdesinde gider, sunucuda saklanmaz; telefondaki geçici dosyalar silinir.
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

import type { TocRow } from './rules';

const MAX_WIDTH = 1600;

export type TocError = 'permission' | 'quota' | 'unreadable' | 'network';

function deleteQuietly(uri: string | undefined): void {
  if (!uri) return;
  try {
    new File(uri).delete();
  } catch {
    // Zaten silinmiş ya da önbellekte değil.
  }
}

/** Fotoğrafı alır, küçültür, base64'e çevirir; geçici dosyaları siler. Vazgeçilirse null. */
export async function pickTocImage(source: 'camera' | 'library'): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) throw new TocFailure('permission');
  }
  const options = { mediaTypes: ['images'] as ImagePicker.MediaType[], quality: 1 };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled) return null;

  const original = result.assets[0]!.uri;
  let resized: string | undefined;
  try {
    const rendered = await ImageManipulator.manipulate(original)
      .resize({ width: MAX_WIDTH })
      .renderAsync();
    const saved = await rendered.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
      base64: true,
    });
    resized = saved.uri;
    return saved.base64 ?? null;
  } finally {
    deleteQuietly(original);
    deleteQuietly(resized);
  }
}

export class TocFailure extends Error {
  constructor(readonly code: TocError) {
    super(code);
  }
}

/** Görüntüyü okutur; satırları (başlık + başlangıç sayfası) döner. */
export async function extractToc(base64: string): Promise<TocRow[]> {
  const { data, error } = await supabase.functions.invoke('toc-extract', {
    body: { image: base64, mediaType: 'image/jpeg' },
  });
  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status;
    throw new TocFailure(status === 429 ? 'quota' : status === 422 ? 'unreadable' : 'network');
  }
  const units = (data as { birimler: { baslik: string; sayfa: number | null }[] }).birimler;
  if (units.length === 0) throw new TocFailure('unreadable');
  return units.map((u) => ({ title: u.baslik, start: u.sayfa === null ? '' : String(u.sayfa) }));
}

/** Okuma sonucu onay ekranına taşınır; kaydedilince ya da vazgeçilince silinir. */
export const useTocDraft = create<{ rows: TocRow[]; set: (rows: TocRow[]) => void }>()((set) => ({
  rows: [],
  set: (rows) => set({ rows }),
}));
