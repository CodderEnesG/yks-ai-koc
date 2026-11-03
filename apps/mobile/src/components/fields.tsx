import type { ComponentProps, ReactNode } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { ErrorText } from '@/components/error-text';
import { ICONS, Icon } from '@/components/icon';
import { Text } from '@/components/ui/text';
import { tr } from '@/i18n/tr';
import { cn } from '@/lib/utils';

// Giriş alanları, gezinme kartı, çip ve ilerleme çubuğu (lamba-design SCREENS 8; prototip
// `ds/primitives.tsx`). Dokunma alanı en az 44 pt; seçili ve hatalı durum renkle değil dolgu, tik ve kalın
// çerçeveyle.

type InputProps = Omit<ComponentProps<typeof TextInput>, 'className' | 'placeholderTextColor'>;

export function TextField({
  label,
  hint,
  error,
  numeric,
  center,
  icon,
  className,
  ...input
}: InputProps & {
  label: string;
  hint?: string;
  error?: string;
  numeric?: boolean;
  center?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('gap-1.5', className)}>
      {/* Görünür etiket; ekran okuyucu adı girişin kendisinden okur (iki kez okunmasın). */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="flex-row items-center gap-1.5">
        {icon}
        <Text className="text-subhead font-sans-semibold">{label}</Text>
      </View>
      <TextInput
        accessibilityLabel={label}
        keyboardType={numeric ? 'number-pad' : input.keyboardType}
        {...input}
        className={cn(
          'bg-background text-foreground min-h-touch-lg rounded-md px-4',
          numeric ? 'font-display text-title-3' : 'font-sans text-body',
          center && 'text-center',
          error ? 'border-foreground border-2' : 'border-control border',
        )}
        placeholderTextColorClassName="accent-muted-foreground"
      />
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : hint ? (
        <Text className="text-footnote text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
}

export function SearchField({
  label,
  value,
  onChangeText,
  ...input
}: InputProps & { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View className="justify-center">
      <View pointerEvents="none" className="absolute left-4 z-10">
        <Icon name={ICONS.search} size={20} tone="muted-foreground" />
      </View>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        {...input}
        className="border-control bg-background text-foreground font-sans text-body min-h-touch-lg rounded-md border pr-12 pl-12"
        placeholderTextColorClassName="accent-muted-foreground"
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={tr.common.clearSearch}
          onPress={() => onChangeText('')}
          className="size-touch absolute right-1 items-center justify-center rounded-full">
          <Icon name={ICONS.clear} size={20} tone="muted-foreground" />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Gezinme kartı: seçim kartı görünümünde ama seçmez, açar (ikon + başlık + açıklama + ok). */
export function NavCard({
  icon,
  title,
  description,
  onPress,
  testID,
}: {
  icon?: ComponentProps<typeof Icon>['name'];
  title: string;
  description?: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={description ? `${title}. ${description}` : title}
      onPress={onPress}
      className="border-border bg-card min-h-touch-xl flex-row items-center gap-3 rounded-lg border px-4 py-3 active:opacity-80">
      {icon ? (
        <View className="bg-background size-10 items-center justify-center rounded-md">
          <Icon name={icon} size={20} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className="text-body font-sans-semibold">{title}</Text>
        {description ? (
          <Text className="text-subhead text-muted-foreground">{description}</Text>
        ) : null}
      </View>
      <Icon name={ICONS.chevron} size={18} tone="muted-foreground" />
    </Pressable>
  );
}

/** Seçilebilir çip ya da (onPress yoksa) bilgi çipi. Seçili: ön plan dolgusu + tik; turuncu kullanmaz. */
export function Chip({
  children,
  selected,
  onPress,
  icon,
  testID,
}: {
  children: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  icon?: ComponentProps<typeof Icon>['name'];
  testID?: string;
}) {
  const content = (
    <>
      {selected ? (
        <Icon name={ICONS.check} size={14} tone="background" />
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      <Text className={cn('text-subhead font-sans-semibold', selected && 'text-background')}>
        {children}
      </Text>
    </>
  );
  const box = cn(
    'flex-row items-center gap-1.5 self-start rounded-full border px-3',
    selected
      ? 'border-foreground bg-foreground'
      : onPress
        ? 'border-control'
        : 'border-border bg-card',
    onPress ? 'min-h-touch px-4' : 'py-1.5',
  );
  if (!onPress) {
    return (
      <View testID={testID} className={box}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!selected }}
      onPress={onPress}
      className={box}>
      {content}
    </Pressable>
  );
}

/**
 * Onay kutusu satırı (rıza, SCREENS 8 "aç/kapa onay"): kare kutu, işaretliyken ön plan dolgusu ve tik.
 * Önceden işaretli gelmez; işaretli hali renkle değil dolgu ve tikle ayrılır.
 */
export function CheckRow({
  label,
  description,
  checked,
  onPress,
  testID,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={description ? `${label} ${description}` : label}
      onPress={onPress}
      className="border-border bg-card min-h-touch flex-row items-start gap-3 rounded-lg border p-4 active:opacity-80">
      <View
        className={cn(
          'mt-0.5 size-6 items-center justify-center rounded-xs border-2',
          checked ? 'border-foreground bg-foreground' : 'border-control',
        )}>
        {checked ? <Icon name={ICONS.check} size={14} tone="background" /> : null}
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-callout">{label}</Text>
        {description ? (
          <Text className="text-footnote text-muted-foreground">{description}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/** Ayarlar bölümü: bölüm başlığı ve altında kart. */
export function Section({
  title,
  icon,
  children,
  plain,
  testID,
}: {
  title: string;
  icon?: ComponentProps<typeof Icon>['name'];
  children: ReactNode;
  /** İçerik zaten kart (ör. NavCard): ikinci çerçeve çizilmez. */
  plain?: boolean;
  testID?: string;
}) {
  return (
    <View testID={testID} className="gap-2.5">
      <View className="flex-row items-center gap-2 px-1">
        {icon ? <Icon name={icon} size={16} tone="muted-foreground" /> : null}
        <Text role="heading" className="text-footnote font-sans-bold text-muted-foreground">
          {title}
        </Text>
      </View>
      {plain ? (
        children
      ) : (
        <View className="border-border bg-card gap-4 rounded-lg border p-4">{children}</View>
      )}
    </View>
  );
}

/** İnce ilerleme çubuğu: iz yalnız ayırıcı, bilgi dolgu ve yanındaki yüzde metninde. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      className="bg-border h-2 w-full overflow-hidden rounded-full">
      <View
        className="bg-foreground h-full rounded-full"
        style={{ width: `${Math.max(2, pct)}%` }}
      />
    </View>
  );
}
