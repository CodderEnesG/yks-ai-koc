import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YKS Koç',
  description: 'Veli onayı ve haftalık rapor',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
