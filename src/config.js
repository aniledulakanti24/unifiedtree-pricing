/* ===================== CONFIG — edit prices here ===================== */
export const CONFIG = {
  GST_RATE: 0.18,
  YEARLY_DISCOUNT: 0.2,
  SALES_EMAIL: 'sales@unifiedtree.com', // TODO: confirm sales inbox
  PAYMENT_URL: '', // TODO: set checkout / payment gateway URL
  SUPPORT_EMAIL: 'support@unifiedtree.com', // TODO: confirm support inbox

  // Extra prices are per month. `extraBlock` = the add-on is sold in blocks (Docuchat: ₹499 per 10 GB on Individual).
  // `orgPrice` = extra organizations can be added at this price each (same as the module's base price).
  enterprise: {
    mrp: 24999, // list price per month
    price: 9999, // launch offer price per month (the difference is shown as a discount in the order summary)
    modules: [
      { id: 'hrms', name: 'HRMS', included: '30 employees', extraPrice: 99, extraLabel: 'employees' },
      { id: 'crm', name: 'CRM', included: '5 members', extraPrice: 299, extraLabel: 'members' },
      { id: 'accounting', name: 'Accounting', included: '5 access + 1 org', extraPrice: 99, extraLabel: 'access', orgPrice: 499 },
      { id: 'manufacturing', name: 'Manufacturing', included: '5 access', extraPrice: 299, extraLabel: 'access' },
      { id: 'marketing', name: 'Marketing', included: '1 number + 1 org', extraPrice: 299, extraLabel: 'access', orgPrice: 999 },
      { id: 'docuchat', name: 'Docuchat', included: '5 access + 10 GB storage', extraPrice: 0 }, // no paid add-ons on Enterprise
    ],
  },

  // 3 access = 1 admin + 2 others
  individual: [
    { id: 'hrms', name: 'HRMS', perUnit: true, price: 99, unitLabel: 'employees', defaultQty: 10, desc: 'Billed per employee' },
    { id: 'crm', name: 'CRM', price: 1499, included: '3 access', extraPrice: 299, extraLabel: 'access' },
    { id: 'accounting', name: 'Accounting', price: 499, included: '3 access + 1 org', extraPrice: 99, extraLabel: 'access', orgPrice: 499 },
    { id: 'manufacturing', name: 'Manufacturing', price: 1999, included: '3 access', extraPrice: 299, extraLabel: 'access' },
    { id: 'marketing', name: 'Marketing', price: 999, included: '3 access + 1 number', extraPrice: 299, extraLabel: 'access', orgPrice: 999 },
    { id: 'docuchat', name: 'Docuchat', price: 499, included: '3 access + 5 GB storage', extraPrice: 499, extraLabel: 'GB storage', extraBlock: 10 },
  ],
};

/** Human text for an add-on quantity, e.g. "+2 access" or "+10 GB storage". */
export const extraText = (m, qty) => `+${qty * (m.extraBlock || 1)} ${m.extraLabel}`;
/** Rate text, e.g. "₹299 each" or "₹499 per 10 GB". */
export const extraRateUnit = (m) => (m.extraBlock ? `per ${m.extraBlock} GB` : 'each');

// Short one-line descriptions shown under each module name — edit freely.
export const TAGLINES = {
  hrms: 'Employees, attendance & payroll',
  crm: 'Leads, deals & customer pipeline',
  accounting: 'Invoices, expenses & books',
  manufacturing: 'Production, inventory & BOM',
  marketing: 'Campaigns & customer outreach',
  docuchat: 'Chat with your documents',
};

// [icon name from components/Icon.jsx, accent colour]
export const ICONS = {
  hrms: ['users', '#3b6ff5'],
  crm: ['target', '#f26b1d'],
  accounting: ['chart', '#0f9a6a'],
  manufacturing: ['factory', '#7c5cf0'],
  marketing: ['megaphone', '#e8467c'],
  docuchat: ['chat', '#0ea5c6'],
};
