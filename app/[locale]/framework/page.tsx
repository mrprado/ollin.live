import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Scale = { n: string; name: string; body: string };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'framework' });
  return {
    title: t('title'),
    description: t('sub'),
    alternates: { canonical: `/${locale}/framework` }
  };
}

export default function FrameworkPage() {
  const t = useTranslations('framework');
  const tn = useTranslations('nav');
  const scales = t.raw('scales') as Scale[];
  const cycles = t.raw('cycles') as string[];
  const quoteLines = t('quote').split('\n');

  return (
    <div>
      <div className="page-head">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>{t('eyebrow')}</span>
          </div>
          <h1>{t('title')}</h1>
          <p className="ph-sub">{t('sub')}</p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="split r" style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/images/calendar.jpg"
                alt={t('title')}
                width={280}
                height={280}
                style={{ borderRadius: '50%', boxShadow: '0 0 0 1px rgba(201,168,76,0.2)' }}
              />
            </div>
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>{t('cyclesEyebrow')}</span>
              </div>
              <p style={{ fontSize: 14.5, fontWeight: 300, color: 'var(--t-mid)', lineHeight: 1.82, marginBottom: '1rem' }}>
                {t('cyclesBody1')}
              </p>
              <p style={{ fontSize: 14.5, fontWeight: 300, color: 'var(--t-mid)', lineHeight: 1.82 }}>
                {t('cyclesBody2')}
              </p>
            </div>
          </div>
          <div className="mand r d1" style={{ marginBottom: 3.5 + 'rem' }}>
            {cycles.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="disc-strip r d2">
            {scales.map((scale) => (
              <div className="disc-c" key={scale.n}>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.2em', color: 'var(--gold-dim)', marginBottom: 8 }}>
                  {scale.n}
                </div>
                <div className="en">{scale.name}</div>
                <div className="ex">{scale.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-sec">
        <div className="w">
          <Image
            src="/images/shell.jpg"
            alt=""
            width={72}
            height={72}
            style={{ margin: '0 auto 2rem', mixBlendMode: 'screen', filter: 'brightness(1.2)' }}
          />
          <blockquote className="quote">
            “{quoteLines[0]}
            <br />
            {quoteLines[1]}”
          </blockquote>
          <p className="quote-a">{t('quoteAttr')}</p>
        </div>
      </section>

      <section className="cta-band">
        <div className="w">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.body')}</p>
          <Link href="/#intake" className="btn btn-gold">
            {tn('beginInquiry')}
          </Link>
        </div>
      </section>
    </div>
  );
}
