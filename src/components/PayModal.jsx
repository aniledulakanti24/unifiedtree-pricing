import { useEffect, useState } from 'react';
import { CONFIG } from '../config.js';
import { inr, cycleWord, planLabel } from '../pricing.js';
import Modal, { SuccessMessage } from './Modal.jsx';

export default function PayModal({ open, onClose, state, totals: t }) {
  const [notConnected, setNotConnected] = useState(false);
  useEffect(() => {
    if (open) setNotConnected(false);
  }, [open]);

  const proceed = () => {
    if (CONFIG.PAYMENT_URL) {
      const order = { plan: state.plan, cycle: state.cycle, amount: t.total, selection: state[state.plan] };
      try {
        sessionStorage.setItem('unifiedtree_order', JSON.stringify(order));
      } catch (_) {
        /* storage unavailable — continue anyway */
      }
      window.location.href = CONFIG.PAYMENT_URL;
    } else {
      setNotConnected(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Order summary">
      {notConnected ? (
        <SuccessMessage title="Payment gateway not connected yet">
          Set <code>CONFIG.PAYMENT_URL</code> in <code>src/config.js</code> (or wire up Razorpay/Stripe) to take payments here.
        </SuccessMessage>
      ) : (
        <>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>{planLabel(state)}</p>
          <table className="mini">
            <tbody>
              {t.items.map(([name, v]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{inr(v)}</td>
                </tr>
              ))}
              {t.discount > 0 && (
                <tr>
                  <td>Yearly discount (20%)</td>
                  <td>− {inr(t.discount)}</td>
                </tr>
              )}
              <tr>
                <td>GST (18%)</td>
                <td>{inr(t.gst)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total / {cycleWord(state.cycle)}</strong>
                </td>
                <td>
                  <strong>{inr(t.total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={proceed}>
              Proceed to payment · {inr(t.total)}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
