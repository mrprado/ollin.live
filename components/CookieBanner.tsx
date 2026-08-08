'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLegalModal } from '@/components/LegalModalProvider';

export default function CookieBanner() {
  const t = useTranslations('legal');
  const [visible, setVisible] = useState(false);
  const openModal = useLegalModal();

  useEffect(() => {
    try {
      if (!localStorage.getItem('ollin_ck')) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    setVisible(false);
    try {
      localStorage.setItem('ollin_ck', '1');
    } catch {}
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        background: 'rgba(8,12,9,0.97)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        padding: '1.1rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap'
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(214,231,203,0.5)', lineHeight: 1.6, maxWidth: 660, margin: 0 }}>
        {t('banner')}
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn btn-line" style={{ padding: '9px 18px', fontSize: 10 }} onClick={() => openModal('notice')}>
          {t('readNotice')}
        </button>
        <button className="btn btn-gold" style={{ padding: '9px 18px', fontSize: 10 }} onClick={accept}>
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
