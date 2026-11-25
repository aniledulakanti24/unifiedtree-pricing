/* ===================== CONFIG — edit prices here ===================== */
export const CONFIG = {
  GST_RATE: 0.18,
  YEARLY_DISCOUNT: 0.2,
  SALES_EMAIL: 'sales@unifiedtree.com', // TODO: confirm sales inbox
  PAYMENT_URL: '', // TODO: set checkout / payment gateway URL

  enterprise: {
    mrp: 24999,
    price: 9999, // launch offer, per month
    extraPrice: 99, // per extra access / employee, per month
    modules: [
      { id: 'hrms', name: 'HRMS', included: '30 employees', extraLabel: 'employees' },
      { id: 'crm', name: 'CRM', included: '5 members', extraLabel: 'members' },
      { id: 'accounting', name: 'Accounting', included: '5 access + 1 org', extraLabel: 'access' },
      { id: 'manufacturing', name: 'Manufacturing', included: '5 access', extraLabel: 'access' },
      { id: 'marketing', name: 'Marketing', included: '1 number + 1 org', extraLabel: 'access' },
      { id: 'docuchat', name: 'Docuchat', included: '5 access + 10 GB storage', extraLabel: 'access' },
    ],
  },

  // 3 access = 1 admin + 2 others
  individual: [
    { id: 'hrms', name: 'HRMS', perUnit: true, price: 99, unitLabel: 'employees', defaultQty: 10, desc: 'Billed per employee' },
    { id: 'crm', name: 'CRM', price: 1499, included: '3 access', extraPrice: 199, extraLabel: 'access' },
    { id: 'accounting', name: 'Accounting', price: 499, included: '3 access + 1 org', extraPrice: 99, extraLabel: 'access' },
    { id: 'manufacturing', name: 'Manufacturing', price: 1999, included: '3 access', extraPrice: 299, extraLabel: 'access' },
    { id: 'marketing', name: 'Marketing', price: 999, included: '3 access + 1 number', extraPrice: 99, extraLabel: 'access' },
    { id: 'docuchat', name: 'Docuchat', price: 499, included: '3 access + 5 GB storage', extraPrice: 99, extraLabel: 'access' },
  ],
};

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
