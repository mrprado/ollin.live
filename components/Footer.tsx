'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useLegalModal } from '@/components/LegalModalProvider';

const LINKS = [
  { href: '/services', key: 'services' as const },
  { href: '/framework', key: 'framework' as const },
  { href: '/background', key: 'background' as const },
  { href: '/about', key: 'about' as const }
];

export default function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');
  const tl = useTranslations('legal');
  const openModal = useLegalModal();

  return (
    <>
      <div className="reg">
        <p>
          <strong>{tl('notice.label')}.</strong> {tl('notice.body1')}
        </p>
      </div>
      <footer>
        <div className="w fw">
          <div>
            <span className="footer-brand">OLLIN</span>
            <p className="footer-tag">{tf('tag')}</p>
            <a className="footer-mail" href={`mailto:${tf('email')}`}>
              {tf('email')}
            </a>
          </div>
          <ul className="footer-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{t(l.key)}</Link>
              </li>
            ))}
            <li>
              <Link href="/#intake">{t('beginInquiry')}</Link>
            </li>
            <li>
              <button onClick={() => openModal('notice')}>{tl('notice.label')}</button>
            </li>
            <li>
              <button onClick={() => openModal('privacy')}>{tl('privacy.label')}</button>
            </li>
            <li>
              <button onClick={() => openModal('cookies')}>{tl('cookies.label')}</button>
            </li>
          </ul>
        </div>
        <div className="footer-base">
          <span>{tf('copyright')}</span>
          <span>{tf('tagline')}</span>
        </div>
      </footer>
    </>
  );
}
