import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Email não fornecido' },
        { status: 400 }
      )
    }

    console.log('✅ Marcando conta como criada:', email)

    await adminDb
      .collection('compradores_autorizados')
      .doc(email)
      .update({
        contaCriada: true,
        dataCriacaoConta: new Date().toISOString(),
      })

    console.log('✅ Conta marcada como criada com sucesso')

    return NextResponse.json({ sucesso: true })
  } catch (error: any) {
    console.error('❌ Erro ao marcar conta criada:', error)
    return NextResponse.json(
      { 
        sucesso: false,
        erro: error.message 
      },
      { status: 500 }
    )
  }
}