'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import InquiryForm from '@/components/InquiryForm';
import { INQUIRY_PATHS, type InquiryPath } from '@/lib/inquiryFormFields';

export default function IntakeSection() {
  const t = useTranslations('home.intake');
  const tf = useTranslations('forms');
  const [active, setActive] = useState<InquiryPath>('health');

  return (
    <section className="intake sec-d" id="intake">
      <div className="w">
        <div className="intake-head r">
          <div className="ey lt center">
            <div className="ey-b"></div>
            <span>{t('eyebrow')}</span>
          </div>
          <h2 className="h2" style={{ color: 'var(--cream)' }}>
            {t('title')}
          </h2>
          <p className="lede intake-sub" style={{ color: 'rgba(214,231,203,0.55)', margin: '0.8rem auto 0' }}>
            {t('sub')}
          </p>
        </div>

        <div className="itabs on-dark r d1" style={{ justifyContent: 'center' }}>
          {INQUIRY_PATHS.map((path) => (
            <button
              key={path}
              className={`itab${active === path ? ' on' : ''}`}
              onClick={() => setActive(path)}
              type="button"
            >
              {t(`tabs.${path}`)}
            </button>
          ))}
        </div>

        <div className="cform r d1">
          <p className="panel-title">{tf(`${active}.title`)}</p>
          <p className="panel-desc">{tf(`${active}.desc`)}</p>
          <InquiryForm path={active} />
        </div>
      </div>
    </section>
  );
}
