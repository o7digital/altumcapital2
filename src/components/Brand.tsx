import source from '../data/source-pages.json';

export default function Brand({ dark = false }: { dark?: boolean }) {
  const logo = source.logos.find(logo => dark ? logo.local.endsWith('/altum-logo.png') : logo.local.endsWith('/logo-altum-blanco.png'))!;
  return <img className="original-brand" src={logo.local} data-source-src={logo.source} alt="Altum Capital" width="200" height="66" />;
}
