import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ServiceTabs from '@/components/ServiceTabs';

type Level = { tier: string; name: string; price: string; features: string[]; note: string; feature?: boolean };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return {
    title: t('title'),
    description: t('sub'),
    alternates: { canonical: `/${locale}/services` }
  };
}

export default function ServicesPage() {
  const t = useTranslations('services');
  const tn = useTranslations('nav');
  const levels = t.raw('levels.items') as Level[];

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
          <div className="center r" style={{ maxWidth: 520, margin: '0 auto 4rem' }}>
            <Image
              src="/images/serpent-divider.jpg"
              alt=""
              width={520}
              height={130}
              style={{ opacity: 0.9, width: '100%', height: 'auto' }}
            />
          </div>
          <ServiceTabs />
        </div>
      </section>

      <section className="sec sec-d">
        <div className="w">
          <div className="split center-head r">
            <div>
              <div className="ey lt center">
                <div className="ey-b"></div>
                <span>{t('levels.eyebrow')}</span>
              </div>
              <h2 className="h2" style={{ color: 'var(--cream)' }}>
                {t('levels.title')}
              </h2>
              <p className="lede" style={{ margin: '0.8rem auto 0', color: 'rgba(214,231,203,0.55)' }}>
                {t('levels.sub')}
              </p>
            </div>
          </div>
          <div className="phase-g r d1">
            {levels.map((level) => (
              <div className={`phase${level.feature ? ' feature' : ''}`} key={level.tier}>
                <div className="ph-k">{level.tier}</div>
                <div className="ph-t">{level.name}</div>
                <div className="ph-price">{level.price}</div>
                <ul>
                  {level.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="ph-b">{level.note}</p>
              </div>
            ))}
          </div>
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
