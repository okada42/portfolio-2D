// Contact form. GitHub Pages can't send mail, so the form posts to a form service.
//
// SETUP: create a free form at https://formspree.io (or a compatible service), then paste its
// endpoint below, e.g. 'https://formspree.io/f/abcdwxyz'. Until then, submitting opens the
// visitor's email app with the message filled in, addressed to CONTACT_EMAIL.
export const FORM_ENDPOINT = '';
export const CONTACT_EMAIL = 'hello@example.com';

import { t } from './i18n.js';

export function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = form.querySelector('.cf-status');
  const btn = form.querySelector('button[type="submit"]');
  const show = (key, kind) => { status.textContent = t(key); status.dataset.kind = kind; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot filled = bot
    if (!form.checkValidity()) { form.reportValidity(); show('cf.invalid', 'error'); return; }
    const data = new FormData(form);
    data.delete('website');
    const pick = (sel) => form.querySelector(`${sel} option:checked`)?.textContent || '';

    if (!FORM_ENDPOINT) {
      // fallback: open the visitor's mail app with everything filled in
      const lines = [
        `${t('cf.name')}: ${data.get('name')}`,
        `${t('cf.email')}: ${data.get('email')}`,
        `${t('cf.company')}: ${data.get('company') || '-'}`,
        `${t('cf.type')}: ${pick('#cf-type')}`,
        `${t('cf.budget')}: ${pick('#cf-budget')}`,
        '',
        String(data.get('message')),
      ];
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('cf.subject'))}&body=${encodeURIComponent(lines.join('\n'))}`;
      show('cf.mailto', 'ok');
      return;
    }

    btn.disabled = true; show('cf.sending', 'info');
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      show('cf.sent', 'ok');
    } catch {
      show('cf.failed', 'error');
    } finally {
      btn.disabled = false;
    }
  });
}
