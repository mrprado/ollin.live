'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    // Deferred a frame so hydration of any client children finishes first,
    // same reasoning as Regenera's ScrollReveal: scanning immediately can
    // race hydration and revert the reveal state.
    const raf = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)');

      if (reduceMotion || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('visible'));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.07 }
      );

      els.forEach((el) => observer?.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
