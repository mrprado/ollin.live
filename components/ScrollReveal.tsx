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
      const els = document.querySelectorAll<HTMLElement>('.r:not(.vis)');

      if (reduceMotion || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('vis'));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('vis');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      els.forEach((el) => {
        observer?.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('vis');
      });
    });

    // Safety net: this animation is cosmetic, never load-bearing for content
    // visibility. If the observer misses anything for any reason (a class
    // mismatch shipped exactly this bug once already), force everything
    // visible after a few seconds rather than leaving content stuck at
    // opacity:0 indefinitely.
    const safety = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('.r:not(.vis)')
        .forEach((el) => el.classList.add('vis'));
    }, 2500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
