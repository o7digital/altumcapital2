import { useEffect, useRef, useState } from 'react';
import Brand from './Brand';
import { navigation } from '../data/site';

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
    function onResize() { if (window.innerWidth > 1024) setOpen(false); }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return <header ref={header} className={`site-header${open ? ' menu-open' : ''}`}>
    <a className="brand" href="/#inicio" aria-label="Altum Capital, inicio" onClick={() => setOpen(false)}><Brand /></a>
    <nav className="desktop-nav" aria-label="Navegación principal">
      {navigation.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
    </nav>
    <a className="header-contact" href="/#contacto">Contáctanos <span aria-hidden="true">↗</span></a>
    <button ref={toggle} type="button" className="menu-toggle" aria-controls="mobile-nav" aria-expanded={open}
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'} disabled={!ready} onClick={() => setOpen(!open)}>
      <span /><span />
    </button>
    <nav ref={menu} id="mobile-nav" className="mobile-nav" hidden={!open} aria-label="Navegación móvil">
      <span className="eyebrow">DEUDA PRIVADA / MÉXICO Y LATINOAMÉRICA</span>
      {[...navigation, { href: '/#contacto', mobile: 'Contacto' }].map((link, index) =>
        <a key={link.href} href={link.href} onClick={() => setOpen(false)}><small>0{index + 1}</small>{link.mobile}<span aria-hidden="true">↗</span></a>)}
      <p>Financiamiento en MXN y USD.</p>
    </nav>
  </header>;
}
