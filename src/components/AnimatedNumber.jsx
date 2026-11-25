import { useEffect, useRef, useState } from 'react';
import { inr, reduceMotion } from '../pricing.js';

/** Shows a rupee amount that counts to its new value and pops when it changes. */
export default function AnimatedNumber({ value, prefix = '', className = '' }) {
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);
  const ref = useRef(null);

  useEffect(() => {
    const from = shown.current;
    const to = value;
    if (from === to) return;
    if (reduceMotion) {
      shown.current = to;
      setDisplay(to);
      return;
    }
    const el = ref.current;
    if (el) {
      el.classList.remove('bump');
      void el.offsetWidth; // restart the CSS animation
      el.classList.add('bump');
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 600);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = p < 1 ? Math.round(from + (to - from) * eased) : to;
      shown.current = v;
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span ref={ref} className={`num-anim ${className}`}>
      {prefix}
      {inr(display)}
    </span>
  );
}
