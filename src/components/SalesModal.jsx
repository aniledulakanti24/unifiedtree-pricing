import { useEffect, useState } from 'react';
import { CONFIG } from '../config.js';
import { planLabel, summaryText } from '../pricing.js';
import Modal, { SuccessMessage } from './Modal.jsx';

const EMPTY = { name: '', email: '', phone: '', company: '', message: '' };

// Same contact form, used for sales and for the two support buttons.
const VARIANTS = {
  sales: {
    title: 'Talk to Sales',
    email: () => CONFIG.SALES_EMAIL,
    subject: 'Pricing enquiry',
    placeholder: 'Tell us about your team and requirements',
    submit: 'Request a call',
    thanks: 'Our sales team will reach out shortly.',
  },
  support: {
    title: 'Customer Support',
    email: () => CONFIG.SUPPORT_EMAIL,
    subject: 'Customer support request',
    placeholder: 'How can we help?',
    submit: 'Contact support',
    thanks: 'Our support team will get back to you shortly.',
  },
  dedicated: {
    title: 'Dedicated Support',
    email: () => CONFIG.SUPPORT_EMAIL,
    subject: 'Dedicated support request',
    placeholder: 'Tell us what you need and your dedicated team will help',
    submit: 'Contact dedicated support',
    thanks: 'Your dedicated support team will get back to you shortly.',
  },
};

export default function SalesModal({ open, onClose, state, totals, variant = 'sales' }) {
  const v = VARIANTS[variant];
  const [form, setForm] = useState(EMPTY);
  const [sentTo, setSentTo] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setSentTo(null);
    }
  }, [open]);

  const field = (key) => ({
    id: `${variant}-${key}`,
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const body =
      `Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone}\nCompany: ${f.company}\n\n${f.message}` +
      `\n\n--- Selected pricing ---\n${summaryText(state, totals)}`;
    window.location.href =
      `mailto:${v.email()}?subject=${encodeURIComponent(v.subject + ' – ' + planLabel(state))}` +
      `&body=${encodeURIComponent(body)}`;
    setSentTo(f.name || 'there');
  };

  return (
    <Modal open={open} onClose={onClose} title={v.title}>
      {sentTo ? (
        <SuccessMessage title={`Thanks, ${sentTo}!`}>{v.thanks}</SuccessMessage>
      ) : (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor={`${variant}-name`}>Full name</label>
            <input {...field('name')} required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor={`${variant}-email`}>Work email</label>
            <input {...field('email')} type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor={`${variant}-phone`}>Phone</label>
            <input {...field('phone')} type="tel" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor={`${variant}-company`}>Company</label>
            <input {...field('company')} autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor={`${variant}-message`}>Message</label>
            <textarea {...field('message')} rows={3} placeholder={v.placeholder} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 4px' }}>
            Your current selection ({planLabel(state)}) will be shared with our team.
          </p>
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {v.submit}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
