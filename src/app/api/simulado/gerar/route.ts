import { NextResponse } from 'next/server'
import type { SimuladoGerado } from '@/lib/types/simulado'

export async function POST(request: Request) {
  try {
    const { areas, quantidade } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const qtdQuestoes = quantidade || 20

    const prompt = `Você é um GERADOR DE SIMULADOS ENEM. Crie exatamente ${qtdQuestoes} questões de múltipla escolha estilo ENEM.

ÁREAS SOLICITADAS: ${areas?.join(', ') || 'Todas'}

IMPORTANTE: 
1. Retorne APENAS um JSON válido
2. NÃO use markdown (sem \`\`\`json)
3. NÃO quebre strings em múltiplas linhas
4. Use aspas duplas corretamente
5. Não coloque vírgula após o último elemento

FORMATO EXATO:

{
  "questoes": [
    {
      "numero": 1,
      "disciplina": "Biologia",
      "area": "natureza",
      "tema": "Ecologia",
      "comando": "Questão completa em uma única linha sem quebras.",
      "alternativas": [
        {"letra": "A", "texto": "Alternativa A em uma linha"},
        {"letra": "B", "texto": "Alternativa B em uma linha"},
        {"letra": "C", "texto": "Alternativa C em uma linha"},
        {"letra": "D", "texto": "Alternativa D em uma linha"},
        {"letra": "E", "texto": "Alternativa E em uma linha"}
      ],
      "gabarito": "B",
      "dificuldade": "medio",
      "explicacao": "Explicação breve do gabarito."
    }
  ]
}

REGRAS:
- Questões contextualizadas e realistas
- Comando claro (máximo 3 linhas)
- Alternativas de tamanho similar
- Gabarito inequívoco
- Explicação concisa
- Temas variados

CRIE ${qtdQuestoes} QUESTÕES AGORA!`

    console.log('🔄 Gerando simulado...')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API Error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Resposta vazia da IA')
    }

    console.log('📝 Texto recebido (primeiros 500 chars):', text.substring(0, 500))

    // LIMPEZA AGRESSIVA DO JSON
    text = text.trim()
    
    // Remover markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Remover quebras de linha dentro de strings (problema comum)
    text = text.replace(/"\s*\n\s*"/g, '" "')
    text = text.replace(/,\s*\n\s*}/g, '}')
    text = text.replace(/,\s*\n\s*]/g, ']')
    
    // Encontrar o JSON válido
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}') + 1
    
    if (jsonStart === -1 || jsonEnd <= jsonStart) {
      throw new Error('JSON não encontrado na resposta')
    }
    
    text = text.substring(jsonStart, jsonEnd)

    // Tentar corrigir vírgulas extras
    text = text.replace(/,\s*([}\]])/g, '$1')

    console.log('🔧 JSON limpo (primeiros 500 chars):', text.substring(0, 500))

    let resultado
    try {
      resultado = JSON.parse(text)
    } catch (parseError: any) {
      console.error('❌ Erro ao fazer parse:', parseError.message)
      console.error('📄 JSON problemático:', text)
      
      // Última tentativa: remover tudo após o último ] válido
      const lastValidBracket = text.lastIndexOf(']}')
      if (lastValidBracket > 0) {
        text = text.substring(0, lastValidBracket + 2)
        console.log('🔧 Tentando parse novamente após truncar...')
        resultado = JSON.parse(text)
      } else {
        throw new Error(`Parse falhou: ${parseError.message}`)
      }
    }

    if (!resultado.questoes || !Array.isArray(resultado.questoes)) {
      throw new Error('Formato inválido: questoes não é um array')
    }

    console.log(`✅ Simulado gerado com ${resultado.questoes.length} questões!`)

    // Adicionar IDs únicos e validar
    const questoesComId = resultado.questoes
      .filter((q: any) => q && q.comando && q.alternativas && q.gabarito)
      .map((q: any, index: number) => ({
        id: `q${Date.now()}-${index}`,
        numero: index + 1,
        disciplina: q.disciplina || 'Geral',
        area: q.area || 'natureza',
        tema: q.tema || 'Conhecimentos gerais',
        comando: q.comando,
        alternativas: q.alternativas.slice(0, 5), // Garantir apenas 5
        gabarito: q.gabarito,
        dificuldade: q.dificuldade || 'medio',
        explicacao: q.explicacao || ''
      }))
      .slice(0, qtdQuestoes) // Limitar ao solicitado

    if (questoesComId.length === 0) {
      throw new Error('Nenhuma questão válida foi gerada')
    }

    const simulado: SimuladoGerado = {
      id: `sim-${Date.now()}`,
      titulo: `Simulado ENEM - ${new Date().toLocaleDateString('pt-BR')}`,
      dataGeracao: new Date(),
      questoes: questoesComId,
      totalQuestoes: questoesComId.length,
      distribuicao: {
        linguagens: questoesComId.filter((q: any) => q.area === 'linguagens').length,
        humanas: questoesComId.filter((q: any) => q.area === 'humanas').length,
        natureza: questoesComId.filter((q: any) => q.area === 'natureza').length,
        matematica: questoesComId.filter((q: any) => q.area === 'matematica').length,
      }
    }

    console.log('📊 Distribuição:', simulado.distribuicao)
    return NextResponse.json(simulado)

  } catch (error: any) {
    console.error('💥 ERRO COMPLETO:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao gerar simulado. Tente novamente.',
        detalhes: error?.message 
      },
      { status: 500 }
    )
  }
}