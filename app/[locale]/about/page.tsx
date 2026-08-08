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
          <div className="about-inner r">
            <Image
              className="about-img"
              src="/images/alan-portrait.jpg"
              alt={t('heading')}
              width={420}
              height={520}
              priority
            />
            <div className="about-text">
              <h2 className="h3" style={{ marginBottom: '1.2rem' }}>
                {t('heading')}
              </h2>
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <Link href="/#intake" className="btn btn-gold" style={{ marginTop: '0.8rem' }}>
                {tn('beginInquiry')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-d">
        <div className="w">
          <div className="split center-head r">
            <div>
              <div className="ey lt center">
                <div className="ey-b"></div>
                <span>{t('teachersEyebrow')}</span>
              </div>
              <h2 className="h2" style={{ color: 'var(--cream)' }}>
                {t('teachersTitle')}
              </h2>
              <p className="lede" style={{ margin: '0.8rem auto 0', color: 'rgba(214,231,203,0.55)' }}>
                {t('teachersSub')}
              </p>
            </div>
          </div>
          <div className="teachers r d1">
            {teachers.map((teacher) => (
              <div className="teacher" key={teacher.name}>
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
