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
  const steps = t.raw('process.steps') as { n: string; title: string; body: string }[];
  const trust = t.raw('hero.trust') as { label: string; stats: { value: string; label: string }[] };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grad" />
        <div className="hero-in">
          <div className="hol">
            <div className="ey-b"></div>
            <span>{t('hero.l2')}</span>
          </div>
          <h1 className="hh">{t('hero.title')}</h1>
          <p className="hs">{t('hero.sub')}</p>
          <div className="hcta">
            <Link href="/services" className="btn btn-gold">
              {t('hero.ctaServices')} <span className="arr">&rarr;</span>
            </Link>
            <Link href="/#intake" className="btn btn-line">
              {t('hero.ctaInquiry')}
            </Link>
          </div>
          <div className="doors" role="navigation" aria-label="Areas of consultation">
            {previewCards.map((card, i) => (
              <Link href="/services" className="door" key={card.num}>
                <div className="dl">0{i + 1}</div>
                <div className="dt">{card.num}</div>
                <div className="dd">{card.title}</div>
                <span className="da">
                  {card.link} <span className="arr">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="trust" role="complementary" aria-label={trust.label}>
          <div className="trust-in">
            <div className="ti" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="tk" style={{ marginTop: 0, fontSize: 10, color: 'var(--gold-dim)' }}>
                {trust.label}
              </div>
            </div>
            {trust.stats.map((s) => (
              <div className="ti" key={s.label}>
                <div className="tv">{s.value}</div>
                <div className="tk">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPENING */}
      <section className="sec">
        <div className="w">
          <div className="split center-head r">
            <div>
              <p className="lede" style={{ margin: '0 auto 1.6rem' }}>
                {t('opening.lede')}
              </p>
              <p style={{ fontSize: 14.5, fontWeight: 300, color: 'var(--t-mid)', lineHeight: 1.9, maxWidth: 620, margin: '0 auto 1.6rem' }}>
                {(t.raw('opening.fragments') as string[]).join(' ')}
              </p>
              <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--sage)', maxWidth: 600, margin: '0 auto' }}>
                {t('opening.close')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="sec sec-d">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>{t('who.eyebrow')}</span>
              </div>
              <h2 className="h2" style={{ color: 'var(--cream)' }}>
                {t('who.title')}
              </h2>
            </div>
          </div>
          <div className="pillars r d1">
            {who.map((card) => (
              <div className="pillar" key={card.role}>
                <div className="pt">{card.role}</div>
                <div className="pb">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>{t('process.eyebrow')}</span>
              </div>
              <h2 className="h2">{t('process.title')}</h2>
            </div>
          </div>
          <div className="steps r d1">
            {steps.map((step) => (
              <div className="step" key={step.n}>
                <div className="sk">{step.n}</div>
                <div>
                  <div className="st">{step.title}</div>
                  <div className="sb">{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IntakeSection />
    </>
  );
}
