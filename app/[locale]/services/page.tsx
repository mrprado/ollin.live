import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ServiceItem = {
  num: string;
  title: string;
  pillars: string[];
  body: string;
  cta: string;
  path: string;
  variant: 'gold' | 'cream' | 'stone';
  full?: boolean;
};
type Cluster = { label: string; items: ServiceItem[] };
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
  const clusters = t.raw('clusters') as Cluster[];
  const levels = t.raw('levels.items') as Level[];

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow center rule-r">{t('eyebrow')}</span>
        <h1>{t('title')}</h1>
        <p className="ph-sub">{t('sub')}</p>
      </div>

      <section className="services" id="services">
        <div className="wrap">
          <div className="serpent-divider reveal">
            <Image src="/images/serpent-divider.jpg" alt="" width={520} height={130} />
          </div>

          {clusters.map((cluster) => (
            <div className="svc-cluster reveal" key={cluster.label}>
              <div className="cluster-head">
                <span className="cluster-label">{cluster.label}</span>
              </div>
              <div className="svc-grid">
                {cluster.items.map((item) => (
                  <div className={`svc${item.full ? ' full' : ''}`} key={item.title}>
                    <div className="svc-num">{item.num}</div>
                    <h3>{item.title}</h3>
                    <ul className="svc-pillars">
                      {item.pillars.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <p>{item.body}</p>
                    <Link
                      href={`/#intake`}
                      className={`svc-btn${item.variant !== 'gold' ? ` ${item.variant}` : ''}`}
                    >
                      {item.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="levels">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow center rule-r">{t('levels.eyebrow')}</span>
            <h2 className="section-title">{t('levels.title')}</h2>
            <p className="levels-sub">{t('levels.sub')}</p>
          </div>
          <div className="levels-grid">
            {levels.map((level) => (
              <div className={`level${level.feature ? ' feature' : ''} reveal`} key={level.tier}>
                <span className="level-tier">{level.tier}</span>
                <span className="level-name">{level.name}</span>
                <span className="level-price">{level.price}</span>
                <ul className="level-features">
                  {level.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="level-note">{level.note}</p>
              </div>
            ))}
          </div>
        </div>
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
