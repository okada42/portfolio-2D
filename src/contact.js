// Contact form. GitHub Pages can't send mail, so the form posts to FormSubmit (formsubmit.co):
// free, no account needed. The first submission sends a one-time activation email to CONTACT_EMAIL;
// after clicking "Activate", every submission is delivered to that inbox.
// Tip: after activation, FormSubmit emails you a random alias. Replace the email in FORM_ENDPOINT
// with that alias so your address isn't visible in the page source.
export const CONTACT_EMAIL = 'opensource2117@gmail.com';
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

import { t } from './i18n.js';

// thank-you pop-up shown after a message is delivered
function openThanks() {
  const d = document.querySelector('#thanks-modal');
  if (!d) return;
  if (!d.dataset.ready) {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-tm-close]')) d.close(); });
    d.dataset.ready = '1';
  }
  d.showModal();
  d.querySelector('[data-tm-close]')?.focus();
}

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
      // readable labels in the email, plus FormSubmit options
      const pick2 = (sel) => form.querySelector(`${sel} option:checked`)?.textContent || '';
      data.set('type', pick2('#cf-type'));
      data.set('budget', pick2('#cf-budget'));
      data.set('consent', 'yes');
      data.set('_subject', `${t('cf.subject')}: ${data.get('name')}`);
      data.set('_replyto', String(data.get('email')));
      data.set('_template', 'table');
      data.set('_captcha', 'false');
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || res.status);
      form.reset();
      show('cf.sent', 'ok');
      openThanks();
    } catch {
      show('cf.failed', 'error');
    } finally {
      btn.disabled = false;
    }
  });
}
