import { CONFIG, TAGLINES, extraRateUnit } from '../config.js';
import { inr, monthsOf, cycleWord, individualRows, enterpriseRows, minQty } from '../pricing.js';
import ModuleIcon from './ModuleIcon.jsx';
import Stepper from './Stepper.jsx';
import AnimatedNumber from './AnimatedNumber.jsx';
import TotalsBox from './TotalsBox.jsx';

/** Step 2 (individual) or the Enterprise plan — the price table plus totals. */
export default function PricingCard({ state, totals, onQty, onRemove, onAdd, onPay, onSupport }) {
  const m = monthsOf(state.cycle);
  const cyc = cycleWord(state.cycle);
  const isEnt = state.plan === 'enterprise';

  return (
    <div className="checkout step-in">
    <section className="card" aria-live="polite">
      <div className="card-head animate">{isEnt ? <EnterpriseHead /> : <IndividualHead state={state} />}</div>

      <div className="table-wrap">
        <table className="price-table">
          <colgroup>
            <col className="c-mod" />
            <col className="c-price" />
            <col className="c-def" />
            <col className="c-add" />
            <col className="c-org" />
            <col className="c-total" />
          </colgroup>
          <thead>
            <tr>
              <th>Module</th>
              <th className="num">Price</th>
              <th>Default</th>
              <th>Additional</th>
              <th>Organization</th>
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
      <TotalsBox state={state} totals={totals} onPay={onPay} onSupport={onSupport} />
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
      <p>Click “+ Add module” on the modules you need, then add extra access, employees or organizations. Every module includes 3 access (1 admin + 2 others).</p>
    </div>
  );
}

function EnterpriseHead() {
  return (
    <>
      <div>
        <h2>Enterprise</h2>
        <p>All 6 modules in one plan. Add more access, employees or organizations any time.</p>
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
        <td>
          <span className="zero">—</span>
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
            {mod.perUnit ? `No. of ${mod.unitLabel}` : <ExtraRate mod={mod} qty={s.qty} m={m} cyc={cyc} />}
          </div>
        </td>
        <OrgCell plan="individual" mod={mod} s={s} m={m} cyc={cyc} onQty={onQty} />
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
          {inr(E.mrp * m)}
          <div className="rate">/ {cyc}</div>
        </td>
        <td>
          <span className="pill">All modules</span>
        </td>
        <td>
          <span className="zero">—</span>
        </td>
        <td>
          <span className="zero">—</span>
        </td>
        <td className="num">
          <strong>
            <AnimatedNumber value={E.mrp * m} />
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
          {mod.extraPrice ? (
            <td>
              <Stepper value={s.qty} min={0} onChange={(v) => onQty('enterprise', mod.id, v)} />
              <div className="rate">
                <ExtraRate mod={mod} qty={s.qty} m={m} cyc={cyc} />
              </div>
            </td>
          ) : (
            <td>
              <span className="zero" title={`No add-ons for ${mod.name} on Enterprise`}>—</span>
            </td>
          )}
          <OrgCell plan="enterprise" mod={mod} s={s} m={m} cyc={cyc} onQty={onQty} />
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

/** "5 access = 1 admin + 4 other users, included with Accounting, Manufacturing and Docuchat." — built from the config. */
function accessNotes(modules) {
  const groups = {};
  modules.forEach((m) => {
    const n = Number((m.included.match(/(\d+)\s+access/) || [])[1]);
    if (n) (groups[n] ||= []).push(m.name);
  });
  const list = (a) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0]);
  return Object.entries(groups).map(
    ([n, names]) => `${n} access = 1 admin + ${n - 1} other user${n - 1 === 1 ? '' : 's'}, included with ${list(names)}.`,
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
            {accessNotes(E.modules).map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>Extra users are priced per module.</li>
            <li>Extra organizations cost the same as the module: {orgPriceText()} per month each.</li>
          </>
        ) : (
          <>
            <li>3 access = 1 admin + 2 other users, included with every module.</li>
            <li>HRMS is billed at {inr(99)} per employee per month.</li>
            <li>Extra organizations cost the same as the module: {orgPriceText()} per month each.</li>
          </>
        )}
        <li>Yearly billing saves 20% compared to paying monthly.</li>
        <li>18% GST is added on all plans.</li>
      </ul>
    </div>
  );
}

/** "₹299 each / month" or "₹499 per 10 GB / month · +20 GB". */
function ExtraRate({ mod, qty, m, cyc }) {
  return (
    <>
      {inr(mod.extraPrice * m)} {extraRateUnit(mod)} / {cyc}
      {mod.extraBlock && qty > 0 ? ` · +${qty * mod.extraBlock} GB` : ''}
    </>
  );
}

/** "Accounting ₹499, Marketing ₹999" — from the config. */
const orgPriceText = () =>
  CONFIG.individual
    .filter((m) => m.orgPrice)
    .map((m) => `${m.name} ${inr(m.orgPrice)}`)
    .join(', ');

/** Organization stepper — only for modules that allow extra organizations. */
function OrgCell({ plan, mod, s, m, cyc, onQty }) {
  if (!mod.orgPrice) {
    return (
      <td>
        <span className="zero" title={`Organizations can't be added to ${mod.name}`}>—</span>
      </td>
    );
  }
  return (
    <td>
      <Stepper value={s.orgs} min={0} onChange={(v) => onQty(plan, mod.id, v, 'orgs')} />
      <div className="rate">
        {inr(mod.orgPrice * m)} per org / {cyc}
      </div>
    </td>
  );
}
