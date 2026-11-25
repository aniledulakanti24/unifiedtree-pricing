import { CONFIG, extraText } from './config.js';

export const inr = (n) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const round2 = (n) => Math.round(n * 100) / 100;
export const monthsOf = (cycle) => (cycle === 'yearly' ? 12 : 1);
export const cycleWord = (cycle) => (cycle === 'yearly' ? 'year' : 'month');

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function initialState() {
  return {
    plan: 'individual',
    cycle: 'monthly',
    individual: Object.fromEntries(
      CONFIG.individual.map((m) => [m.id, { on: false, qty: m.perUnit ? m.defaultQty : 0, orgs: 0 }]),
    ),
    enterprise: Object.fromEntries(CONFIG.enterprise.modules.map((m) => [m.id, { qty: 0, orgs: 0 }])),
  };
}

export const minQty = (plan, id) =>
  plan === 'individual' && CONFIG.individual.find((x) => x.id === id).perUnit ? 1 : 0;

export const clampQty = (plan, id, val, field = 'qty') =>
  Math.max(field === 'qty' ? minQty(plan, id) : 0, Math.min(100000, Math.floor(Number(val) || 0)));

const orgCost = (m, s) => (m.orgPrice ? m.orgPrice * s.orgs : 0);
const orgText = (s) => (s.orgs ? `+${s.orgs} org${s.orgs > 1 ? 's' : ''}` : '');
const joinParts = (...p) => p.filter(Boolean).join(', ');

/* ---------- pricing math (all base prices are monthly) ---------- */
export function individualRows(state) {
  return CONFIG.individual.map((m) => {
    const s = state.individual[m.id];
    const monthly = (m.perUnit ? m.price * s.qty : m.price + m.extraPrice * s.qty) + orgCost(m, s);
    return { m, s, monthly: s.on ? monthly : 0 };
  });
}

export function enterpriseRows(state) {
  return CONFIG.enterprise.modules.map((m) => {
    const s = state.enterprise[m.id];
    return { m, s, monthly: m.extraPrice * s.qty + orgCost(m, s) };
  });
}

export function computeTotals(state) {
  let monthly;
  let launch = 0; // monthly launch-offer discount (Enterprise)
  const items = [];
  if (state.plan === 'custom') {
    monthly = 0;
  } else if (state.plan === 'individual') {
    const rows = individualRows(state);
    monthly = rows.reduce((a, r) => a + r.monthly, 0);
    rows
      .filter((r) => r.s.on)
      .forEach((r) => {
        const adds = joinParts(r.m.perUnit ? '' : r.s.qty ? extraText(r.m, r.s.qty) : '', orgText(r.s));
        const detail = r.m.perUnit ? joinParts(`${r.s.qty} ${r.m.unitLabel}`, orgText(r.s)) : [r.m.included, adds].filter(Boolean).join(' · ');
        const short = r.m.perUnit ? ` (${r.s.qty} ${r.m.unitLabel})` : adds ? ` (${adds})` : '';
        // [label, amount, module id, title, detail]
        items.push([r.m.name + short, r.monthly, r.m.id, r.m.name, detail]);
      });
  } else {
    const rows = enterpriseRows(state);
    const E = CONFIG.enterprise;
    monthly = E.mrp + rows.reduce((a, r) => a + r.monthly, 0);
    launch = E.mrp - E.price;
    items.push(['Enterprise suite (all 6 modules)', E.mrp, null, 'Enterprise suite', 'All 6 modules included']);
    rows
      .filter((r) => r.s.qty || r.s.orgs)
      .forEach((r) => {
        const adds = joinParts(r.s.qty ? extraText(r.m, r.s.qty) : '', orgText(r.s));
        items.push([`${r.m.name} — ${adds}`, r.monthly, r.m.id, r.m.name, adds]);
      });
  }
  const m = monthsOf(state.cycle);
  const subtotal = monthly * m;
  const launchDiscount = launch * m;
  const net = subtotal - launchDiscount;
  const discount = state.cycle === 'yearly' ? round2(net * CONFIG.YEARLY_DISCOUNT) : 0;
  const taxable = round2(net - discount);
  const gst = round2(taxable * CONFIG.GST_RATE);
  const total = round2(taxable + gst);
  return {
    monthly, // per month, before the launch offer
    netMonthly: monthly - launch, // per month, after the launch offer
    subtotal,
    launchDiscount,
    discount,
    taxable,
    gst,
    total,
    items: items.map(([n, v, ...rest]) => [n, v * m, ...rest]),
    empty: monthly === 0,
  };
}

export const planLabel = (state) =>
  state.plan === 'custom' ? 'Custom' :
  (state.plan === 'enterprise' ? 'Enterprise' : 'Individual Modules') +
  ' · ' +
  (state.cycle === 'yearly' ? 'Yearly' : 'Monthly');

export function summaryText(state, t) {
  if (state.plan === 'custom') return 'Plan: Custom (pricing to be discussed with sales)';
  return [
    `Plan: ${planLabel(state)}`,
    ...t.items.map(([n, v]) => `- ${n}: ${inr(v)}`),
    `Subtotal: ${inr(t.subtotal)}`,
    t.launchDiscount ? `Offer: -${inr(t.launchDiscount)}` : '',
    t.discount ? `Yearly discount: -${inr(t.discount)}` : '',
    `GST (18%): ${inr(t.gst)}`,
    `Total: ${inr(t.total)} / ${cycleWord(state.cycle)}`,
  ]
    .filter(Boolean)
    .join('\n');
}
