import { useEffect, useId } from 'react';

/** Animated dialog. Stays mounted so it can fade in and out; closes on Esc or backdrop click. */
export default function Modal({ open, title, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`overlay ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-head">
          <h3 id={titleId}>{title}</h3>
          <button className="x" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function SuccessMessage({ title, children }) {
  return (
    <div className="ok">
      <div className="tick">✓</div>
      <h3 style={{ margin: '0 0 6px' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', margin: 0 }}>{children}</p>
    </div>
  );
}
