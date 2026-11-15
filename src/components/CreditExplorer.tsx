import { useRef, useState, type KeyboardEvent } from 'react';
import { products, type Currency } from '../data/products';

function CreditContent({ currency }: { currency: Currency }) {
  const product = products[currency];
  return <>
    <div className="credit-primary" aria-live="polite" aria-atomic="true">
      <span className="eyebrow">CRÉDITO PRIVADO / {currency}</span>
      <h3>{product.title}</h3><p className="credit-copy">{product.copy}</p>
      <div className="credit-amount"><span>{product.range || currency}</span>{product.range && <span className="currency-code">{currency}</span>}</div>
      <p className="credit-unit">{product.unit}</p>
      <a className="text-link" href="/#contacto" data-inquiry="financiamiento">Contáctanos <span aria-hidden="true">↗</span></a>
    </div>
    <div className="credit-details"><span className="eyebrow">ESTRUCTURADO A TU MEDIDA</span>
      <dl><div><dt>Enfoque</dt><dd>{product.focus}</dd></div>
        <div><dt>Alcance</dt><dd>{product.geography}</dd></div>
        <div><dt>Dirigido a</dt><dd>{product.audience}</dd></div></dl>
      <p className="small-note">Créditos flexibles y a la medida, principalmente con garantía fiduciaria. Condiciones sujetas a análisis y aprobación.</p>
    </div>
  </>;
}

export default function CreditExplorer() {
  const [currency, setCurrency] = useState<Currency>('MXN');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const currencies: Currency[] = ['MXN', 'USD'];
  function onKey(event: KeyboardEvent, index: number) {
    let target: number | undefined;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') target = 1 - index;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = 1;
    if (target === undefined) return;
    event.preventDefault();
    setCurrency(currencies[target]);
    tabs.current[target]?.focus();
  }
  return <div className="credit-explorer">
    <div className="currency-tabs" role="tablist" aria-label="Moneda del financiamiento">
      {currencies.map((code, index) => <button key={code} ref={(el) => { tabs.current[index] = el; }}
        id={`tab-${code}`} role="tab" type="button" aria-selected={currency === code} aria-controls="credit-panel"
        tabIndex={currency === code ? 0 : -1} onClick={() => setCurrency(code)} onKeyDown={(e) => onKey(e, index)}>
        <span>0{index + 1}</span>{products[code].tab}<small>{code}</small><span className="tab-arrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div className="credit-panel" role="tabpanel" id="credit-panel" aria-labelledby={`tab-${currency}`} tabIndex={0}>
      <CreditContent currency={currency} />
    </div>
    <noscript><div className="credit-panel no-js-credit"><CreditContent currency="USD" /></div></noscript>
  </div>;
}
