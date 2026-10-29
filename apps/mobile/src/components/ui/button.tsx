import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

// lamba düğmeleri (prototip `ds/primitives.tsx`): turuncu (`default`) ekranda tek ana eylem içindir; tekrar
// eden olumlu eylem (ör. "Yaptım") `tonal`, ikincil eylem `outline`. Yükseklik en az 44 pt (UI-RULES).
const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border-primary bg-primary active:bg-primary/90 border',
          Platform.select({ web: 'hover:bg-primary/90' }),
        ),
        // Ön plan dolgusu: turuncuyu ana eyleme bırakır.
        tonal: cn(
          'border-foreground bg-foreground active:bg-foreground/90 border',
          Platform.select({ web: 'hover:bg-foreground/90' }),
        ),
        // Kırmızı yok (lamba kararı 27 Ekim): kalın çerçeve; ekran ikon ve "Geri alınamaz" metniyle tamamlar.
        destructive: cn(
          'border-control active:bg-accent border-2 bg-transparent',
          Platform.select({ web: 'hover:bg-accent' }),
        ),
        // Çerçeve bilgi taşıdığı için `control` (çizgi rengi değil); saydam zemin yok.
        outline: cn(
          'border-control active:bg-accent border bg-transparent',
          Platform.select({ web: 'hover:bg-accent' }),
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80',
          Platform.select({ web: 'hover:bg-secondary/80' }),
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' }),
        ),
        link: '',
      },
      size: {
        default: cn('min-h-touch-lg px-5', Platform.select({ web: 'has-[>svg]:px-4' })),
        sm: cn('min-h-touch gap-1.5 px-3.5', Platform.select({ web: 'has-[>svg]:px-3' })),
        lg: cn('min-h-touch-xl px-6', Platform.select({ web: 'has-[>svg]:px-5' })),
        icon: 'size-touch rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva(
  cn(
    'text-foreground font-sans-semibold text-center',
    Platform.select({ web: 'pointer-events-none transition-colors' }),
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        tonal: 'text-background',
        destructive: 'text-foreground',
        outline: cn(
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' }),
        ),
        secondary: 'text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: cn(
          'text-foreground underline group-active:opacity-70',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' }),
        ),
      },
      size: {
        default: 'text-callout',
        sm: 'text-subhead',
        lg: 'text-body',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

// Pasif durum saydamlıkla değil şekille (lamba kararı 27 Ekim): kesik çerçeve ve soluk metin. Çerçevesiz
// düğmelerde (ghost, link) çerçeve yok, yalnız metin solar.
const framed = (variant: ButtonProps['variant']) => variant !== 'ghost' && variant !== 'link';

function Button({ className, variant, size, ...props }: ButtonProps) {
  const disabled = Boolean(props.disabled);
  return (
    <TextClassContext.Provider
      value={cn(buttonTextVariants({ variant, size }), disabled && 'text-muted-foreground')}>
      <Pressable
        className={cn(
          buttonVariants({ variant, size }),
          className,
          disabled && framed(variant) && 'border-control bg-muted border border-dashed',
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
