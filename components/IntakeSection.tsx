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
    <section className="intake" id="intake">
      <div className="intake-inner">
        <div className="center reveal">
          <span className="eyebrow center rule-r">{t('eyebrow')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <p className="intake-sub">{t('sub')}</p>
        </div>

        <div className="area-select reveal">
          {INQUIRY_PATHS.map((path) => (
            <button
              key={path}
              className={`area-btn${active === path ? ' active' : ''}`}
              onClick={() => setActive(path)}
              type="button"
            >
              {t(`tabs.${path}`)}
            </button>
          ))}
        </div>

        {INQUIRY_PATHS.map((path) => (
          <div key={path} className={`intake-panel${active === path ? ' active' : ''}`}>
            <p className="panel-title">{tf(`${path}.title`)}</p>
            <p className="panel-desc">{tf(`${path}.desc`)}</p>
            {active === path && <InquiryForm path={path} />}
          </div>
        ))}
      </div>
    </section>
  );
}
