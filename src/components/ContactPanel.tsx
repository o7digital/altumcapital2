import { useEffect, useRef, useState, type SubmitEvent } from 'react';

export default function ContactPanel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLElement>('[data-inquiry]');
      if (!link || !dialog.current || !form.current) return;
      event.preventDefault();
      trigger.current = link;
      const purpose = form.current.elements.namedItem('purpose') as HTMLSelectElement;
      purpose.value = link.dataset.inquiry === 'inversion' ? 'inversion' : 'financiamiento';
      setStatus('');
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.current.showModal();
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function onClose() {
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus({ preventScroll: true });
  }
  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Consulta Altum — ${data.get('purpose') === 'inversion' ? 'Inversionistas' : 'Financiamiento'}`;
    const body = [`Nombre: ${data.get('name')}`, `Empresa: ${data.get('company')}`, `Correo: ${data.get('email')}`,
      `Interés: ${data.get('purpose')}`, '', String(data.get('message') || '')].join('\n');
    window.location.href = `mailto:contacto@altumcapital.com.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Se abrirá tu aplicación de correo. No se ha enviado información desde este sitio.');
  }
  return <dialog ref={dialog} className="contact-dialog" aria-labelledby="dialog-title" onClose={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <div className="dialog-inner">
      <button type="button" className="dialog-close" aria-label="Cerrar formulario" onClick={() => dialog.current?.close()}>×</button>
      <span className="eyebrow">EMPECEMOS UNA CONVERSACIÓN</span>
      <h2 id="dialog-title">Lo que sigue<br /><em>comienza aquí.</em></h2>
      <p className="dialog-intro">Cuéntanos un poco sobre ti y prepararemos un correo para el equipo de Altum.</p>
      <form ref={form} id="inquiry-form" onSubmit={onSubmit}>
        <label>Me interesa<select name="purpose" defaultValue="financiamiento"><option value="financiamiento">Financiamiento para mi empresa</option><option value="inversion">Información para inversionistas</option></select></label>
        <div className="form-grid"><label>Nombre<input name="name" autoComplete="name" required maxLength={120} /></label><label>Empresa<input name="company" autoComplete="organization" required maxLength={160} /></label></div>
        <label>Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
        <label>Tu proyecto<textarea name="message" rows={3} maxLength={2000} placeholder="¿Qué te gustaría construir?" /></label>
        <button type="submit" className="button button-dark">Preparar correo <span aria-hidden="true">↗</span></button>
        <p className="small-note">Prototipo sin backend. No almacena datos ni envía formularios. El envío se completa únicamente desde tu aplicación de correo.</p>
        <p className="form-status" role="status">{status}</p>
      </form>
    </div>
  </dialog>;
}
