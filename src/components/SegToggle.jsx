import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Pill toggle with a sliding highlight behind the active option. */
export default function SegToggle({ label, options, value, onChange }) {
  const btnRefs = useRef({});
  const [ind, setInd] = useState({ left: 4, width: 0 });

  const measure = () => {
    const el = btnRefs.current[value];
    if (!el) return;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    // Only update when the position really changed, so measuring never loops.
    setInd((cur) => (cur.left === next.left && cur.width === next.width ? cur : next));
  };

  useLayoutEffect(measure, [value]);
  useEffect(() => {
    let alive = true;
    const onResize = () => alive && measure();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
    };
  }, [value]);

  return (
    <div className="ctl">
    <span className="ctl-label" aria-hidden="true">{label}</span>
    <div className="seg" role="tablist" aria-label={label}>
      <span className="seg-ind" aria-hidden="true" style={{ left: ind.left, width: ind.width }} />
      {options.map((o) => (
        <button
          key={o.value}
          ref={(el) => (btnRefs.current[o.value] = el)}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          className={value === o.value ? 'active' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label} {o.badge && <span className="badge">{o.badge}</span>}
        </button>
      ))}
    </div>
    </div>
  );
}
