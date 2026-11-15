// Editorial explanations of the six uses listed by the client. No new lending terms.
export const creditUses = [
  { title:'Capital de crecimiento', description:'Recursos para acompañar los proyectos de expansión de la empresa y financiar su siguiente etapa de crecimiento.' },
  { title:'Capital de trabajo', description:'Financiamiento de las necesidades de la operación y del ciclo de negocio de la empresa.' },
  { title:'Refinanciamiento', description:'Recursos destinados a sustituir financiamientos existentes, dentro de una estructura de crédito ajustada a las necesidades de la empresa.' },
  { title:'Adquisiciones de empresas', description:'Financiamiento para operaciones de adquisición de empresas, como parte de una estrategia de crecimiento.' },
  { title:'Recapitalizaciones y pago de dividendos', description:'Soluciones de crédito para operaciones de recapitalización de la empresa y pago de dividendos a sus accionistas.' },
  { title:'Leveraged Buy Outs (LBOs) y Management Buy Outs (MBOs)', description:'Financiamiento para adquisiciones apalancadas y operaciones de compra de la empresa por parte de su equipo directivo.' },
];
// Facts restated from dated publications in the cloned client site. Source links
// remain visible so historical figures cannot be mistaken for current balances.
export const milestones = [
  { year:'2014', title:'El origen de Altum Capital', text:'Gerardo Legorreta y Miguel Gómez, exejecutivos de UBS, fundan Altum Capital para atender las necesidades de financiamiento de empresas medianas en México.', slug:'altum-capital-decimo-aniversario', date:'29 de agosto de 2024' },
  { year:'2019 / 2022', title:'Acceso al mercado de capitales', text:'La firma realiza dos colocaciones de certificados de capital de desarrollo (CKDs), que forman parte de su trayectoria en la Bolsa Institucional de Valores.', slug:'altum-capital-continua-su-expansion-con-tercera-emision-de-517-mdp-en-biva', date:'22 de octubre de 2024' },
  { year:'2024', title:'Tercera emisión en BIVA', text:'Altum Capital anuncia una tercera emisión de certificados bursátiles fiduciarios por 517 millones de pesos. Los recursos se destinan a su fondo evergreen, existente desde 2014.', slug:'altum-capital-continua-su-expansion-con-tercera-emision-de-517-mdp-en-biva', date:'22 de octubre de 2024' },
  { year:'2025', title:'Financiamiento sostenible con NADBank', text:'El 26 de junio de 2025, Altum anuncia el cierre de un préstamo verde por 200 millones de pesos con NADBank, destinado a proyectos de sostenibilidad en la región fronteriza de México.', slug:'nad-bank-green-loan-altum', date:'26 de junio de 2025' },
];
export const articleSummaries: Record<string,string> = {
  'nad-bank-green-loan-altum':'El 26 de junio de 2025, Altum Capital anunció un préstamo verde por 200 millones de pesos con NADBank para financiar proyectos de eficiencia energética, ahorro de agua y reducción de emisiones y residuos en la región fronteriza de México.',
  'altum-capital-continua-su-expansion-con-tercera-emision-de-517-mdp-en-biva':'En octubre de 2024, la firma anunció su tercera emisión de certificados bursátiles fiduciarios en BIVA, por 517 millones de pesos, para continuar su estrategia de créditos estructurados y garantizados a empresas medianas.',
  'altum-capital-decimo-aniversario':'Fundada en 2014 por Gerardo Legorreta y Miguel Gómez, Altum Capital celebró en agosto de 2024 una década dedicada al financiamiento de empresas medianas en México.',
};
