import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const ROUTES = ['', '/services', '/framework', '/background', '/about'];
const BASE = 'https://ollin.live';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE}/${routing.defaultLocale}${route}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${BASE}/${locale}${route}`])
      )
    }
  }));
}
