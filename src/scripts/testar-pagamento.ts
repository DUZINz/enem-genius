// src/scripts/testar-pagamento.ts

import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function testarPagamento() {
  try {
    // Adicionar comprador teste
    await addDoc(collection(db, 'compradores'), {
      email: 'teste@example.com',
      compradorId: 'cakto_test_' + Date.now(),
      plano: 'mensal',
      status: 'ativo',
      dataPagamento: new Date().toISOString(),
      dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })

    console.log('✅ Comprador teste adicionado!')
    console.log('📧 Email: teste@example.com')
    console.log('🔐 Senha: qualquer senha (cadastre no sistema)')
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarPagamento()