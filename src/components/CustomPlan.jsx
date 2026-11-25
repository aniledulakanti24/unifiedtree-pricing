import Icon from './Icon.jsx';

/** Custom plan — no fixed price; routes the visitor to sales. */
export default function CustomPlan({ onSales }) {
  return (
    <section className="card custom-card step-in" aria-labelledby="customTitle">
      <div className="custom-body">
        <span className="launch"><Icon name="sparkle" size={13} /> Tailored for you</span>
        <h2 id="customTitle">Custom plan</h2>
        <p className="custom-sub">
          Large team, special workflows or a unique mix of modules? We'll put together a plan and price that fits your business.
        </p>
        <ul className="custom-list">
          <li>Any combination of modules, priced for your scale</li>
          <li>Volume pricing for large teams and multiple organisations</li>
          <li>Custom integrations, data migration and onboarding</li>
          <li>Dedicated account manager and priority support</li>
        </ul>
        <div className="custom-cta">
          <button className="btn btn-primary" type="button" onClick={onSales}>
            Talk to Sales <Icon name="arrow" size={16} />
          </button>
          <span className="custom-note">We usually reply within one business day.</span>
        </div>
      </div>
    </section>
  );
}
