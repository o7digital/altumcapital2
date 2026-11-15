export const products = {
  MXN: {
    tab: 'Capital en pesos', title: 'El impulso que tu empresa necesita.', range: '75—250', unit: 'millones de pesos',
    geography: 'México', audience: 'Empresas, instituciones financieras no bancarias y fondos de capital privado.',
    copy: 'Estructuramos financiamiento en moneda local alrededor de las necesidades, los activos y la siguiente etapa de tu negocio.',
  },
  USD: {
    tab: 'Capital en dólares', title: 'Una visión que cruza fronteras.', range: '5—20', unit: 'millones de dólares',
    geography: 'México y Latinoamérica', audience: 'Empresas con ingresos referenciados en dólares y visión de crecimiento internacional.',
    copy: 'Financiamiento en dólares para acompañar oportunidades de crecimiento y necesidades de capital de empresas con ingresos en esta moneda.',
  },
} as const;
export type Currency = keyof typeof products;
