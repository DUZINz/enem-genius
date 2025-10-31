import { NextResponse } from 'next/server'
import type { SimuladoGerado } from '@/lib/types/simulado'

export async function POST(request: Request) {
  try {
    const { areas, quantidade } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const prompt = `Você é um GERADOR DE SIMULADOS ENEM. Crie ${quantidade || 20} questões de múltipla escolha estilo ENEM.

ÁREAS SOLICITADAS: ${areas?.join(', ') || 'Todas'}

DISTRIBUIÇÃO (se "todas"):
- Linguagens: 5 questões (Português, Literatura, Inglês)
- Humanas: 5 questões (História, Geografia, Filosofia, Sociologia)
- Natureza: 5 questões (Biologia, Química, Física)
- Matemática: 5 questões

IMPORTANTE: Retorne APENAS um JSON válido sem markdown:

{
  "questoes": [
    {
      "numero": 1,
      "disciplina": "Biologia",
      "area": "natureza",
      "tema": "Ecologia e meio ambiente",
      "comando": "A Mata Atlântica brasileira perdeu aproximadamente 93% de sua área original. Considerando os impactos ambientais dessa degradação, qual das seguintes consequências é mais diretamente relacionada à perda de biodiversidade nesse bioma?",
      "alternativas": [
        { "letra": "A", "texto": "Aumento da temperatura média global" },
        { "letra": "B", "texto": "Extinção de espécies endêmicas da região" },
        { "letra": "C", "texto": "Redução da camada de ozônio" },
        { "letra": "D", "texto": "Intensificação do efeito estufa" },
        { "letra": "E", "texto": "Diminuição da precipitação em todo o país" }
      ],
      "gabarito": "B",
      "dificuldade": "medio",
      "explicacao": "A perda de biodiversidade está diretamente relacionada à extinção de espécies endêmicas, que são aquelas encontradas exclusivamente naquela região."
    }
  ]
}

CRITÉRIOS:
- Questões contextualizadas e atuais
- Nível ENEM (médio a difícil)
- Comando claro e objetivo
- Alternativas plausíveis
- Gabarito correto e fundamentado
- Temas diversos dentro de cada área

JSON PURO SEM MARKDOWN!`

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
            temperature: 0.8,
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Resposta vazia')
    }

    console.log('✅ Simulado gerado!')

    // Limpar JSON
    let jsonText = text.trim()
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}') + 1
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd)
    }

    const resultado = JSON.parse(jsonText)

    // Adicionar IDs únicos
    const questoesComId = resultado.questoes.map((q: any, index: number) => ({
      ...q,
      id: `q${Date.now()}-${index}`,
      numero: index + 1
    }))

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

    return NextResponse.json(simulado)

  } catch (error: any) {
    console.error('💥 ERRO:', error?.message)
    return NextResponse.json(
      { error: 'Erro ao gerar simulado. Tente novamente.' },
      { status: 500 }
    )
  }
}