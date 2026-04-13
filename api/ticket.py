import os
import json
import uuid
import resend
import qrcode
from io import BytesIO
import firebase_admin
from firebase_admin import credentials, firestore
from http.server import BaseHTTPRequestHandler

# 1. Inicializar Firebase usando Variable de Entorno (no el archivo JSON directamente)
if not firebase_admin._apps:
    firebase_credentials = json.loads(os.environ.get('FIREBASE_JSON_KEY'))
    cred = credentials.Certificate(firebase_credentials)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 2. Conectar Resend
resend.api_key = os.environ.get('RESEND_API_KEY')


class handler(BaseHTTPRequestHandler):

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    # Maneja el preflight CORS que el navegador envía antes del POST
    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        datos = json.loads(post_data)

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
        # Usar el mismo orden_id que ya generó el frontend
        orden_id = datos.get("orden_id") or "UC-" + str(uuid.uuid4())[:8].upper()

        # --- A. GENERAR EL QR ---
        qr_texto = f"Urban Cats | Orden: {orden_id} | Cliente: {nombre} | Total: ${total} | Estado: PAGADO"
        qr = qrcode.make(qr_texto)
        img_byte_arr = BytesIO()
        qr.save(img_byte_arr, format='PNG')
        img_bytes = img_byte_arr.getvalue()

        # --- B. GUARDAR EN FIREBASE FIRESTORE ---
        doc_ref = db.collection('tickets').document(orden_id)
        doc_ref.set({
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
            'fecha':         __import__('datetime').datetime.utcnow().isoformat()
        })

        # --- C. ENVIAR CORREO CON RESEND ---
        items_html = "".join([
            f"<tr><td>{i.get('name','')}</td><td>x{i.get('quantity',1)}</td><td>${i.get('price',0)*i.get('quantity',1)}</td></tr>"
            for i in items
        ])
        params = {
            "from": "Urban Cats <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Tu ticket de compra - {orden_id} | Urban Cats",
            "html": f"""
                <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
                    <h2 style="color:#1a1a1a">¡Gracias por tu compra, {nombre}!</h2>
                    <p>Tu orden <strong>{orden_id}</strong> por <strong>${total}</strong> ha sido procesada con éxito.</p>
                    <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;margin:20px 0">
                        <thead style="background:#f5f5f5">
                            <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>
                        </thead>
                        <tbody>{items_html}</tbody>
                    </table>
                    <p>Adjunto encontrarás tu código QR de verificación.</p>
                    <p style="color:#888;font-size:12px">Urban Cats — Moda urbana con estilo japonés</p>
                </div>
            """,
            "attachments": [{"filename": f"ticket_{orden_id}.png", "content": list(img_bytes)}]
        }
        resend.Emails.send(params)

        # Responder al frontend
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success", "orden_id": orden_id}).encode('utf-8'))
