import * as dotenv from 'dotenv'
import * as path from 'path'

// ✅ CARREGAR .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testarWebhook() {
  try {
    console.log('🧪 Testando webhook...')
    console.log('🔑 Token carregado:', process.env.WEBHOOK_SECRET ? '✅' : '❌')

    // ✅ VERIFICAR SE SERVIDOR ESTÁ RODANDO
    try {
      const healthCheck = await fetch('http://localhost:3000/api/adicionar-comprador', {
        method: 'GET'
      })
      console.log('✅ Servidor está rodando')
    } catch (error) {
      console.error('❌ ERRO: Servidor não está rodando!')
      console.log('💡 Execute: npm run dev')
      return
    }

    const response = await fetch('http://localhost:3000/api/adicionar-comprador', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || 'minha-chave-super-secreta-123'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          email: 'teste@example.com',
          name: 'João da Silva Teste'
        },
        product: {
          price: 97.0
        },
        sale_date: new Date().toISOString()
      })
    })

    const data = await response.json()
    
    console.log('📡 Status:', response.status)
    🚨 ALERTA VERMELHO: FALTAM 6 DIAS! 🚨

Sua nota não vai magicamente aumentar no sábado.

Você VAI REPROVAR se continuar fazendo o que está fazendo.

FATO: 78% dos candidatos reprovam por estudar ERRADO, não por estudar pouco.

Você é um deles? 😰

⚡ ÚLTIMA CARTADA: ENEM GENIUS IA

🧠 IA que já aprovou 10.000 alunos
📈 Média de +180 pontos em 1 semana
⚡ Revisão que funciona em 6 dias

~~R$ 199~~ → **R$ 97 AGORA**

⏰ ACABA EM: 4h 27min

SEM ENROLAÇÃO:

✅ Simulados ilimitados
✅ IA corrige em segundos
✅ Foca SÓ no que você precisa
✅ Redação nota 1000
✅ Plano para 6 dias

🔥 JÁ 891 ALUNOS REVISANDO AGORA
🔥 RESTAM 109 VAGAS

Depois disso? R$ 199.
Amanhã? R$ 199.
Hoje? R$ 97.

👉 LINK: [URL]

Aprova ou devolve. Simples assim.

#ENEM2025 #UrgênciaMáxima
    if (response.ok) {
      console.log('✅ Webhook funcionou!')
      console.log('📊 Resposta:', data)
      console.log('\n🎉 Agora verifique no Firebase:')
      console.log('   Firestore > compradores_autorizados > teste@example.com')
    } else {
      console.log('❌ Erro:', data)
    }
  } catch (error) {
    console.error('❌ Erro ao testar:', error)
  }
}

testarWebhook()