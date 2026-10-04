#!/usr/bin/env node
/**
 * KYPO6 — LOCAL PREVIEW SERVER (emulates a Cloudflare-Pages-style static host)
 * =============================================================================
 *   • serves files from the repo root
 *   • /dir  →  /dir/index.html   (and /dir → /dir/ redirect, like Pages)
 *   • applies `_redirects` 200 rewrites and 3xx redirects
 *   • any unmatched path → /404.html with HTTP 404
 *
 * Zero dependencies.  node scripts/dev-server.mjs [port]   (default 8080)
 * This is a test harness, not a production server.
 */
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, resolve, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

function loadRedirects() {
  const file = join(ROOT, '_redirects');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [source, destination, code = '302'] = l.split(/\s+/);
      return { source, destination, code: Number(code) };
    });
}

function matchRule(rule, pathname) {
  if (rule.source.endsWith('/*')) {
    const pre = rule.source.slice(0, -1);
    if (pathname.startsWith(pre)) return rule.destination.replace(':splat', pathname.slice(pre.length));
    return null;
  }
  return rule.source === pathname ? rule.destination : null;
}

function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const abs = join(ROOT, safe);
  if (!abs.startsWith(ROOT)) return null;
  if (existsSync(abs) && statSync(abs).isDirectory()) {
    const idx = join(abs, 'index.html');
    return existsSync(idx) ? { abs: idx, isDirIndex: true } : null;
  }
  if (existsSync(abs) && statSync(abs).isFile()) return { abs, isDirIndex: false };
  return null;
}

function send(res, status, abs, extraHeaders = {}) {
  const body = readFileSync(abs);
  res.writeHead(status, { 'Content-Type': MIME[extname(abs)] || 'application/octet-stream', 'X-Served-File': abs.replace(ROOT, ''), ...extraHeaders });
  res.end(body);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = url.pathname;
  const rules = loadRedirects(); // re-read each request so edits show up live

  // Never expose private-ish files
  if (/^\/(_redirects|_headers|package\.json|\.git)/.test(pathname)) { res.writeHead(404); return res.end('not found'); }

  for (const rule of rules) {
    const dest = matchRule(rule, pathname);
    if (!dest) continue;
    if (rule.code === 200) {
      const f = resolveFile(dest);
      if (f) return send(res, 200, f.abs, { 'X-Rewrite-From': pathname });
      break;
    }
    res.writeHead(rule.code, { Location: dest });
    return res.end();
  }

  const f = resolveFile(pathname);
  if (f) {
    if (f.isDirIndex && !pathname.endsWith('/')) { res.writeHead(308, { Location: pathname + '/' + url.search }); return res.end(); }
    return send(res, 200, f.abs);
  }

  const nf = join(ROOT, '404.html');
  if (existsSync(nf)) return send(res, 404, nf);
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404');
});

server.listen(PORT, HOST, () => console.log(`KYPO6 preview → http://${HOST}:${PORT}  (root: ${ROOT})`));
