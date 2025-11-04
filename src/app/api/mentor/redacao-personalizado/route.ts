import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  console.log('🔍 Recebendo requisição de correção de redação...')

  try {
    const { tema, redacao } = await request.json()

    console.log('📝 Dados recebidos:', {
      temaTamanho: tema?.length,
      redacaoTamanho: redacao?.length
    })

    if (!tema || !redacao) {
      console.log('❌ Dados faltando:', { tema: !!tema, redacao: !!redacao })
      return NextResponse.json(
        { erro: 'Tema e redação são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('✅ Validação OK, iniciando correção...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `Você é um corretor especializado em redações do ENEM. Avalie a redação a seguir com base nas 5 competências do ENEM.

TEMA: ${tema}

REDAÇÃO:
${redacao}

AVALIE COM RIGOR E HONESTIDADE, dando notas reais baseadas na qualidade do texto.

COMPETÊNCIAS DO ENEM:
1. Domínio da norma padrão da língua portuguesa (0-200)
2. Compreensão da proposta de redação e aplicação de conceitos (0-200)
3. Seleção, relacionamento, organização e interpretação de informações (0-200)
4. Conhecimento dos mecanismos linguísticos para construção da argumentação (0-200)
5. Elaboração de proposta de intervenção para o problema (0-200)

CRITÉRIOS DE AVALIAÇÃO:
- 0-40 pontos: Desempenho insuficiente
- 40-80 pontos: Desempenho mediano inferior
- 80-120 pontos: Desempenho mediano
- 120-160 pontos: Desempenho bom
- 160-200 pontos: Desempenho excelente

Responda APENAS com um JSON válido seguindo EXATAMENTE esta estrutura:

{
  "notaFinal": [SOMA DAS 5 COMPETÊNCIAS],
  "competencias": [
    {
      "numero": 1,
      "titulo": "Domínio da norma padrão da língua portuguesa",
      "nota": [0-200],
      "feedback": "[Avaliação detalhada desta competência]"
    },
    {
      "numero": 2,
      "titulo": "Compreensão da proposta de redação",
      "nota": [0-200],
      "feedback": "[Avaliação detalhada desta competência]"
    },
    {
      "numero": 3,
      "titulo": "Seleção e organização de argumentos",
      "nota": [0-200],
      "feedback": "[Avaliação detalhada desta competência]"
    },
    {
      "numero": 4,
      "titulo": "Conhecimento dos mecanismos linguísticos",
      "nota": [0-200],
      "feedback": "[Avaliação detalhada desta competência]"
    },
    {
      "numero": 5,
      "titulo": "Elaboração de proposta de intervenção",
      "nota": [0-200],
      "feedback": "[Avaliação detalhada desta competência]"
    }
  ],
  "pontosFortesGerais": [
    "[Ponto forte 1]",
    "[Ponto forte 2]",
    "[Ponto forte 3]"
  ],
  "pontosAMelhorarGerais": [
    "[Ponto a melhorar 1]",
    "[Ponto a melhorar 2]"
  ],
  "sugestoesGerais": "[Sugestões específicas para melhorar]"
}

REGRAS IMPORTANTES:
- Cada competência vale de 0 a 200 pontos
- notaFinal é a SOMA das 5 competências (0 a 1000)
- Seja JUSTO e CRITERIOSO: não dê notas altas sem justificativa
- Se a redação for ruim, dê nota baixa (200-500)
- Se for mediana, dê nota média (500-750)
- Se for excelente, dê nota alta (750-1000)
- Responda APENAS o JSON, sem texto antes ou depois
- Não use markdown (sem \`\`\`json)
- Use aspas duplas
- Não deixe campos vazios
- SEMPRE preencha os arrays`

    console.log('🤖 Enviando para Gemini 2.0 Flash...')

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('📥 Resposta recebida do Gemini')

    // Limpar resposta
    let cleanedText = responseText.trim()
    cleanedText = cleanedText.replace(/```json\s*/g, '')
    cleanedText = cleanedText.replace(/```\s*/g, '')
    cleanedText = cleanedText.trim()

    console.log('🧹 Texto limpo (primeiros 300 chars):', cleanedText.substring(0, 300))

    // Tentar parsear
    let correcao
    try {
      correcao = JSON.parse(cleanedText)
      console.log('✅ JSON parseado com sucesso')
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError)
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        console.log('🔍 Tentando extrair JSON...')
        correcao = JSON.parse(jsonMatch[0])
        console.log('✅ JSON extraído com sucesso')
      } else {
        throw new Error('Não foi possível extrair JSON válido da resposta')
      }
    }

    // Validação
    if (typeof correcao.notaFinal !== 'number' || !Array.isArray(correcao.competencias)) {
      console.error('❌ Estrutura inválida:', {
        notaFinal: correcao.notaFinal,
        tipoNotaFinal: typeof correcao.notaFinal,
        competencias: Array.isArray(correcao.competencias)
      })
      throw new Error('Estrutura de correção inválida')
    }

    // Validar competências
    if (correcao.competencias.length !== 5) {
      console.error('❌ Número incorreto de competências:', correcao.competencias.length)
      throw new Error('Deve haver exatamente 5 competências')
    }

    // Validar cada competência
    for (const comp of correcao.competencias) {
      if (!comp.numero || !comp.titulo || typeof comp.nota !== 'number' || !comp.feedback) {
        console.error('❌ Competência inválida:', comp)
        throw new Error('Competência com campos faltando ou inválidos')
      }
    }

    // Garantir arrays
    if (!Array.isArray(correcao.pontosFortesGerais)) {
      console.log('⚠️ pontosFortesGerais inválido, criando array vazio')
      correcao.pontosFortesGerais = []
    }
    
    if (!Array.isArray(correcao.pontosAMelhorarGerais)) {
      console.log('⚠️ pontosAMelhorarGerais inválido, criando array vazio')
      correcao.pontosAMelhorarGerais = []
    }
    
    if (!correcao.sugestoesGerais || typeof correcao.sugestoesGerais !== 'string') {
      console.log('⚠️ sugestoesGerais inválido, usando valor padrão')
      correcao.sugestoesGerais = 'Continue praticando para melhorar suas habilidades de escrita.'
    }

    // Se nota for 0, adicionar mensagens padrão
    if (correcao.notaFinal === 0) {
      if (correcao.pontosFortesGerais.length === 0) {
        correcao.pontosFortesGerais = ['Esta é uma oportunidade de aprendizado']
      }
      if (correcao.pontosAMelhorarGerais.length === 0) {
        correcao.pontosAMelhorarGerais = [
          'Desenvolver ideias relevantes sobre o tema',
          'Construir uma argumentação coerente',
          'Aplicar a norma padrão da língua portuguesa',
          'Elaborar uma proposta de intervenção detalhada'
        ]
      }
    }

    console.log('✅ Correção finalizada:', {
      notaFinal: correcao.notaFinal,
      competencias: correcao.competencias.length,
      pontosFortesGerais: correcao.pontosFortesGerais.length,
      pontosAMelhorarGerais: correcao.pontosAMelhorarGerais.length
    })

    return NextResponse.json(correcao)
  } catch (error: any) {
    console.error('❌ Erro ao corrigir redação:', error)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      { 
        erro: 'Erro ao processar redação',
        detalhes: error.message 
      },
      { status: 500 }
    )
  }
}