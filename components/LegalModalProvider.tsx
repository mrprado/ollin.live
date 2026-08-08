'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

type ModalKind = 'notice' | 'privacy' | 'cookies';

const LegalModalContext = createContext<((kind: ModalKind) => void) | null>(null);

export function useLegalModal() {
  const ctx = useContext(LegalModalContext);
  if (!ctx) throw new Error('useLegalModal must be used within LegalModalProvider');
  return ctx;
}

export default function LegalModalProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('legal');
  const [kind, setKind] = useState<ModalKind | null>(null);

  useEffect(() => {
    if (!kind) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setKind(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [kind]);

  return (
    <LegalModalContext.Provider value={setKind}>
      {children}
      <div
        className={`legal-modal${kind ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) setKind(null);
        }}
      >
        <div className="legal-box">
          <button className="legal-close" aria-label={t('close')} onClick={() => setKind(null)}>
            ×
          </button>
          {kind === 'notice' && (
            <div>
              <h4>{t('notice.title')}</h4>
              <p>{t('notice.body1')}</p>
              <p>{t('notice.body2')}</p>
              <p style={{ fontSize: 13 }}>
                {t.rich('notice.seeAlso', {
                  privacy: (chunks) => (
                    <button
                      style={{
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        color: 'var(--sage)',
                        textDecoration: 'underline',
                        fontWeight: 300,
                        cursor: 'pointer'
                      }}
                      onClick={() => setKind('privacy')}
                    >
                      {chunks}
                    </button>
                  ),
                  cookies: (chunks) => (
                    <button
                      style={{
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        color: 'var(--sage)',
                        textDecoration: 'underline',
                        fontWeight: 300,
                        cursor: 'pointer'
                      }}
                      onClick={() => setKind('cookies')}
                    >
                      {chunks}
                    </button>
                  )
                })}
              </p>
            </div>
          )}
          {kind === 'privacy' && (
            <div>
              <h4>{t('privacy.title')}</h4>
              <p>{t('privacy.body1')}</p>
              <p>{t('privacy.body2')}</p>
              <p>{t('privacy.body3')}</p>
            </div>
          )}
          {kind === 'cookies' && (
            <div>
              <h4>{t('cookies.title')}</h4>
              <p>{t('cookies.body1')}</p>
            </div>
          )}
          <div style={{ marginTop: '1.4rem' }}>
            <button className="btn btn-dark" onClick={() => setKind(null)}>
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </LegalModalContext.Provider>
  );
}
