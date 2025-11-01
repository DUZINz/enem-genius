import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Recebendo requisição de correção de redação...')
    
    const body = await request.json()
    console.log('📝 Dados recebidos:', { 
      temaTamanho: body.tema?.length, 
      redacaoTamanho: body.redacao?.length 
    })

    const { tema, redacao } = body

    // Validação dos dados
    if (!tema || !redacao) {
      console.error('❌ Dados faltando:', { tema: !!tema, redacao: !!redacao })
      return NextResponse.json(
        { erro: 'Tema e redação são obrigatórios' },
        { status: 400 }
      )
    }

    if (redacao.split(' ').filter((p: string) => p.length > 0).length < 200) {
      console.error('❌ Redação muito curta')
      return NextResponse.json(
        { erro: 'A redação deve ter pelo menos 200 palavras' },
        { status: 400 }
      )
    }

    console.log('✅ Validação OK, iniciando correção...')

    // ⭐ CORREÇÃO: Usar modelo correto
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `
Você é um corretor especializado em redações do ENEM. Analise a redação abaixo e forneça uma correção COMPLETA e DETALHADA.

TEMA: ${tema}

REDAÇÃO:
${redacao}

Sua análise deve ser EXTREMAMENTE RIGOROSA, seguindo os critérios do ENEM:

**COMPETÊNCIA 1 - Domínio da modalidade escrita formal da língua portuguesa (0-200)**
Avalie: ortografia, acentuação, pontuação, concordância, regência, estrutura sintática.

**COMPETÊNCIA 2 - Compreender a proposta e aplicar conceitos (0-200)**
Avalie: se o tema foi compreendido, se há repertório sociocultural, se desenvolveu o tema.

**COMPETÊNCIA 3 - Selecionar e relacionar argumentos (0-200)**
Avalie: organização das ideias, coerência, progressão textual, relação entre parágrafos.

**COMPETÊNCIA 4 - Conhecimento dos mecanismos linguísticos (0-200)**
Avalie: uso de conectivos, coesão referencial, sequenciamento textual.

**COMPETÊNCIA 5 - Elaborar proposta de intervenção (0-200)**
Avalie: se há proposta, se é detalhada, se respeita direitos humanos, se tem agente/ação/meio/efeito/detalhamento.

Para CADA competência, forneça:
- Nota (0-200)
- Comentário detalhado (mínimo 3 linhas explicando)
- Exemplos ESPECÍFICOS do texto

Depois, forneça:
- 5 pontos fortes ESPECÍFICOS
- 5 pontos de melhoria ESPECÍFICOS com sugestões práticas
- 3 sugestões de como melhorar a redação

Retorne APENAS um JSON válido no seguinte formato:

{
  "competencia1": {
    "nota": 160,
    "comentario": "Comentário detalhado de 3+ linhas..."
  },
  "competencia2": {
    "nota": 180,
    "comentario": "Comentário detalhado de 3+ linhas..."
  },
  "competencia3": {
    "nota": 160,
    "comentario": "Comentário detalhado de 3+ linhas..."
  },
  "competencia4": {
    "nota": 160,
    "comentario": "Comentário detalhado de 3+ linhas..."
  },
  "competencia5": {
    "nota": 160,
    "comentario": "Comentário detalhado de 3+ linhas..."
  },
  "pontosFortes": [
    "Ponto forte específico 1...",
    "Ponto forte específico 2...",
    "Ponto forte específico 3...",
    "Ponto forte específico 4...",
    "Ponto forte específico 5..."
  ],
  "pontosMelhoria": [
    "Ponto de melhoria específico 1...",
    "Ponto de melhoria específico 2...",
    "Ponto de melhoria específico 3...",
    "Ponto de melhoria específico 4...",
    "Ponto de melhoria específico 5..."
  ],
  "sugestoes": [
    "Sugestão prática 1...",
    "Sugestão prática 2...",
    "Sugestão prática 3..."
  ]
}

IMPORTANTE: Retorne APENAS o JSON, sem markdown, sem explicações extras.
`

    console.log('🤖 Enviando para Gemini 2.0 Flash...')
    const result = await model.generateContent(prompt)
    const response = result.response
    let text = response.text()

    console.log('📥 Resposta recebida do Gemini')

    // Limpar markdown se houver
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Parse do JSON
    const feedback = JSON.parse(text)

    // Calcular nota final
    const notaFinal = 
      feedback.competencia1.nota +
      feedback.competencia2.nota +
      feedback.competencia3.nota +
      feedback.competencia4.nota +
      feedback.competencia5.nota

    console.log('✅ Correção finalizada. Nota:', notaFinal)

    return NextResponse.json({
      feedback,
      notaFinal,
      sucesso: true
    })

  } catch (error: any) {
    console.error('❌ Erro ao corrigir redação:', error)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      { 
        erro: 'Erro ao processar a correção',
        detalhes: error.message 
      },
      { status: 500 }
    )
  }
}