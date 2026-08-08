'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

const NAV_ITEMS = [
  { href: '/services', key: 'services' as const },
  { href: '/framework', key: 'framework' as const },
  { href: '/background', key: 'background' as const },
  { href: '/about', key: 'about' as const }
];

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function switchLocale() {
    const next = locale === 'en' ? 'es' : 'en';
    router.replace(pathname, { locale: next });
  }

  return (
    <>
      <nav aria-label="Primary">
        <Link href="/" className="nav-logo" aria-label={t('logoAria')}>
          OLLIN
        </Link>
        <div className="nav-right">
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} style={{ display: 'inline' }}>
                <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <button className="lang-btn" onClick={switchLocale} aria-label="Cambiar idioma">
            {locale === 'en' ? 'ES' : 'EN'}
          </button>
          <Link href="/#intake" className="nav-cta">
            {t('beginInquiry')}
          </Link>
        </div>
        <button
          className="menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <Link href="/" onClick={() => setOpen(false)}>
          {t('home')}
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {t(item.key)}
          </Link>
        ))}
        <Link href="/#intake" className="mm-cta" onClick={() => setOpen(false)}>
          {t('beginInquiry')}
        </Link>
        <button className="lang-btn" onClick={switchLocale} aria-label="Cambiar idioma">
          {locale === 'en' ? 'ES' : 'EN'}
        </button>
      </div>
    </>
  );
}
