'use strict';

const https = require('https');
const { createSign, randomUUID } = require('crypto');

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

function toFs(v) {
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number')  return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v))       return { arrayValue: { values: v.map(toFs) } };
    if (v && typeof v === 'object')
        return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toFs(x)])) } };
    return { stringValue: String(v ?? '') };
}

async function saveFirestore(token, projectId, col, docId, data) {
    const url    = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${col}/${docId}`;
    const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toFs(v)]));
    const body   = JSON.stringify({ fields });
    await request(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }, body);
}

async function sendEmail(apiKey, to, subject, html) {
    const body = JSON.stringify({ from: 'Urban Cats <onboarding@resend.dev>', to: [to], subject, html });
    await request('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }, body);
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

    const d             = req.body || {};
    const nombre        = d.nombre        || 'Cliente';
    const email         = d.email         || '';
    const telefono      = d.telefono      || '';
    const direccion     = d.direccion     || '';
    const ciudad        = d.ciudad        || '';
    const codigo_postal = d.codigo_postal || '';
    const notas         = d.notas         || '';
    const metodo_pago   = d.metodo_pago   || 'card';
    const total         = d.total         || 0;
    const items         = d.items         || [];
    const orden_id      = d.orden_id      || 'UC-' + randomUUID().slice(0, 8).toUpperCase();

    const qrData = `Urban Cats | Orden: ${orden_id} | Cliente: ${nombre} | Total: $${total} | Estado: PAGADO`;
    const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    const creds = JSON.parse(process.env.FIREBASE_JSON_KEY);
    const token = await getAccessToken(creds);
    await saveFirestore(token, creds.project_id, 'tickets', orden_id, {
        orden_id, cliente: nombre, email, telefono, direccion, ciudad,
        codigo_postal, notas, metodo_pago, total, items,
        estado: 'PAGADO', fecha: new Date().toISOString()
    });

    const itemsHtml = items.map(i =>
        `<tr><td>${i.name||''}</td><td>x${i.quantity||1}</td><td>$${(i.price||0)*(i.quantity||1)}</td></tr>`
    ).join('');

    await sendEmail(
        process.env.RESEND_API_KEY, email,
        `Tu ticket de compra - ${orden_id} | Urban Cats`,
        `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
            <h2 style="color:#1a1a1a">¡Gracias por tu compra, ${nombre}!</h2>
            <p>Tu orden <strong>${orden_id}</strong> por <strong>$${total}</strong> fue procesada con éxito.</p>
            <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;margin:20px 0">
                <thead style="background:#f5f5f5">
                    <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            <p style="text-align:center">
                <strong>Tu código QR de verificación:</strong><br>
                <img src="${qrUrl}" alt="QR Orden ${orden_id}"
                     style="margin-top:10px;border:1px solid #eee;padding:8px;border-radius:8px">
            </p>
            <p style="color:#888;font-size:12px;text-align:center">Urban Cats — Moda urbana con estilo japonés</p>
        </div>`
    );

    return res.status(200).json({ status: 'success', orden_id });
};
