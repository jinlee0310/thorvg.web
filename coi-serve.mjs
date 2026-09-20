// COOP/COEP static server for pthread wasm testing (SharedArrayBuffer).
// Serves the directory THIS FILE lives in (repo root), regardless of cwd.
// Run:   node coi-serve.mjs [port]
// Open:  http://localhost:8899/examples/benchmark-threads.html
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2]) || 8899;
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  try {
    const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
    const data = await readFile(join(root, rel || 'index.html'));
    res.writeHead(200, {
      'Content-Type': types[extname(rel)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    });
    res.end(data);
    console.log(`200 ${urlPath}`);
  } catch {
    res.writeHead(404);
    res.end('not found');
    console.log(`404 ${urlPath}`);
  }
}).listen(port, () => {
  console.log(`serving ${root}`);
  console.log(`http://localhost:${port}/examples/software.html`);
});
