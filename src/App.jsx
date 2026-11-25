import { useState } from 'react';
import { computeTotals, initialState, clampQty, inr } from './pricing.js';
import { CONFIG } from './config.js';
import Hero from './components/Hero.jsx';
import SegToggle from './components/SegToggle.jsx';
import PlanCards from './components/PlanCards.jsx';
import PricingCard from './components/PricingCard.jsx';
import CustomPlan from './components/CustomPlan.jsx';
import TrustStrip from './components/TrustStrip.jsx';
import PayModal from './components/PayModal.jsx';
import SalesModal from './components/SalesModal.jsx';

const lowestModule = Math.min(...CONFIG.individual.map((m) => m.price));

const modById = (id) => CONFIG.enterprise.modules.find((m) => m.id === id);
const minExtra = Math.min(...CONFIG.individual.filter((m) => m.extraPrice).map((m) => m.extraPrice));
const entSaving = CONFIG.enterprise.mrp - CONFIG.enterprise.price;

const PLAN_OPTIONS = [
  {
    value: 'individual',
    icon: 'blocks',
    label: 'Individual Modules',
    desc: 'Start small with only the tools your team needs today, and add more as you grow.',
    price: `From ${inr(lowestModule)}`,
    per: '/ month',
    features: [
      `HRMS at ${inr(lowestModule)} per employee`,
      'Every module includes 1 admin + 2 users',
      `Extra access from ${inr(minExtra)} / month`,
    ],
    cta: 'Build your own',
  },
  {
    value: 'enterprise',
    icon: 'tree',
    label: 'Enterprise',
    desc: `The complete UnifiedTree suite: all ${CONFIG.enterprise.modules.length} modules with bigger limits, for one flat price.`,
    mrp: inr(CONFIG.enterprise.mrp),
    price: inr(CONFIG.enterprise.price),
    per: '/ month',
    tag: `Launch offer · Save ${inr(entSaving)}/mo`,
    features: [
      `HRMS for ${modById('hrms').included} + CRM for ${modById('crm').included}`,
      'Accounting, Manufacturing, Marketing & more',
      `Extra users from ${inr(Math.min(...CONFIG.enterprise.modules.filter((m) => m.extraPrice).map((m) => m.extraPrice)))} / month`,
    ],
    cta: 'Get the full suite',
  },
  {
    value: 'custom',
    icon: 'sliders',
    label: 'Custom',
    desc: 'For larger teams and multi-company setups that need a plan built around them.',
    price: "Let's talk",
    features: ['Volume pricing for large teams', 'Data migration & custom integrations', 'Dedicated account manager'],
    cta: 'Talk to sales',
  },
];
const CYCLE_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly', badge: 'Save 20%' },
];

export default function App() {
  const [state, setState] = useState(initialState);
  const [modal, setModal] = useState(null); // 'pay' | 'sales' | 'support' | null

  const totals = computeTotals(state);
  const isCustom = state.plan === 'custom';

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const togglePick = (id) =>
    setState((s) => ({ ...s, individual: { ...s.individual, [id]: { ...s.individual[id], on: !s.individual[id].on } } }));

  const setQty = (plan, id, val, field = 'qty') =>
    setState((s) => ({ ...s, [plan]: { ...s[plan], [id]: { ...s[plan][id], [field]: clampQty(plan, id, val, field) } } }));

  const removeModule = (id) =>
    setState((s) => ({ ...s, individual: { ...s.individual, [id]: { ...s.individual[id], on: false } } }));

  return (
    <>
      <div className="bg-deco" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="wrap">
        <Hero />

        <div className="controls reveal" style={{ '--d': '.24s' }}>
          <PlanCards options={PLAN_OPTIONS} value={state.plan} yearly={state.cycle === 'yearly'} onChange={(plan) => update({ plan })} />
          {!isCustom && (
            <SegToggle label="Billing" options={CYCLE_OPTIONS} value={state.cycle} onChange={(cycle) => update({ cycle })} />
          )}
        </div>

        <div className="reveal" style={{ '--d': '.32s' }}>
          {isCustom ? (
            <CustomPlan onSales={() => setModal('sales')} />
          ) : (
            <PricingCard
              key={state.plan}
              state={state}
              totals={totals}
              onQty={setQty}
              onRemove={removeModule}
              onAdd={togglePick}
              onPay={() => setModal('pay')}
              onSupport={() => setModal('support')}
            />
          )}
        </div>

        <TrustStrip />
      </div>

      <PayModal open={modal === 'pay'} onClose={() => setModal(null)} state={state} totals={totals} />
      <SalesModal open={modal === 'sales'} onClose={() => setModal(null)} state={state} totals={totals} />
      <SalesModal
        open={modal === 'support'}
        onClose={() => setModal(null)}
        state={state}
        totals={totals}
        variant={state.plan === 'enterprise' ? 'dedicated' : 'support'}
      />
    </>
  );
}
