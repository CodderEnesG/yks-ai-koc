import { AlaaddinSection } from '@/components/landing/alaaddin-section';
import { Faq } from '@/components/landing/faq';
import { Hero } from '@/components/landing/hero';
import { Manifesto } from '@/components/landing/manifesto';
import { OneDay } from '@/components/landing/one-day';
import { Parents } from '@/components/landing/parents';
import { ScreensCarousel } from '@/components/landing/screens-carousel';
import { SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { SmoothScroll } from '@/components/landing/smooth-scroll';
import { Trust } from '@/components/landing/trust';
import { WaitlistSection } from '@/components/landing/waitlist-section';
import { availableScreens } from '@/content/screens';

// Tanıtım sitesi (T40, docs/PLAN-2026-11-03-tanitim-sitesi-t40.md). Statik; gerçek ekran görüntüleri derlemede
// `public/ekran/`'dan okunur. Veli sayfaları (/onay, /rapor) bu sayfadan bağımsız, öğrencinin linkiyle açılır.
export default function Home() {
  const screens = availableScreens();
  return (
    <SmoothScroll>
      <div data-landing className="scene-night">
        <SiteHeader />
        <main>
          <Hero />
          <Manifesto />
          <OneDay screens={screens} />
          <ScreensCarousel screens={screens} />
          <AlaaddinSection />
          <Parents />
          <Trust />
          <WaitlistSection />
          <Faq />
        </main>
        <SiteFooter contactEmail={process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined} />
      </div>
    </SmoothScroll>
  );
}
