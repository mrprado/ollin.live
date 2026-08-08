'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ServiceItem = {
  num: string;
  title: string;
  pillars: string[];
  body: string;
  cta: string;
  path: string;
};
type Cluster = { label: string; items: ServiceItem[] };

export default function ServiceTabs() {
  const t = useTranslations('services');
  const clusters = t.raw('clusters') as Cluster[];
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="itabs">
        {clusters.map((cluster, i) => (
          <button
            key={cluster.label}
            className={`itab${active === i ? ' on' : ''}`}
            onClick={() => setActive(i)}
            type="button"
          >
            {cluster.label}
          </button>
        ))}
      </div>

      {clusters.map((cluster, i) => (
        <div key={cluster.label} className={`ipanel${active === i ? ' on' : ''}`}>
          <div className="scope">
            {cluster.items.map((item) => (
              <div className="scope-row" key={item.title}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--serif)',
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      color: 'var(--gold-dim)',
                      marginBottom: '0.3rem'
                    }}
                  >
                    {item.num}
                  </div>
                  <div className="srk">{item.title}</div>
                  <div className="srtags">
                    {item.pillars.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="srv">{item.body}</p>
                  <Link href="/#intake" className="srcta">
                    {item.cta} <span className="arr">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
