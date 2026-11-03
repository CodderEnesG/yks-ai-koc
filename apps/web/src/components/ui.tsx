import Image from 'next/image';
import type { ReactNode } from 'react';

// Veli sayfalarının ortak parçaları (lamba-design SCREENS 8 "Web"): sayfa kabuğu, kart, hata satırı, düğme ve
// alan sınıfları. Mobil tasarım sistemiyle aynı kurallar: turuncu yalnız koyu zeminde ve tek ana eylemde,
// kırmızı yok, pasif durum saydamlıkla değil kesik çerçeveyle.

/** Üstte yazı logosu (temaya göre açık ya da koyu zemin sürümü), altında başlık ve içerik; tek sütun. */
export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-5 pt-6 pb-12">
      <header>
        <Image
          src="/lamba-yazi-acik.svg"
          alt="lamba"
          width={86}
          height={35}
          priority
          className="dark:hidden"
        />
        <Image
          src="/lamba-yazi-koyu.svg"
          alt="lamba"
          width={86}
          height={35}
          priority
          className="hidden dark:block"
        />
      </header>
      <h1 className="font-display text-[34px] leading-[38px] font-bold tracking-tight">{title}</h1>
      {children}
    </main>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`border-border bg-card rounded-lg border p-5 ${className}`}>
      {children}
    </section>
  );
}

/** Durum mesajı (geçersiz link, süresi doldu, onay verildi): ikon yerine işaret ve metin. */
export function Notice({
  mark,
  children,
  testId,
}: {
  mark: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <Card>
      <div className="flex gap-4">
        <span
          aria-hidden
          className="bg-background flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          {mark}
        </span>
        <div className="flex-1 space-y-3 self-center" data-testid={testId}>
          {children}
        </div>
      </div>
    </Card>
  );
}

/** Hata satırı (lamba kararı 27 Ekim): kırmızı yok; çarpı işareti ve kalın metin. */
export function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex gap-2 text-[15px] font-semibold">
      <span aria-hidden className="font-bold">
        ✕
      </span>
      <span>{children}</span>
    </p>
  );
}

export function Loading() {
  return <p className="text-muted-foreground">Yükleniyor…</p>;
}

export const buttonClass =
  'bg-primary text-primary-foreground border-primary min-h-[56px] w-full rounded-md border px-6 text-[17px] font-semibold transition-colors hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-emphasis disabled:border-control disabled:border-dashed disabled:bg-card disabled:text-muted-foreground disabled:hover:opacity-100';

export const inputClass =
  'border-control bg-background min-h-[52px] w-full rounded-md border px-4 text-[17px] text-foreground placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-emphasis disabled:border-dashed disabled:text-muted-foreground';

export const labelClass = 'mb-1.5 block text-[15px] font-semibold';
