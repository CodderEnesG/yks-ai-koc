import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useCSSVariable } from 'uniwind';

/**
 * Arayüz ikonu (lamba kararı 28 Ekim: ayrı ikon kütüphanesi yok). iOS'ta SF Symbols, Android'de Material
 * Symbols adı. Renk temadan gelir; ikon süstür, anlamı yanındaki metin ya da düğmenin etiketi taşır.
 */
export function Icon({
  name,
  size = 20,
  tone = 'foreground',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  tone?: 'foreground' | 'muted-foreground' | 'background' | 'primary' | 'primary-foreground';
}) {
  const color = useCSSVariable(`--color-${tone}`);
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={typeof color === 'string' ? color : undefined}
      fallback={null}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

/** Tasarımdaki (lamba-design, lucide) ikonların SF Symbols / Material Symbols karşılıkları. */
export const ICONS = {
  info: { ios: 'info.circle', android: 'info' },
  safe: { ios: 'leaf', android: 'eco' },
  pending: { ios: 'hourglass', android: 'hourglass_empty' },
  lock: { ios: 'lock', android: 'lock' },
  chevron: { ios: 'chevron.right', android: 'chevron_right' },
  search: { ios: 'magnifyingglass', android: 'search' },
  clear: { ios: 'xmark.circle', android: 'cancel' },
  calendar: { ios: 'calendar', android: 'calendar_month' },
  moon: { ios: 'moon', android: 'bedtime' },
  check: { ios: 'checkmark', android: 'check' },
  close: { ios: 'xmark', android: 'close' },
  plus: { ios: 'plus', android: 'add' },
  external: { ios: 'arrow.up.right.square', android: 'open_in_new' },
  support: { ios: 'lifepreserver', android: 'support' },
  phone: { ios: 'phone', android: 'call' },
  barcode: { ios: 'barcode.viewfinder', android: 'barcode_scanner' },
  book: { ios: 'book', android: 'menu_book' },
  list: { ios: 'list.bullet', android: 'list' },
  camera: { ios: 'camera', android: 'photo_camera' },
  edit: { ios: 'square.and.pencil', android: 'edit_note' },
  play: { ios: 'play.rectangle', android: 'smart_display' },
  trash: { ios: 'trash', android: 'delete' },
  send: { ios: 'arrow.up', android: 'arrow_upward' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh' },
  flag: { ios: 'flag', android: 'flag' },
  message: { ios: 'message', android: 'chat' },
  share: { ios: 'square.and.arrow.up', android: 'share' },
  bell: { ios: 'bell', android: 'notifications' },
  backup: { ios: 'icloud.and.arrow.up', android: 'cloud_upload' },
  person: { ios: 'person.crop.circle', android: 'account_circle' },
  mail: { ios: 'envelope', android: 'mail' },
  signOut: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout' },
  shield: { ios: 'checkmark.shield', android: 'verified_user' },
} as const satisfies Record<string, SymbolViewProps['name']>;
