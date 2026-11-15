import { useEffect, useRef, useState } from 'react';
import Brand from './Brand';

const links = [
  ['firma', 'La firma'], ['soluciones', 'Financiamiento'],
  ['inversionistas', 'Inversionistas'], ['enfoque', 'Nuestro enfoque'],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu.current?.querySelector('a')?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const elements = header.current?.querySelectorAll<HTMLElement>('.brand,.menu-toggle,.mobile-nav a');
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    }
    function onResize() { if (window.innerWidth > 900) setOpen(false); }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return <header ref={header} className={`site-header${open ? ' menu-open' : ''}`}>
    <a className="brand" href="#inicio" aria-label="Altum Capital, inicio" onClick={() => setOpen(false)}><Brand /></a>
    <nav className="desktop-nav" aria-label="Navegación principal">
      {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    <a className="header-contact" href="#contacto">Conversemos <span aria-hidden="true">↗</span></a>
    <button ref={toggle} type="button" className="menu-toggle" aria-controls="mobile-nav" aria-expanded={open}
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'} disabled={!ready} onClick={() => setOpen(!open)}>
      <span /><span />
    </button>
    <nav ref={menu} id="mobile-nav" className="mobile-nav" hidden={!open} aria-label="Navegación móvil">
      <span className="eyebrow">UNA PERSPECTIVA DIFERENTE</span>
      {[...links, ['contacto', 'Conversemos']].map(([id, label], index) =>
        <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}<span aria-hidden="true">↗</span></a>)}
      <p>Capital privado. Visión de largo plazo.</p>
    </nav>
  </header>;
}
