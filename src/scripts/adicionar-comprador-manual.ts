import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

async function adicionarComprador(email: string, nome: string = 'Estudante') {
  try {
    const emailLower = email.toLowerCase().trim()

    await setDoc(doc(db, 'compradores_autorizados', emailLower), {
      email: emailLower,
      nome: nome,
      dataCompra: new Date(),
      valorPago: 97.0,
      autorizado: true,
      contaCriada: false,
      dataCriacaoConta: null,
      plano: 'vitalicio',
    })

    console.log(`✅ ${emailLower} adicionado!`)
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

// ==========================================
// DESCOMENTE E EXECUTE:
// ==========================================
// adicionarComprador('cliente@email.com', 'João Silva')

export { adicionarComprador }