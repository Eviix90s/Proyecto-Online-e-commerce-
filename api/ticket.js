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

    const fecha = new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' });

    const itemsHtml = items.map(i => {
        const subtotal = (i.price||0) * (i.quantity||1);
        return `
        <tr>
            <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:14px">${i.name||''}</td>
            <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#888;font-size:14px;text-align:center">×${i.quantity||1}</td>
            <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:14px;text-align:right;font-weight:600">$${subtotal.toLocaleString('es-MX')}</td>
        </tr>`;
    }).join('');

    const metodoPagoLabel = metodo_pago === 'card' ? 'Tarjeta de crédito/débito'
        : metodo_pago === 'paypal' ? 'PayPal'
        : metodo_pago === 'transfer' ? 'Transferencia bancaria'
        : metodo_pago;

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

    <!-- Header -->
    <tr>
        <td style="background:#1a1a1a;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center">
            <div style="font-size:28px;font-weight:800;letter-spacing:4px;color:#ffffff;text-transform:uppercase">URBAN CATS</div>
            <div style="width:40px;height:3px;background:#fd4a09;margin:10px auto 0"></div>
            <div style="font-size:11px;letter-spacing:3px;color:#888;text-transform:uppercase;margin-top:8px">Moda urbana con estilo japonés</div>
        </td>
    </tr>

    <!-- Confirmed banner -->
    <tr>
        <td style="background:#fd4a09;padding:18px 40px;text-align:center">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="text-align:center">
                    <span style="font-size:13px;font-weight:700;letter-spacing:2px;color:#ffffff;text-transform:uppercase">&#10003;&nbsp;&nbsp;Pedido Confirmado</span>
                </td>
            </tr></table>
        </td>
    </tr>

    <!-- Body -->
    <tr>
        <td style="background:#ffffff;padding:36px 40px">

            <!-- Greeting -->
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a1a1a">¡Gracias, ${nombre}!</p>
            <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6">Tu orden fue procesada con éxito. A continuación el detalle de tu compra.</p>

            <!-- Order meta -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;margin-bottom:28px">
                <tr>
                    <td style="padding:16px 20px;border-right:1px solid #ebebeb;width:33%">
                        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:4px">Nº de Orden</div>
                        <div style="font-size:14px;font-weight:700;color:#fd4a09">${orden_id}</div>
                    </td>
                    <td style="padding:16px 20px;border-right:1px solid #ebebeb;width:33%">
                        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:4px">Fecha</div>
                        <div style="font-size:14px;font-weight:600;color:#1a1a1a">${fecha}</div>
                    </td>
                    <td style="padding:16px 20px;width:33%">
                        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:4px">Estado</div>
                        <div style="font-size:12px;font-weight:700;color:#ffffff;background:#1a1a1a;display:inline-block;padding:3px 10px;border-radius:20px">PAGADO</div>
                    </td>
                </tr>
            </table>

            <!-- Products -->
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:12px;font-weight:600">Productos</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:0">
                <thead>
                    <tr style="background:#1a1a1a">
                        <th style="padding:12px 16px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#fff;font-weight:600">Producto</th>
                        <th style="padding:12px 16px;text-align:center;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#fff;font-weight:600">Cant.</th>
                        <th style="padding:12px 16px;text-align:right;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#fff;font-weight:600">Precio</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;border:1px solid #f0f0f0;border-top:none;border-radius:0 0 8px 8px;margin-bottom:28px">
                <tr>
                    <td style="padding:16px 20px" colspan="2">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="font-size:13px;color:#888">Envío</td>
                                <td style="font-size:13px;color:#27ae60;font-weight:600;text-align:right">Gratis</td>
                            </tr>
                            <tr>
                                <td style="font-size:16px;font-weight:700;color:#1a1a1a;padding-top:10px;border-top:1px solid #f0f0f0">Total</td>
                                <td style="font-size:18px;font-weight:800;color:#fd4a09;text-align:right;padding-top:10px;border-top:1px solid #f0f0f0">$${Number(total).toLocaleString('es-MX')}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Two columns: Shipping + Payment -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
                <tr valign="top">
                    <td width="48%" style="background:#fafafa;border-radius:8px;padding:18px 20px;border:1px solid #f0f0f0">
                        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:12px;font-weight:600">Dirección de Envío</div>
                        <div style="font-size:13px;color:#1a1a1a;line-height:1.7">
                            <strong>${nombre}</strong><br>
                            ${direccion}<br>
                            ${ciudad}${codigo_postal ? ', CP ' + codigo_postal : ''}<br>
                            ${telefono ? '&#128222; ' + telefono : ''}
                        </div>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="background:#fafafa;border-radius:8px;padding:18px 20px;border:1px solid #f0f0f0">
                        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:12px;font-weight:600">Método de Pago</div>
                        <div style="font-size:13px;color:#1a1a1a;line-height:1.7">
                            &#128179; ${metodoPagoLabel}
                        </div>
                        ${notas ? `<div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin:14px 0 6px;font-weight:600">Notas</div><div style="font-size:13px;color:#888">${notas}</div>` : ''}
                    </td>
                </tr>
            </table>

            <!-- QR -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;border:1px solid #f0f0f0;margin-bottom:8px">
                <tr>
                    <td style="padding:24px;text-align:center">
                        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:14px;font-weight:600">Código QR de Verificación</div>
                        <img src="${qrUrl}" alt="QR ${orden_id}" width="160" height="160"
                             style="border:2px solid #e8e8e8;padding:8px;border-radius:8px;background:#fff">
                        <div style="font-size:11px;color:#aaa;margin-top:10px">Presenta este código al recoger tu pedido</div>
                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td style="background:#1a1a1a;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center">
            <div style="font-size:13px;font-weight:700;letter-spacing:3px;color:#fff;text-transform:uppercase;margin-bottom:6px">URBAN CATS</div>
            <div style="width:30px;height:2px;background:#fd4a09;margin:0 auto 10px"></div>
            <div style="font-size:11px;color:#666">¿Tienes dudas? Contáctanos en nuestras redes sociales.</div>
            <div style="font-size:10px;color:#444;margin-top:14px">Este correo es una confirmación automática. Por favor no respondas a este mensaje.</div>
        </td>
    </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

    await sendEmail(
        process.env.RESEND_API_KEY, email,
        `Pedido confirmado ${orden_id} — Urban Cats`,
        html
    );

    return res.status(200).json({ status: 'success', orden_id });
};
