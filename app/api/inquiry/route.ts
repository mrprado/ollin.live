import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { getInquiryFields, INQUIRY_PATHS, type InquiryPath } from '@/lib/inquiryFormFields';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PATH_LABELS: Record<InquiryPath, string> = {
  health: 'Integrative Health and Vitality',
  nutrition: 'Nutrition and Digestive Health',
  conception: 'Preconception and Reproductive Health',
  routine: 'Daily Routine and Embodied Practice',
  home: 'Home, Space and Family Development',
  land: 'Land, Agriculture and Regenerative Development'
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const path = String(body.path ?? '') as InquiryPath;
  const locale = body.locale === 'es' ? 'es' : 'en';
  const fields = (body.fields ?? {}) as Record<string, unknown>;

  if (!INQUIRY_PATHS.includes(path)) {
    return NextResponse.json({ ok: false, error: 'Unknown inquiry path.' }, { status: 400 });
  }

  // Honeypot: real users never populate this field. If it's set, the
  // request came from a bot, so acknowledge success without doing anything.
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const schema = getInquiryFields('en', path);
  const answers: Record<string, string> = {};
  let email = '';
  let name = '';

  for (const field of schema) {
    if (field.type === 'section') continue;
    const raw = fields[field.key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) continue;
    answers[field.label] = value;
    if (field.type === 'email') email = value;
    if (/name/i.test(field.key) && !name) name = value;
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email address is required.' },
      { status: 400 }
    );
  }
  if (Object.keys(answers).length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Please complete at least one field before submitting.' },
      { status: 400 }
    );
  }

  // Supabase is the source of truth for every inquiry. Email notification
  // below is a best-effort convenience on top of it, not a requirement for
  // success.
  const supabase = createClient();
  const { error: dbError } = await supabase.from('inquiries').insert({
    path,
    locale,
    name: name || null,
    email,
    answers
  });

  if (dbError) {
    console.error('Supabase inquiry insert failed:', dbError);
    return NextResponse.json(
      { ok: false, error: 'We could not send your inquiry right now. Please try again shortly or email us directly.' },
      { status: 500 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'hello@ollin.bio';
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error(
      'Inquiry stored, but RESEND_API_KEY or CONTACT_FROM_EMAIL is not configured, so no notification email was sent.'
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const body_ = Object.entries(answers)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n\n');

    const { error: emailError } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Ollin inquiry: ${PATH_LABELS[path]}${name ? ` — ${name}` : ''}`,
      text: body_
    });

    if (emailError) {
      console.error('Resend error (inquiry was still stored):', emailError);
    }
  } catch (err) {
    console.error('Inquiry notification email failed (inquiry was still stored):', err);
  }

  return NextResponse.json({ ok: true });
}
