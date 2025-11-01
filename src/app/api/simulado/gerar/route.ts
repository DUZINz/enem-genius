import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Gerando simulado...')
    
    const body = await request.json()
    const { disciplina, quantidade = 10 } = body

    if (!disciplina) {
      return NextResponse.json(
        { erro: 'Disciplina é obrigatória' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `
Gere ${quantidade} questões de múltipla escolha sobre ${disciplina} no estilo ENEM.

IMPORTANTE: Retorne APENAS um JSON válido, sem markdown, sem explicações.

Formato esperado:
{
  "questoes": [
    {
      "id": "q1",
      "enunciado": "Texto da questão com contexto real...",
      "alternativas": [
        "Alternativa A completa",
        "Alternativa B completa",
        "Alternativa C completa",
        "Alternativa D completa",
        "Alternativa E completa"
      ],
      "respostaCorreta": 0,
      "explicacao": "Explicação detalhada da resposta correta",
      "disciplina": "${disciplina}",
      "dificuldade": "medio"
    }
  ]
}

Regras:
- alternativas deve ser um ARRAY DE STRINGS (não objetos)
- respostaCorreta é o ÍNDICE (0-4) da alternativa correta
- enunciado deve ter contexto real e atual
- explicacao deve ser completa e didática
- dificuldade pode ser: "facil", "medio", "dificil"
- questões devem variar em dificuldade

Retorne APENAS o JSON válido.
`

    const result = await model.generateContent(prompt)
    const response = result.response
    let text = response.text()

    console.log('📝 Texto recebido (primeiros 500 chars):', text.substring(0, 500))

    // Limpar markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    console.log('🔧 JSON limpo (primeiros 500 chars):', text.substring(0, 500))

    // Parse do JSON
    const data = JSON.parse(text)

    // Validar e normalizar estrutura
    const questoesNormalizadas = data.questoes.map((q: any, index: number) => {
      // Se alternativas vieram como objetos {letra, texto}, converter para array de strings
      let alternativasArray: string[]
      
      if (Array.isArray(q.alternativas)) {
        if (typeof q.alternativas[0] === 'object') {
          // Formato: [{letra: "A", texto: "..."}, ...]
          alternativasArray = q.alternativas.map((alt: any) => alt.texto)
        } else {
          // Formato correto: ["texto1", "texto2", ...]
          alternativasArray = q.alternativas
        }
      } else {
        throw new Error('Formato de alternativas inválido')
      }

      return {
        id: q.id || `q${index + 1}`,
        enunciado: q.enunciado,
        alternativas: alternativasArray, // ✅ Array de strings
        respostaCorreta: q.respostaCorreta,
        explicacao: q.explicacao,
        disciplina: q.disciplina || disciplina,
        dificuldade: q.dificuldade || 'medio'
      }
    })

    // Calcular distribuição
    const distribuicao = {
      linguagens: 0,
      humanas: 0,
      natureza: 0,
      matematica: 0
    }

    questoesNormalizadas.forEach((q: any) => {
      const disc = q.disciplina.toLowerCase()
      if (disc.includes('português') || disc.includes('inglês') || disc.includes('espanhol') || disc.includes('literatura') || disc.includes('linguagem')) {
        distribuicao.linguagens++
      } else if (disc.includes('história') || disc.includes('geografia') || disc.includes('filosofia') || disc.includes('sociologia')) {
        distribuicao.humanas++
      } else if (disc.includes('física') || disc.includes('química') || disc.includes('biologia') || disc.includes('ciências')) {
        distribuicao.natureza++
      } else if (disc.includes('matemática') || disc.includes('matematica')) {
        distribuicao.matematica++
      }
    })

    console.log('✅ Simulado gerado com', questoesNormalizadas.length, 'questões!')
    console.log('📊 Distribuição:', distribuicao)

    return NextResponse.json({
      questoes: questoesNormalizadas,
      sucesso: true
    })

  } catch (error: any) {
    console.error('❌ Erro ao gerar simulado:', error)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      { 
        erro: 'Erro ao gerar simulado',
        detalhes: error.message 
      },
      { status: 500 }
    )
  }
}