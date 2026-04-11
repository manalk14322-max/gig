const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const appOrigin = process.env.APP_ORIGIN || `http://localhost:${port}`;

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), 'application/json; charset=utf-8');
}

function sendJavaScript(res, body) {
  send(res, 200, body, 'application/javascript; charset=utf-8');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = types[ext] || 'application/octet-stream';
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 500, 'Server error');
      return;
    }
    send(res, 200, data, contentType);
  });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      serveFile(res, filePath);
      return;
    }

    if (!path.extname(filePath)) {
      serveFile(res, path.join(root, 'index.html'));
      return;
    }

    send(res, 404, 'Not found');
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/config.js') {
    sendJavaScript(
      res,
      `window.PAKGIGS_CONFIG = ${JSON.stringify({
        appOrigin,
        googleClientId,
      })};`,
    );
    return;
  }

  if (url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, app: 'pakgigs' });
    return;
  }

  if (url.pathname === '/api/auth/google' && req.method === 'POST') {
    (async () => {
      try {
        if (!googleClientId) {
          sendJson(res, 500, {
            error: 'GOOGLE_CLIENT_ID is not configured on the server.',
          });
          return;
        }

        const body = await readJsonBody(req);
        const credential = String(body.credential || '').trim();
        if (!credential) {
          sendJson(res, 400, { error: 'Missing Google credential.' });
          return;
        }

        const verifyResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!verifyResponse.ok) {
          sendJson(res, 401, {
            error: 'Unable to verify the Google credential.',
            detail: await verifyResponse.text(),
          });
          return;
        }

        const token = await verifyResponse.json();
        if (token.aud !== googleClientId) {
          sendJson(res, 401, { error: 'Google credential audience mismatch.' });
          return;
        }
        if (token.iss !== 'accounts.google.com' && token.iss !== 'https://accounts.google.com') {
          sendJson(res, 401, { error: 'Unexpected Google token issuer.' });
          return;
        }
        if (token.email_verified !== true && token.email_verified !== 'true') {
          sendJson(res, 401, { error: 'Google email is not verified.' });
          return;
        }

        sendJson(res, 200, {
          user: {
            id: token.sub,
            name: token.name || token.email || 'Google user',
            email: token.email || '',
            picture: token.picture || '',
            givenName: token.given_name || '',
            familyName: token.family_name || '',
          },
        });
      } catch (error) {
        sendJson(res, 500, {
          error: 'Google sign-in failed.',
          detail: error.message || 'Unknown error',
        });
      }
    })();
    return;
  }

  serveStatic(req, res, url);
});

server.listen(port, () => {
  console.log(`PakGigs running at http://localhost:${port}`);
});
