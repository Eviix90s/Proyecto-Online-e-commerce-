'use strict';

const https = require('https');
const { createSign } = require('crypto');

function request(urlString, opts, body) {
    return new Promise((resolve, reject) => {
        const u = new URL(urlString);
        const req = https.request({
            hostname: u.hostname,
            path: u.pathname + u.search,
            port: 443,
            method: opts.method || 'GET',
            headers: opts.headers || {}
        }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch { resolve(data); }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

function b64url(input) {
    const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getAccessToken(creds) {
    const now = Math.floor(Date.now() / 1000);
    const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = b64url(JSON.stringify({
        iss: creds.client_email,
        scope: 'https://www.googleapis.com/auth/datastore',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now, exp: now + 3600
    }));
    const signer = createSign('SHA256');
    signer.update(`${header}.${payload}`);
    const sig = b64url(signer.sign(creds.private_key));
    const jwt = `${header}.${payload}.${sig}`;

    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const res = await request('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }
    }, body);
    return res.access_token;
}

function fromFs(v) {
    if (!v || typeof v !== 'object') return null;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('stringValue' in v) return v.stringValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFs);
    if ('mapValue' in v) return Object.fromEntries(
        Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFs(x)])
    );
    return null;
}

async function getFirestore(token, projectId, col, docId) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${col}/${docId}`;
    const res = await request(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.fields) return null;
    return Object.fromEntries(Object.entries(res.fields).map(([k, v]) => [k, fromFs(v)]));
}

function renderHtml(order) {
    const fecha = order.fecha
        ? new Date(order.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = items.map(i => {
        const subtotal = (i.price || 0) * (i.quantity || 1);
        return `
        <tr>
            <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:14px">${i.name || ''}</td>
            <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;text-align:center">×${i.quantity || 1}</td>
            <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:14px;text-align:right;font-weight:600">$${Number(subtotal).toLocaleString('es-MX')}</td>
        </tr>`;
    }).join('');

    const metodoPagoLabel = order.metodo_pago === 'card' ? 'Tarjeta de crédito/débito'
        : order.metodo_pago === 'paypal' ? 'PayPal'
        : order.metodo_pago === 'oxxo' ? 'OXXO (Efectivo)'
        : order.metodo_pago === 'transfer' ? 'Transferencia bancaria'
        : (order.metodo_pago || '');

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pedido ${order.orden_id} — Urban Cats</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 20px 16px 40px; }

  .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,.08); }

  /* Header */
  .hd { background: #1a1a1a; padding: 28px 24px; text-align: center; }
  .hd-brand { font-size: 22px; font-weight: 800; letter-spacing: 4px; color: #fff; text-transform: uppercase; }
  .hd-line { width: 32px; height: 3px; background: #fd4a09; margin: 8px auto; border-radius: 2px; }
  .hd-sub { font-size: 10px; letter-spacing: 2px; color: #888; text-transform: uppercase; }

  /* Check banner */
  .banner { background: #fd4a09; padding: 14px 24px; text-align: center; }
  .banner span { font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #fff; text-transform: uppercase; }

  /* Body */
  .body { padding: 24px 20px; }

  /* Status pill */
  .status-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
  .order-id { font-size: 18px; font-weight: 800; color: #fd4a09; letter-spacing: 1px; }
  .badge { font-size: 11px; font-weight: 700; color: #fff; background: #1a1a1a; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
  .badge.pagado { background: #27ae60; }

  /* Meta grid */
  .meta { display: flex; gap: 0; background: #fafafa; border-radius: 10px; margin-bottom: 20px; overflow: hidden; border: 1px solid #f0f0f0; }
  .meta-cell { flex: 1; padding: 12px 14px; border-right: 1px solid #ebebeb; }
  .meta-cell:last-child { border-right: none; }
  .meta-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #aaa; margin-bottom: 4px; }
  .meta-val { font-size: 13px; font-weight: 600; color: #1a1a1a; }

  /* Section label */
  .section-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; font-weight: 600; margin-bottom: 10px; }

  /* Items table */
  .items-table { width: 100%; border-collapse: collapse; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 0; }
  .items-table thead tr { background: #1a1a1a; }
  .items-table thead th { padding: 10px 14px; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; font-weight: 600; text-align: left; }
  .items-table thead th:nth-child(2) { text-align: center; }
  .items-table thead th:nth-child(3) { text-align: right; }

  /* Total row */
  .total-box { border: 1px solid #f0f0f0; border-top: none; border-radius: 0 0 10px 10px; margin-bottom: 20px; overflow: hidden; }
  .total-inner { padding: 14px; }
  .total-row { display: flex; justify-content: space-between; align-items: center; }
  .total-row + .total-row { margin-top: 8px; padding-top: 10px; border-top: 1px solid #f0f0f0; }
  .total-label { font-size: 13px; color: #888; }
  .total-label.bold { font-size: 15px; font-weight: 700; color: #1a1a1a; }
  .total-value { font-size: 13px; color: #27ae60; font-weight: 600; }
  .total-value.big { font-size: 20px; font-weight: 800; color: #fd4a09; }

  /* Info boxes */
  .info-boxes { display: flex; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
  .info-box { flex: 1; min-width: 120px; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 10px; padding: 14px; }
  .info-box .section-label { margin-bottom: 8px; }
  .info-box p { font-size: 13px; color: #1a1a1a; line-height: 1.6; }

  /* Footer */
  .ft { background: #1a1a1a; padding: 20px 24px; text-align: center; }
  .ft-brand { font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #fff; text-transform: uppercase; margin-bottom: 6px; }
  .ft-line { width: 24px; height: 2px; background: #fd4a09; margin: 0 auto 10px; border-radius: 2px; }
  .ft-note { font-size: 10px; color: #555; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">

    <div class="hd">
      <div class="hd-brand">URBAN CATS</div>
      <div class="hd-line"></div>
      <div class="hd-sub">Moda urbana con estilo japonés</div>
    </div>

    <div class="banner">
      <span>&#10003;&nbsp;&nbsp;Pedido Verificado</span>
    </div>

    <div class="body">

      <div class="status-row">
        <div class="order-id">${order.orden_id}</div>
        <div class="badge pagado">PAGADO</div>
      </div>

      <div class="meta">
        <div class="meta-cell">
          <div class="meta-label">Cliente</div>
          <div class="meta-val">${order.cliente || ''}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Fecha</div>
          <div class="meta-val">${fecha}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Método</div>
          <div class="meta-val" style="font-size:11px">${metodoPagoLabel}</div>
        </div>
      </div>

      <div class="section-label">Productos</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th style="text-align:center">Cant.</th>
            <th style="text-align:right">Precio</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div class="total-box">
        <div class="total-inner">
          <div class="total-row">
            <span class="total-label">Envío</span>
            <span class="total-value">Gratis</span>
          </div>
          <div class="total-row">
            <span class="total-label bold">Total</span>
            <span class="total-value big">$${Number(order.total || 0).toLocaleString('es-MX')}</span>
          </div>
        </div>
      </div>

      <div class="info-boxes">
        <div class="info-box">
          <div class="section-label">Envío a</div>
          <p>
            <strong>${order.cliente || ''}</strong><br>
            ${order.direccion || ''}<br>
            ${order.ciudad || ''}${order.codigo_postal ? ', CP ' + order.codigo_postal : ''}
            ${order.telefono ? '<br>&#128222; ' + order.telefono : ''}
          </p>
        </div>
        ${order.notas ? `<div class="info-box"><div class="section-label">Notas</div><p>${order.notas}</p></div>` : ''}
      </div>

    </div>

    <div class="ft">
      <div class="ft-brand">URBAN CATS</div>
      <div class="ft-line"></div>
      <div class="ft-note">Ticket de verificación de compra</div>
    </div>

  </div>
</div>
</body>
</html>`;
}

function notFoundHtml(id) {
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Orden no encontrada</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;margin:0}
.box{background:#fff;border-radius:16px;padding:40px;text-align:center;max-width:320px;box-shadow:0 2px 16px rgba(0,0,0,.08)}
h1{font-size:18px;color:#1a1a1a;margin-bottom:8px}p{color:#888;font-size:14px}</style>
</head><body><div class="box">
<h1>Orden no encontrada</h1><p>No existe un pedido con ID <strong>${id}</strong></p>
</div></body></html>`;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'GET') return res.status(405).end();

    let orden_id = (req.query && req.query.id) || null;
    if (!orden_id && req.url) {
        try {
            const u = new URL(req.url.startsWith('http') ? req.url : `https://x.x${req.url}`);
            orden_id = u.searchParams.get('id');
        } catch {}
    }

    if (!orden_id) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(400).send('<h1 style="font-family:sans-serif;padding:40px">Falta el parámetro id</h1>');
    }

    try {
        const creds = JSON.parse(process.env.FIREBASE_JSON_KEY);
        const token = await getAccessToken(creds);
        const order = await getFirestore(token, creds.project_id, 'tickets', orden_id);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        if (!order) return res.status(404).send(notFoundHtml(orden_id));
        return res.status(200).send(renderHtml(order));
    } catch (e) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(500).send('<h1 style="font-family:sans-serif;padding:40px">Error interno</h1>');
    }
};
