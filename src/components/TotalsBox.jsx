import { CONFIG } from '../config.js';
import { inr, round2, monthsOf, cycleWord, planLabel } from '../pricing.js';
import AnimatedNumber from './AnimatedNumber.jsx';
import ModuleIcon from './ModuleIcon.jsx';
import Icon from './Icon.jsx';

/** Full-width dark order summary shown under the price table. */
export default function TotalsBox({ state, totals: t, onPay }) {
  const yearly = state.cycle === 'yearly';
  const cyc = cycleWord(state.cycle);
  const yearlySaving = round2(t.monthly * 12 * CONFIG.YEARLY_DISCOUNT);

  return (
    <div className="summary-card">
      <div className="sc-left">
        <div className="sc-head">
          <div>
            <span className="sc-title">Order summary</span>
            <span className="sc-meta">
              {t.items.length} {t.items.length === 1 ? 'item' : 'items'} · billed {yearly ? 'yearly' : 'monthly'}
            </span>
          </div>
          <span className="sc-plan">{planLabel(state)}</span>
        </div>

        {t.items.length ? (
          <ul className="sc-items">
            {t.items.map(([label, v, id, title, detail]) => (
              <li key={label}>
                {id ? <ModuleIcon id={id} /> : <ModuleIcon icon="tree" color="#34d399" />}
                <span className="sc-item-text">
                  <span className="sc-item-name">{title || label}</span>
                  {detail && <span className="sc-item-detail">{detail}</span>}
                </span>
                <span className="sc-item-v">{inr(v)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sc-empty">
            <Icon name="blocks" size={22} />
            <span>No modules selected yet. Add a module above to see your total.</span>
          </div>
        )}

        <div className="sc-lines">
          <div className="line">
            <span className="k">Subtotal{monthsOf(state.cycle) > 1 ? ` (${inr(t.monthly)} × 12)` : ''}</span>
            <AnimatedNumber className="v" value={t.subtotal} />
          </div>
          {t.discount > 0 && (
            <div className="line disc">
              <span className="k">Yearly discount (20%)</span>
              <AnimatedNumber className="v" prefix="− " value={t.discount} />
            </div>
          )}
          <div className="line">
            <span className="k">GST (18%)</span>
            <AnimatedNumber className="v" value={t.gst} />
          </div>
        </div>
      </div>

      <div className="sc-right">
        <div className="sc-total-box">
          <span className="sc-total-label">Total / {cyc}</span>
          <AnimatedNumber className="sc-total-v" value={t.total} />
          <div className="sc-permonth">
            {yearly && !t.empty ? `≈ ${inr(round2(t.total / 12))} / month incl. GST` : 'Incl. 18% GST'}
          </div>
          {!t.empty && (
            <div className={`sc-save ${yearly ? 'on' : ''}`}>
              <Icon name="sparkle" size={14} />
              {yearly
                ? `You're saving ${inr(t.discount)} with yearly billing`
                : `Switch to yearly and save ${inr(yearlySaving)}`}
            </div>
          )}
        </div>
        <div className="sc-actions">
          <button className="btn btn-pay" type="button" disabled={t.empty} onClick={onPay}>
            Pay Now <Icon name="arrow" size={16} />
          </button>
        </div>
        <p className="sc-secure">
          <Icon name="lock" size={13} /> Secure checkout · GST invoice included
        </p>
      </div>
    </div>
  );
}
