export default function Hero() {
  return (
    <header className="hero">
      <div className="logo reveal">
        <span className="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2 5 11h4l-4 6h6v5h2v-5h6l-4-6h4L12 2Z" fill="currentColor" />
          </svg>
        </span>
        UnifiedTree
      </div>
      <div className="announce reveal" style={{ '--d': '.04s' }}>
        <span className="announce-tag">New</span> Launch offer: Enterprise at ₹9,999/month <s>₹24,999</s>
      </div>
      <h1 className="reveal" style={{ '--d': '.08s' }}>
        Simple, <span className="grad">transparent</span> pricing
      </h1>
      <p className="sub reveal" style={{ '--d': '.16s' }}>
        Pick only the modules you need, unlock the whole suite with Enterprise, or let us tailor a plan for you. Save 20% when you pay yearly.
      </p>
    </header>
  );
}
