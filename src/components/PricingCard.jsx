import { CONFIG, TAGLINES } from '../config.js';
import { inr, round2, monthsOf, cycleWord, individualRows, enterpriseRows, minQty } from '../pricing.js';
import ModuleIcon from './ModuleIcon.jsx';
import Icon from './Icon.jsx';
import Stepper from './Stepper.jsx';
import AnimatedNumber from './AnimatedNumber.jsx';
import TotalsBox from './TotalsBox.jsx';

/** Step 2 (individual) or the Enterprise plan — the price table plus totals. */
export default function PricingCard({ state, totals, onQty, onRemove, onAdd, onPay, onSales }) {
  const m = monthsOf(state.cycle);
  const cyc = cycleWord(state.cycle);
  const isEnt = state.plan === 'enterprise';

  return (
    <div className="checkout step-in">
    <section className="card" aria-live="polite">
      <div className="card-head animate">{isEnt ? <EnterpriseHead m={m} cyc={cyc} /> : <IndividualHead state={state} />}</div>

      <div className="table-wrap">
        <table className="price-table">
          <colgroup>
            <col className="c-mod" />
            <col className="c-price" />
            <col className="c-def" />
            <col className="c-add" />
            <col className="c-total" />
          </colgroup>
          <thead>
            <tr>
              <th>Module</th>
              <th className="num">Price</th>
              <th>Default</th>
              <th>Additional</th>
              <th className="num">Total / {cyc}</th>
            </tr>
          </thead>
          <tbody className="animate">
            {isEnt ? (
              <EnterpriseRows state={state} m={m} cyc={cyc} onQty={onQty} />
            ) : (
              <IndividualRows state={state} m={m} cyc={cyc} onQty={onQty} onRemove={onRemove} onAdd={onAdd} />
            )}
          </tbody>
        </table>
      </div>

      <Notes isEnt={isEnt} />
    </section>
    <aside className="side">
      <TotalsBox state={state} totals={totals} onPay={onPay} onSales={onSales} />
    </aside>
    </div>
  );
}

function IndividualHead({ state }) {
  const count = individualRows(state).filter((r) => r.s.on).length;
  return (
    <div>
      <h2>
        Build your plan <span className="count-chip">{count} of {CONFIG.individual.length} selected</span>
      </h2>
      <p>Click “+ Add module” on the modules you need, then add extra access or employees. Every module includes 3 access (1 admin + 2 others).</p>
    </div>
  );
}

function EnterpriseHead({ m, cyc }) {
  const E = CONFIG.enterprise;
  const now = round2(E.price * m * (m > 1 ? 1 - CONFIG.YEARLY_DISCOUNT : 1));
  return (
    <>
      <div>
        <span className="launch"><Icon name="sparkle" size={13} /> Launch offer</span>
        <h2>Enterprise</h2>
        <p>All 6 modules in one plan. Add more access or employees any time.</p>
      </div>
      <div className="offer">
        <span className="mrp">{inr(E.mrp * m)}</span>
        <AnimatedNumber className="now" value={now} />
        <span className="per">
          / {cyc}
          {m > 1 ? ' after 20% off' : ''} + 18% GST
        </span>
        <span className="save-chip">You save {inr((E.mrp - E.price) * m)}</span>
      </div>
    </>
  );
}

function IndividualRows({ state, m, cyc, onQty, onRemove, onAdd }) {
  // Chosen modules first, then the rest shown masked with an "Add" button.
  const rows = individualRows(state);
  const ordered = [...rows.filter((r) => r.s.on), ...rows.filter((r) => !r.s.on)];
  return ordered.map(({ m: mod, s, monthly }, i) =>
    !s.on ? (
      <tr key={mod.id} className="masked" style={{ '--i': i }} onClick={() => onAdd(mod.id)} title={`Add ${mod.name}`}>
        <td>
          <div className="mod">
            <ModuleIcon id={mod.id} />
            <span>
              <span className="mod-name">{mod.name}</span>
              <div className="mod-desc">{TAGLINES[mod.id]}</div>
            </span>
          </div>
        </td>
        <td className="num mask">
          {inr(mod.price * m)}
          <div className="rate">
            {mod.perUnit ? 'per employee' : 'base'} / {cyc}
          </div>
        </td>
        <td className="mask">
          <span className="pill">{mod.perUnit ? 'Per employee' : mod.included}</span>
        </td>
        <td>
          <button type="button" className="add-btn" onClick={(e) => { e.stopPropagation(); onAdd(mod.id); }}>
            + Add module
          </button>
        </td>
        <td className="num">
          <span className="zero">—</span>
        </td>
      </tr>
    ) : (
      <tr key={mod.id} style={{ '--i': i }}>
        <td>
          <div className="mod">
            <ModuleIcon id={mod.id} />
            <span>
              <span className="mod-name">{mod.name}</span>
              <div className="mod-desc">{TAGLINES[mod.id]}</div>
            </span>
            <button type="button" className="rm" aria-label={`Remove ${mod.name}`} title="Remove" onClick={() => onRemove(mod.id)}>
              ×
            </button>
          </div>
        </td>
        <td className="num">
          {inr(mod.price * m)}
          <div className="rate">
            {mod.perUnit ? 'per employee' : 'base'} / {cyc}
          </div>
        </td>
        <td>
          <span className="pill">{mod.perUnit ? 'Per employee' : mod.included}</span>
        </td>
        <td>
          <Stepper value={s.qty} min={minQty('individual', mod.id)} onChange={(v) => onQty('individual', mod.id, v)} />
          <div className="rate">
            {mod.perUnit ? `No. of ${mod.unitLabel}` : `${inr(mod.extraPrice * m)} each / ${cyc}`}
          </div>
        </td>
        <td className="num">
          <strong className={monthly ? '' : 'zero'}>
            <AnimatedNumber value={monthly * m} />
          </strong>
        </td>
      </tr>
    ),
  );
}

function EnterpriseRows({ state, m, cyc, onQty }) {
  const E = CONFIG.enterprise;
  return (
    <>
      <tr className="base-row" style={{ '--i': 0 }}>
        <td>
          <div className="mod">
            <ModuleIcon icon="tree" color="#0f8a5f" />
            <span>
              <span className="mod-name">Enterprise suite</span>
              <div className="mod-desc">HRMS, CRM, Accounting, Manufacturing, Marketing, Docuchat</div>
            </span>
          </div>
        </td>
        <td className="num">
          {inr(E.price * m)}
          <div className="rate">
            <s>{inr(E.mrp * m)}</s> / {cyc}
          </div>
        </td>
        <td>
          <span className="pill">All modules</span>
        </td>
        <td>—</td>
        <td className="num">
          <strong>
            <AnimatedNumber value={E.price * m} />
          </strong>
        </td>
      </tr>
      {enterpriseRows(state).map(({ m: mod, s, monthly }, i) => (
        <tr key={mod.id} style={{ '--i': i + 1 }}>
          <td>
            <div className="mod">
              <ModuleIcon id={mod.id} />
              <span>
                <span className="mod-name">{mod.name}</span>
                <div className="mod-desc">{TAGLINES[mod.id]}</div>
              </span>
            </div>
          </td>
          <td className="num">Included</td>
          <td>
            <span className="pill">{mod.included}</span>
          </td>
          <td>
            <Stepper value={s.qty} min={0} onChange={(v) => onQty('enterprise', mod.id, v)} />
            <div className="rate">
              {inr(E.extraPrice * m)} each / {cyc}
            </div>
          </td>
          <td className="num">
            <strong className={monthly ? '' : 'zero'}>
              <AnimatedNumber value={monthly * m} />
            </strong>
          </td>
        </tr>
      ))}
    </>
  );
}

function Notes({ isEnt }) {
  const E = CONFIG.enterprise;
  return (
    <div className="notes card-foot">
      <strong>Good to know</strong>
      <ul>
        {isEnt ? (
          <>
            <li>
              Launch price {inr(E.price)}/month instead of {inr(E.mrp)}/month.
            </li>
            <li>Extra access or employees: {inr(E.extraPrice)} each per month, on any module.</li>
          </>
        ) : (
          <>
            <li>3 access = 1 admin + 2 other users, included with every module.</li>
            <li>HRMS is billed at {inr(99)} per employee per month.</li>
          </>
        )}
        <li>Yearly billing saves 20% compared to paying monthly.</li>
        <li>18% GST is added on all plans.</li>
      </ul>
    </div>
  );
}
