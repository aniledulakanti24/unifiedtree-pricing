import { useEffect, useState } from 'react';
import { CONFIG } from '../config.js';
import { planLabel, summaryText } from '../pricing.js';
import Modal, { SuccessMessage } from './Modal.jsx';

const EMPTY = { name: '', email: '', phone: '', company: '', message: '' };

export default function SalesModal({ open, onClose, state, totals }) {
  const [form, setForm] = useState(EMPTY);
  const [sentTo, setSentTo] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setSentTo(null);
    }
  }, [open]);

  const field = (key) => ({
    id: `s-${key}`,
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
      `mailto:${CONFIG.SALES_EMAIL}?subject=${encodeURIComponent('Pricing enquiry – ' + planLabel(state))}` +
      `&body=${encodeURIComponent(body)}`;
    setSentTo(f.name || 'there');
  };

  return (
    <Modal open={open} onClose={onClose} title="Talk to Sales">
      {sentTo ? (
        <SuccessMessage title={`Thanks, ${sentTo}!`}>Our sales team will reach out shortly.</SuccessMessage>
      ) : (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="s-name">Full name</label>
            <input {...field('name')} required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="s-email">Work email</label>
            <input {...field('email')} type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="s-phone">Phone</label>
            <input {...field('phone')} type="tel" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="s-company">Company</label>
            <input {...field('company')} autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="s-message">Message</label>
            <textarea {...field('message')} rows={3} placeholder="Tell us about your team and requirements" />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 4px' }}>
            Your current selection ({planLabel(state)}) will be shared with our team.
          </p>
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Request a call
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
