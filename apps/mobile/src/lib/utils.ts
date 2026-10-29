import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// global.css'teki yazı ölçeği ve yazı aileleri tailwind-merge'e tanıtılır; tanımazsa `text-subhead`'i renk
// sanıp `text-foreground`'ı, `font-sans-semibold`'u ağırlık sanıp başka sınıfı siler.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'title-1',
            'title-2',
            'title-3',
            'body-lg',
            'body',
            'callout',
            'subhead',
            'footnote',
            'caption',
          ],
        },
      ],
      'font-family': [{ font: ['sans', 'sans-semibold', 'sans-bold', 'display', 'display-heavy'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
