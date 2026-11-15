import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { media } from '../src/data/media.mjs';

for (const item of media) {
  try {
    const existing = await readFile(item.path);
    if (existing.length > 1000 && existing[0] === 0xff && existing[1] === 0xd8) {
      console.log(`Already downloaded: ${item.path}`);
      continue;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const response = await fetch(item.url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Image download failed (${response.status}): ${item.name}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`Expected JPEG: ${item.name}`);
  await mkdir(dirname(item.path), { recursive: true });
  await writeFile(item.path, bytes);
  console.log(`Downloaded ${item.path} (${bytes.length} bytes)`);
}
