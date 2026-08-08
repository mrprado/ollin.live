import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Teacher = { name: string; role: string; bio: string; image: string; alt: string };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: t('sub'),
    alternates: { canonical: `/${locale}/about` }
  };
}

export default function AboutPage() {
  const t = useTranslations('about');
  const tn = useTranslations('nav');
  const paragraphs = t.raw('paragraphs') as string[];
  const teachers = t.raw('teachers') as Teacher[];

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow center rule-r">{t('eyebrow')}</span>
        <h1>{t('title')}</h1>
        <p className="ph-sub">{t('sub')}</p>
      </div>

      <section className="about" id="about">
        <div className="about-inner">
          <div className="reveal">
            <Image
              className="about-img"
              src="/images/alan-portrait.jpg"
              alt={t('heading')}
              width={320}
              height={400}
              priority
            />
          </div>
          <div className="reveal about-text">
            <h2>{t('heading')}</h2>
            {paragraphs.map((p) => (
              <p className="body-copy" key={p.slice(0, 40)}>
                {p}
              </p>
            ))}
            <br />
            <Link href="/#intake" className="btn btn-gold">
              {tn('beginInquiry')}
            </Link>
          </div>
        </div>
      </section>

      <section className="teachers-sec">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow center rule-r">{t('teachersEyebrow')}</span>
            <h2 className="section-title">{t('teachersTitle')}</h2>
            <p className="body-copy" style={{ maxWidth: 540, margin: '1.1rem auto 0', fontSize: '.96rem' }}>
              {t('teachersSub')}
            </p>
          </div>
          <div className="teachers-grid">
            {teachers.map((teacher) => (
              <div className="teacher reveal" key={teacher.name}>
                <Image src={`/images/${teacher.image}.jpg`} alt={teacher.alt} width={400} height={400} />
                <div className="teacher-body">
                  <div className="teacher-name">{teacher.name}</div>
                  <span className="teacher-role">{teacher.role}</span>
                  <p>{teacher.bio}</p>
                </div>
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
