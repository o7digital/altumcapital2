"""Export the supplied standalone reference with local photographs and fonts embedded.

The interactive Astro site is built separately with npm run build. This portable
HTML retains the original reference's JavaScript and uses the current site CSS.
"""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parent.parent


def data_uri(path: Path, mime: str) -> str:
    if not path.is_file():
        raise SystemExit(f"Missing {path.relative_to(ROOT)}. Run npm install and npm run assets first.")
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


html = (ROOT / 'docs/reference/AltumCapital_V2_Preview.html').read_text()
html = html.replace('El capital es el comienzo.<br />La visión', 'El capital es el comienzo.<br /> La visión')
for word in ['Análisis', 'Estructuras', 'Relaciones']:
    html = html.replace(word + '<br /><em>', word + '<br /> <em>')
css = (ROOT / 'src/styles/global.css').read_text()
fonts = (ROOT / 'src/styles/fonts.css').read_text()
fonts = re.sub(
    r"url\('(@fontsource-variable/[^']+)'\)",
    lambda match: "url('" + data_uri(ROOT / 'node_modules' / match[1], 'font/woff2') + "')",
    fonts,
)
html = re.sub(r'<style>.*?</style>', lambda _: '<style>' + fonts + '\n' + css + '</style>', html, count=1, flags=re.S)
html = re.sub(r'<link[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com|images\.unsplash\.com)[^>]*>', '', html)
names = iter(['hero', 'firm', 'investors'])
html = re.sub(
    r'src="https://images\.unsplash\.com/[^"]+"',
    lambda _: 'src="' + data_uri(ROOT / 'public/images' / f'{next(names)}.jpg', 'image/jpeg') + '"',
    html,
)
html = html.replace('</body>', '<noscript><style>.hero-media img,.firm-image img,.investor-landscape img{opacity:1}</style></noscript></body>')
output = ROOT / 'artifacts/AltumCapital_V2_Preview.html'
output.parent.mkdir(exist_ok=True)
output.write_text(html)
print(f'Exported {output} ({output.stat().st_size:,} bytes)')
