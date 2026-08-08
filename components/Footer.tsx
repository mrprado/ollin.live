import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const LINKS = [
  { href: '/services', key: 'services' as const },
  { href: '/framework', key: 'framework' as const },
  { href: '/background', key: 'background' as const },
  { href: '/about', key: 'about' as const }
];

export default function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');

  return (
    <footer>
      <div className="footer-grid">
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
        </ul>
      </div>
      <div className="footer-base">
        <span>{tf('copyright')}</span>
        <span>{tf('tagline')}</span>
      </div>
    </footer>
  );
}
