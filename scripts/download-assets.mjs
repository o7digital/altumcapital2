import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import source from '../src/data/source-pages.json' with { type: 'json' };
for (const asset of source.assets) {
  const path = `public${asset.local}`;
  let bytes;
  try { bytes = await readFile(path); } catch { /* Download missing source media. */ }
  if (!bytes) {
    const response = await fetch(asset.source, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Source image failed: ${asset.source}`);
    bytes = new Uint8Array(await response.arrayBuffer());
    await mkdir(path.slice(0,path.lastIndexOf('/')), { recursive:true });
    await writeFile(path,bytes);
  }
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Source media differs: ${path}`);
}
console.log(`Verified ${source.assets.length} original source media files.`);
