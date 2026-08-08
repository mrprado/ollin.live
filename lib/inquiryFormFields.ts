import en from './inquiryFormFields.en.json';
import es from './inquiryFormFields.es.json';

export type InquiryPath = 'health' | 'nutrition' | 'conception' | 'routine' | 'home' | 'land';

export type InquiryField = {
  key: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'section';
  label: string;
  placeholder?: string;
  full?: boolean;
  options?: string[];
};

const byLocale = { en, es } as const;

export function getInquiryFields(locale: string, path: InquiryPath): InquiryField[] {
  const set = locale === 'es' ? byLocale.es : byLocale.en;
  return set[path] as InquiryField[];
}

export const INQUIRY_PATHS: InquiryPath[] = [
  'health',
  'nutrition',
  'conception',
  'routine',
  'home',
  'land'
];
