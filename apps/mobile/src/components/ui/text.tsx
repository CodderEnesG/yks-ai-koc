import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

// Yazı ölçeği global.css'te (lamba-design prototipi): ekran başlığı `h1` (title-1), bölüm başlığı `h2`/`h3`,
// gövde `body`, ikincil metin `muted` (subhead).
const textVariants = cva(
  cn(
    'text-foreground font-sans text-body',
    Platform.select({
      web: 'select-text',
    }),
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn('font-display text-title-1 tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h2: cn('font-display text-title-2 tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h3: cn('font-display text-title-3 tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('font-display text-callout tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-footnote'),
        lead: 'text-muted-foreground text-body-lg',
        large: 'text-body-lg font-sans-semibold',
        small: 'text-footnote font-sans-semibold',
        muted: 'text-muted-foreground text-subhead',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
