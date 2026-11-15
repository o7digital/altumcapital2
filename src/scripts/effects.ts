const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLImageElement>('.hero-media img,.firm-image img,.investor-landscape img').forEach((img) => {
  const loaded = () => img.parentElement?.classList.add('photo-loaded');
  if (img.complete && img.naturalWidth) loaded();
  else img.addEventListener('load', loaded, { once: true });
});

if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-seen');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.section-top,.manifesto-heading,.manifesto-grid,.solutions-heading,.credit-explorer,.investor-layout,.approach-grid,.contact-invitation').forEach((el) => {
    el.classList.add('motion-ready');
    observer.observe(el);
  });
}
