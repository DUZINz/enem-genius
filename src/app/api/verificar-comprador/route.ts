import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { autorizado: false, mensagem: 'Email não fornecido' },
        { status: 400 }
      )
    }

    console.log('🔍 Verificando comprador:', email)

    // Buscar no Firestore
    const compradorRef = adminDb.collection('compradores_autorizados').doc(email)
    const compradorDoc = await compradorRef.get()

    if (!compradorDoc.exists) {
      console.log('❌ Comprador não encontrado:', email)
      return NextResponse.json({
        autorizado: false,
        mensagem: 'Email não encontrado na base de compradores. Você comprou o ENEM Genius?',
      })
    }

    const dados = compradorDoc.data()
    console.log('✅ Comprador encontrado:', dados)

    return NextResponse.json({
      autorizado: true,
      contaCriada: dados?.contaCriada || false,
      nomeComprador: dados?.nome,
      valorPago: dados?.valorPago,
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar comprador:', error)
    return NextResponse.json(
      {
        autorizado: false,
        mensagem: 'Erro ao verificar comprador',
        detalhes: error.message,
      },
      { status: 500 }
    )
  }
}