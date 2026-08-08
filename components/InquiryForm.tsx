'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getInquiryFields, type InquiryPath } from '@/lib/inquiryFormFields';

export default function InquiryForm({ path }: { path: InquiryPath }) {
  const locale = useLocale();
  const t = useTranslations('forms');
  const fields = getInquiryFields(locale, path);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function setValue(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.company) return; // honeypot tripped, silently drop
    setStatus('submitting');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, locale, fields: values })
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="form-msg">{t('successMessage')}</p>;
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="hp-field" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company ?? ''}
            onChange={(e) => setValue('company', e.target.value)}
          />
        </label>
      </div>

      {fields.map((field, i) => {
        if (field.type === 'section') {
          return (
            <div className="fg sec" key={`${field.key}-${i}`}>
              {field.label}
            </div>
          );
        }

        const wrapClass = `fg${field.full ? ' full' : ''}`;

        if (field.type === 'select') {
          return (
            <div className={wrapClass} key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              <select
                id={field.key}
                value={values[field.key] ?? ''}
                onChange={(e) => setValue(field.key, e.target.value)}
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div className={wrapClass} key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              <textarea
                id={field.key}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={(e) => setValue(field.key, e.target.value)}
              />
            </div>
          );
        }

        return (
          <div className={wrapClass} key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            <input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.key] ?? ''}
              onChange={(e) => setValue(field.key, e.target.value)}
            />
          </div>
        );
      })}

      <p className="fnote">{t(`${path}.note`)}</p>

      {status === 'error' && <p className="form-msg error">{t('errorMessage')}</p>}

      <div className="fg full">
        <button className="btn-submit" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
