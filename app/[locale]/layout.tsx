import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import LegalModalProvider from '@/components/LegalModalProvider';
import CookieBanner from '@/components/CookieBanner';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap'
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL('https://ollin.live'),
    title: {
      default: t('title'),
      template: '%s · Ollin'
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' }
    },
    openGraph: {
      type: 'website',
      siteName: 'Ollin',
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `https://ollin.live/${locale}`,
      images: ['/og.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('twitterDescription'),
      images: ['/og.png']
    },
    robots: { index: true, follow: true }
  };
}

export const viewport: Viewport = {
  themeColor: '#0b100c'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('nav');

  return (
    <html lang={locale} className={`${cormorantGaramond.variable} ${instrumentSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Ollin',
              url: 'https://ollin.live/',
              description:
                'Integrative health and regenerative living consultancy: Ayurvedic health assessment, daily practice design, nutrition, preconception, Vastu spatial health, regenerative land assessment, and development advisory.',
              founder: {
                '@type': 'Person',
                name: 'Alan Prado',
                jobTitle: 'Integrative Health and Regenerative Development Consultant',
                alumniOf: [
                  { '@type': 'CollegeOrUniversity', name: 'Maharishi International University' },
                  { '@type': 'CollegeOrUniversity', name: 'National Autonomous University of Mexico' },
                  { '@type': 'CollegeOrUniversity', name: 'Bhishma School of Indic Studies' }
                ]
              },
              makesOffer: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Integrative Health Assessment' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Daily Routine and Embodied Practice' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nutrition and Digestive Health' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Preconception and Reproductive Health' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vastu and Spatial Health Assessment' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Household Rhythm and Family Development' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Regenerative Land Assessment' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Household Food and Medicine Systems' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Regenerative Development Advisory' } }
              ]
            })
          }}
        />
      </head>
      <body>
        <noscript>
          <style>{'.r{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <LegalModalProvider>
            <a href="#intake" className="skip-link">
              {t('skipToInquiry')}
            </a>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <CookieBanner />
            <ScrollReveal />
          </LegalModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
