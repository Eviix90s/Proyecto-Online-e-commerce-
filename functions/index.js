const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dialogflow = require('@google-cloud/dialogflow');
const cors = require('cors')({origin: true});

admin.initializeApp();

const PROJECT_ID = 'urban-cats';
const LANGUAGE_CODE = 'es';

exports.dialogflowWebhook = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({
                error: 'Método no permitido. Usa POST.'
            });
        }

        try {
            const { message, sessionId } = req.body;
            
            if (!message || !sessionId) {
                return res.status(400).json({
                    error: 'Faltan parámetros requeridos',
                    required: ['message', 'sessionId']
                });
            }

            console.log('📩 Mensaje recibido:', message);

            const sessionClient = new dialogflow.SessionsClient({
                keyFilename: './service-account.json'
            });

            const sessionPath = sessionClient.projectAgentSessionPath(
                PROJECT_ID,
                sessionId
            );

            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: message,
                        languageCode: LANGUAGE_CODE,
                    },
                },
            };

            const responses = await sessionClient.detectIntent(request);
            const result = responses[0].queryResult;

            console.log('✅ Intent:', result.intent.displayName);

            try {
                await admin.firestore().collection('conversaciones').add({
                    sessionId: sessionId,
                    mensaje: message,
                    intent: result.intent.displayName,
                    respuesta: result.fulfillmentText,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (dbError) {
                console.error('⚠️ Error Firestore:', dbError);
            }

            res.status(200).json({
                respuesta: result.fulfillmentText,
                intent: result.intent.displayName,
                success: true
            });

        } catch (error) {
            console.error('❌ Error:', error);
            res.status(500).json({
                error: 'Error al procesar el mensaje',
                details: error.message,
                success: false
            });
        }
    });
});

exports.testConnection = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        res.status(200).json({
            message: '🐱 Urban Cats Chatbot funcionando!',
            timestamp: new Date().toISOString()
        });
    });
});