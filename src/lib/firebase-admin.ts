import * as admin from 'firebase-admin'

// Verificar se já foi inicializado
if (!admin.apps.length) {
  try {
    // Configuração do Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    })

    console.log('✅ Firebase Admin inicializado')
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error)
    throw error
  }
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
export const adminStorage = admin.storage()

export default admin