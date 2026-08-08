import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Discipline = { name: string; body: string; full?: boolean };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'background' });
  return {
    title: t('title'),
    description: t('sub'),
    alternates: { canonical: `/${locale}/background` }
  };
}

export default function BackgroundPage() {
  const t = useTranslations('background');
  const tn = useTranslations('nav');
  const disciplines = t.raw('disciplines') as Discipline[];

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow center rule-r">{t('eyebrow')}</span>
        <h1>{t('title')}</h1>
        <p className="ph-sub">{t('sub')}</p>
      </div>

      <section className="disciplines" id="disciplines">
        <div className="wrap">
          <div className="disc-grid">
            {disciplines.map((d) => (
              <div className={`disc${d.full ? ' full' : ''} reveal`} key={d.name}>
                <div className="disc-name">{d.name}</div>
                <p>{d.body}</p>
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
