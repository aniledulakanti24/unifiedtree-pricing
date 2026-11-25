import Icon from './Icon.jsx';

// [icon, title, subtitle, accent colour, second gradient colour]
const ITEMS = [
  ['lock', 'Secure payments', 'Encrypted checkout', '#0f9a6a', '#34d399'],
  ['receipt', 'GST invoice', 'Included with every bill', '#3b6ff5', '#60a5fa'],
  ['zap', 'Instant activation', 'Start in minutes', '#f59e0b', '#f97316'],
  ['support', 'Dedicated support', 'Real people, fast replies', '#8b5cf6', '#ec4899'],
];

export default function TrustStrip() {
  return (
    <div className="trust reveal" style={{ '--d': '.45s' }}>
      {ITEMS.map(([icon, title, sub, c, c2]) => (
        <div className="trust-item" key={title} style={{ '--c': c, '--c2': c2 }}>
          <i>
            <Icon name={icon} size={19} strokeWidth={2.1} />
          </i>
          <span>
            <b>{title}</b>
            <small>{sub}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
