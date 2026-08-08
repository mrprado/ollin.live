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
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>{t('eyebrow')}</span>
          </div>
          <h1>{t('title')}</h1>
          <p className="ph-sub">{t('sub')}</p>
        </div>
      </div>

      <section className="sec sec-d">
        <div className="w">
          <div className="disc-strip r">
            {disciplines.map((d) => (
              <div className={`disc-c${d.full ? ' full' : ''}`} key={d.name}>
                <div className="en">{d.name}</div>
                <div className="ex">{d.body}</div>
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
