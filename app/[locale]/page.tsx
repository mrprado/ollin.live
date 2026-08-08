import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import IntakeSection from '@/components/IntakeSection';

export default function HomePage() {
  const t = useTranslations('home');

  const who = t.raw('who.cards') as { role: string; desc: string }[];
  const previewCards = t.raw('servicesPreview.cards') as {
    num: string;
    title: string;
    link: string;
  }[];
  const fragments = t.raw('opening.fragments') as string[];
  const steps = t.raw('process.steps') as { n: string; title: string; body: string }[];

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="hero-grad" />
        <div className="hero-top">
          <h1 className="hero-title">{t('hero.title')}</h1>
        </div>
        <div className="hero-mid">
          <span className="hero-l2">{t('hero.l2')}</span>
        </div>
        <div className="hero-bottom">
          <p className="hero-sub">{t('hero.sub')}</p>
          <div className="cta-row">
            <Link href="/services" className="btn btn-gold">
              {t('hero.ctaServices')}
            </Link>
            <Link href="/#intake" className="btn btn-ghost">
              {t('hero.ctaInquiry')}
            </Link>
          </div>
        </div>
      </section>

      {/* OPENING */}
      <section className="opening">
        <div className="wrap-narrow">
          <p className="lede reveal">{t('opening.lede')}</p>
          <ul className="fragment-list reveal">
            {fragments.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="gold-rule reveal" />
          <p className="opening-close reveal">{t('opening.close')}</p>
        </div>
      </section>

      {/* WHO */}
      <section className="who">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow center rule-r">{t('who.eyebrow')}</span>
            <h2 className="section-title">{t('who.title')}</h2>
          </div>
          <div className="who-grid">
            {who.map((card) => (
              <div className="who-card reveal" key={card.role}>
                <div className="who-role">{card.role}</div>
                <p className="who-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="svc-preview">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow center rule-r">{t('servicesPreview.eyebrow')}</span>
            <h2 className="section-title">{t('servicesPreview.title')}</h2>
          </div>
          <div className="preview-grid">
            {previewCards.map((card) => (
              <Link className="preview-card reveal" href="/services" key={card.num}>
                <span className="preview-num">{card.num}</span>
                <h3>{card.title}</h3>
                <span className="preview-link">{card.link}</span>
              </Link>
            ))}
          </div>
          <div className="center" style={{ marginTop: '2.4rem' }}>
            <Link href="/services" className="btn btn-gold">
              {t('servicesPreview.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="center reveal" style={{ marginBottom: '3rem' }}>
            <span className="eyebrow center rule-r">{t('process.eyebrow')}</span>
            <h2 className="section-title">{t('process.title')}</h2>
          </div>
          {steps.map((step) => (
            <div className="process-step reveal" key={step.n}>
              <div className="step-n">{step.n}</div>
              <div className="step-body">
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <IntakeSection />
    </>
  );
}
