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
        <span className="eyebrow center rule-r">{t('eyebrow')}</span>
        <h1>{t('title')}</h1>
        <p className="ph-sub">{t('sub')}</p>
      </div>

      <section className="framework" id="framework">
        <div className="wrap">
          <div className="calendar-row reveal">
            <Image
              className="calendar-img"
              src="/images/calendar.jpg"
              alt={t('title')}
              width={230}
              height={230}
            />
            <div>
              <span className="eyebrow">{t('cyclesEyebrow')}</span>
              <p className="body-copy">{t('cyclesBody1')}</p>
              <p className="body-copy">{t('cyclesBody2')}</p>
              <div className="cycle-inline">
                {cycles.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="scales-row reveal">
            {scales.map((scale) => (
              <div className="scale-cell" key={scale.n}>
                <span className="scale-num">{scale.n}</span>
                <span className="scale-name">{scale.name}</span>
                <p>{scale.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell-section">
        <Image className="shell-img" src="/images/shell.jpg" alt="" width={72} height={72} />
        <blockquote className="site-quote reveal">
          “{quoteLines[0]}
          <br />
          {quoteLines[1]}”
        </blockquote>
        <p className="quote-attr reveal">{t('quoteAttr')}</p>
      </section>

      <section className="cta-band">
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.body')}</p>
        <Link href="/#intake" className="btn btn-gold">
          {tn('beginInquiry')}
        </Link>
      </section>
    </div>
  );
}
