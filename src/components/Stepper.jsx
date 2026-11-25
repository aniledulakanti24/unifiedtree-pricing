import { useEffect, useState } from 'react';

/** − [qty] + control. Typed values are applied on blur or Enter. */
export default function Stepper({ value, min = 0, onChange }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    if (draft !== String(value)) onChange(draft);
  };

  return (
    <div className="stepper">
      <button type="button" aria-label="Decrease" disabled={value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        aria-label="Quantity"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
      />
      <button type="button" aria-label="Increase" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
