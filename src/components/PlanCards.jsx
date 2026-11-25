import Icon from './Icon.jsx';

/** Full-width row of plan cards (Individual / Enterprise / Custom). Acts as a radio group. */
export default function PlanCards({ options, value, onChange, yearly }) {
  const onKey = (e, i) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + options.length) % options.length;
    onChange(options[n].value);
    e.currentTarget.parentElement.children[n].focus();
  };

  return (
    <div className="ctl ctl-plan">
      <span className="ctl-label" id="planLabel">Choose a plan</span>
      <div className="plan-cards" role="radiogroup" aria-labelledby="planLabel">
        {options.map((o, i) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              className={`plan-card pc-${o.value} ${on ? 'active' : ''}`}
              title={o.desc}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {o.tag && <span className="pc-tag">{o.tag}</span>}
              <span className="pc-icon" aria-hidden="true">
                <Icon name={o.icon} size={18} />
              </span>
              <span className="pc-body">
                <span className="pc-name">{o.label}</span>
                <span className="pc-price">
                  {o.mrp && <s className="pc-mrp">{o.mrp}</s>}
                  <span className="pc-amount">{o.price}</span>
                  {o.per && <span className="pc-per">{o.per}</span>}
                </span>
              </span>
              <span className="pc-radio" aria-hidden="true">
                {on && <Icon name="check" size={12} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
