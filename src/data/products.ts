export const products = {
  MXN: {
    tab: 'Capital en pesos', title: 'Altum Capital Pesos', range: '75—500', unit: 'millones de pesos',
    geography: 'México y Latinoamérica', audience: 'Pymes, Instituciones Financieras no Bancarias y Fondos de Capital Privado.',
    focus: 'Todas las industrias y sectores con activos fácilmente monetizables.',
    copy: 'Enfoque de inversión en deuda privada en pesos mediante el otorgamiento de crédito estructurado a todas las industrias y sectores con activos fácilmente monetizables.',
  },
  USD: {
    tab: 'Capital en dólares', title: 'Altum Capital Dólares', range: '', unit: 'crédito estructurado en dólares',
    geography: 'México y Latinoamérica', audience: 'Pymes, Instituciones Financieras no Bancarias y Fondos de Capital Privado.',
    focus: 'Todas las industrias y sectores con ingresos referenciados a dólares.',
    copy: 'Enfoque de inversión en deuda privada en dólares mediante el otorgamiento de crédito estructurado a todas las industrias y sectores con ingresos referenciados a dólares.',
  },
} as const;
export type Currency = keyof typeof products;
