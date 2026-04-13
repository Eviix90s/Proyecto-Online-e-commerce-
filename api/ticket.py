import os
import json
import uuid
import qrcode
import base64
import datetime
import urllib.request
from io import BytesIO
from http.server import BaseHTTPRequestHandler

from google.oauth2 import service_account
import google.auth.transport.requests

SCOPES = ['https://www.googleapis.com/auth/datastore']


def _get_token_and_project():
    info = json.loads(os.environ.get('FIREBASE_JSON_KEY'))
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token, info.get('project_id')


def _to_fs(val):
    if isinstance(val, bool):  return {"booleanValue": val}
    if isinstance(val, int):   return {"integerValue": str(val)}
    if isinstance(val, float): return {"doubleValue": val}
    if isinstance(val, list):  return {"arrayValue": {"values": [_to_fs(v) for v in val]}}
    if isinstance(val, dict):  return {"mapValue": {"fields": {k: _to_fs(v) for k, v in val.items()}}}
    return {"stringValue": str(val)}


def _save_firestore(token, project_id, collection, doc_id, data):
    url = (f"https://firestore.googleapis.com/v1/projects/{project_id}"
           f"/databases/(default)/documents/{collection}/{doc_id}")
    body = json.dumps({"fields": {k: _to_fs(v) for k, v in data.items()}}).encode()
    req = urllib.request.Request(url, data=body, method='PATCH')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    urllib.request.urlopen(req)


def _send_resend(api_key, to_email, subject, html, attachments=None):
    payload = {
        "from": "Urban Cats <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    if attachments:
        payload["attachments"] = attachments
    body = json.dumps(payload).encode()
    req = urllib.request.Request("https://api.resend.com/emails", data=body, method='POST')
    req.add_header('Authorization', f'Bearer {api_key}')
    req.add_header('Content-Type', 'application/json')
    urllib.request.urlopen(req)


class handler(BaseHTTPRequestHandler):

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        datos = json.loads(self.rfile.read(content_length))

        nombre        = datos.get("nombre", "Cliente")
        email         = datos.get("email", "")
        telefono      = datos.get("telefono", "")
        direccion     = datos.get("direccion", "")
        ciudad        = datos.get("ciudad", "")
        codigo_postal = datos.get("codigo_postal", "")
        notas         = datos.get("notas", "")
        metodo_pago   = datos.get("metodo_pago", "card")
        total         = datos.get("total", 0)
        items         = datos.get("items", [])
        orden_id      = datos.get("orden_id") or "UC-" + str(uuid.uuid4())[:8].upper()

        # --- A. GENERAR EL QR ---
        qr_texto = f"Urban Cats | Orden: {orden_id} | Cliente: {nombre} | Total: ${total} | Estado: PAGADO"
        qr = qrcode.make(qr_texto)
        buf = BytesIO()
        qr.save(buf, format='PNG')
        img_bytes = buf.getvalue()

        # --- B. GUARDAR EN FIREBASE FIRESTORE (REST API) ---
        token, project_id = _get_token_and_project()
        _save_firestore(token, project_id, 'tickets', orden_id, {
            'orden_id':      orden_id,
            'cliente':       nombre,
            'email':         email,
            'telefono':      telefono,
            'direccion':     direccion,
            'ciudad':        ciudad,
            'codigo_postal': codigo_postal,
            'notas':         notas,
            'metodo_pago':   metodo_pago,
            'total':         total,
            'items':         items,
            'estado':        'PAGADO',
            'fecha':         datetime.datetime.utcnow().isoformat()
        })

        # --- C. ENVIAR CORREO CON RESEND (urllib) ---
        items_html = "".join([
            f"<tr><td>{i.get('name','')}</td><td>x{i.get('quantity',1)}</td>"
            f"<td>${i.get('price',0)*i.get('quantity',1)}</td></tr>"
            for i in items
        ])
        html_body = f"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
                <h2 style="color:#1a1a1a">¡Gracias por tu compra, {nombre}!</h2>
                <p>Tu orden <strong>{orden_id}</strong> por <strong>${total}</strong>
                   ha sido procesada con éxito.</p>
                <table border="1" cellpadding="8" cellspacing="0" width="100%"
                       style="border-collapse:collapse;margin:20px 0">
                    <thead style="background:#f5f5f5">
                        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>
                    </thead>
                    <tbody>{items_html}</tbody>
                </table>
                <p>Adjunto encontrarás tu código QR de verificación.</p>
                <p style="color:#888;font-size:12px">Urban Cats — Moda urbana con estilo japonés</p>
            </div>
        """
        _send_resend(
            os.environ.get('RESEND_API_KEY'),
            email,
            f"Tu ticket de compra - {orden_id} | Urban Cats",
            html_body,
            attachments=[{
                "filename": f"ticket_{orden_id}.png",
                "content": base64.b64encode(img_bytes).decode()
            }]
        )

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success", "orden_id": orden_id}).encode())
