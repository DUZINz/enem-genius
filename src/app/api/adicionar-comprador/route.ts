import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    // 🔐 Verificar token de segurança
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (token !== process.env.WEBHOOK_SECRET) {
      console.log('❌ Token inválido:', token)
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
    }

    // 📥 Receber dados do webhook
    const body = await request.json()
    console.log('📦 Webhook recebido:', body)

    // Extrair dados (ajuste conforme JSON da Cakto)
    const email = body.customer?.email || body.buyer?.email || body.email
    const nome = body.customer?.name || body.buyer?.name || body.nome || 'Estudante'
    const dataCompra = body.sale_date || body.data_compra || body.created_at
    const valorPago = body.product?.price || body.valor || 97.0

    if (!email) {
      console.log('❌ Email não fornecido no webhook')
      return NextResponse.json({ erro: 'Email é obrigatório' }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    // 💾 Adicionar ao Firestore
    await adminDb.collection('compradores_autorizados').doc(emailLower).set({
      email: emailLower,
      nome: nome,
      dataCompra: dataCompra ? new Date(dataCompra) : new Date(),
      valorPago: Number(valorPago),
      autorizado: true,
      contaCriada: false,
      dataCriacaoConta: null,
      plano: 'vitalicio',
      webhookRecebido: new Date(),
      dadosOriginais: body, // Guarda dados completos do webhook
    })

    console.log(`✅ Comprador ${emailLower} adicionado via webhook`)

    return NextResponse.json({
      sucesso: true,
      email: emailLower,
      mensagem: 'Comprador adicionado com sucesso',
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error)
    return NextResponse.json(
      { erro: 'Erro ao processar webhook', detalhes: error.message },
      { status: 500 }
    )
  }
}

// 🧪 Método GET para testar se rota está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mensagem: 'Webhook funcionando',
    url: process.env.NEXT_PUBLIC_APP_URL + '/api/adicionar-comprador',
  })
}