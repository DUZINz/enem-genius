import { NextResponse } from 'next/server'
import type { CorrecaoSimulado } from '@/lib/types/simulado'

export async function POST(request: Request) {
  try {
    const { questoes, respostas } = await request.json()

    // Calcular acertos
    let acertos = 0
    let erros = 0
    let emBranco = 0
    const questoesErradas: any[] = []

    questoes.forEach((questao: any, index: number) => {
      const resposta = respostas.find((r: any) => r.questaoId === questao.id)
      
      if (!resposta || !resposta.respostaMarcada) {
        emBranco++
      } else if (resposta.respostaMarcada === questao.gabarito) {
        acertos++
      } else {
        erros++
        questoesErradas.push({
          numero: questao.numero,
          disciplina: questao.disciplina,
          tema: questao.tema,
          respostaMarcada: resposta.respostaMarcada,
          gabaritoCorreto: questao.gabarito,
          explicacao: questao.explicacao || 'Revise o conteúdo'
        })
      }
    })

    // Calcular notas por área (escala TRI simulada: 300-1000)
    const calcularNotaArea = (areaQuestoes: any[], respostasArea: any[]) => {
      const totalArea = areaQuestoes.length
      if (totalArea === 0) return 0

      let acertosArea = 0
      areaQuestoes.forEach((q: any) => {
        const resposta = respostasArea.find((r: any) => r.questaoId === q.id)
        if (resposta?.respostaMarcada === q.gabarito) {
          acertosArea++
        }
      })

      const percentual = acertosArea / totalArea
      return Math.round(300 + (percentual * 700)) // 300 base + até 700 pontos
    }

    const linguagensQuestoes = questoes.filter((q: any) => q.area === 'linguagens')
    const humanasQuestoes = questoes.filter((q: any) => q.area === 'humanas')
    const naturezaQuestoes = questoes.filter((q: any) => q.area === 'natureza')
    const matematicaQuestoes = questoes.filter((q: any) => q.area === 'matematica')

    const notaPorArea = {
      linguagens: calcularNotaArea(linguagensQuestoes, respostas),
      humanas: calcularNotaArea(humanasQuestoes, respostas),
      natureza: calcularNotaArea(naturezaQuestoes, respostas),
      matematica: calcularNotaArea(matematicaQuestoes, respostas)
    }

    const notaTotal = Math.round(
      (notaPorArea.linguagens + notaPorArea.humanas + notaPorArea.natureza + notaPorArea.matematica) / 4
    )

    // Gerar análise com IA
    const apiKey = process.env.GEMINI_API_KEY
    
    const analisePrompt = `Analise o desempenho do aluno no simulado ENEM:

ESTATÍSTICAS:
- Acertos: ${acertos}/${questoes.length}
- Erros: ${erros}
- Em branco: ${emBranco}
- Nota geral: ${notaTotal}/1000

NOTAS POR ÁREA:
- Linguagens: ${notaPorArea.linguagens}
- Humanas: ${notaPorArea.humanas}
- Natureza: ${notaPorArea.natureza}
- Matemática: ${notaPorArea.matematica}

QUESTÕES ERRADAS:
${questoesErradas.map(q => `- ${q.disciplina}: ${q.tema}`).join('\n')}

Retorne APENAS um JSON:

{
  "pontosFracos": ["Disciplina/tema 1", "Disciplina/tema 2", "Disciplina/tema 3"],
  "pontosFortes": ["Disciplina/tema 1", "Disciplina/tema 2"],
  "recomendacoes": [
    "Recomendação prática 1",
    "Recomendação prática 2",
    "Recomendação prática 3",
    "Recomendação prática 4"
  ]
}

SEJA ESPECÍFICO E CONSTRUTIVO!`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: analisePrompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 1024 } 

          
          })
      }
    )

    let analise = {
      pontosFracos: questoesErradas.map(q => q.disciplina).slice(0, 3),
      pontosFortes: ['Continue praticando'],
      recomendacoes: [
        'Revise os conteúdos com mais erros',
        'Pratique questões semelhantes',
        'Busque videoaulas sobre os temas',
        'Faça resumos dos pontos fracos'
      ]
    }

    if (response.ok) {
      try {
        const data = await response.json()
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        const jsonStart = text.indexOf('{')
        const jsonEnd = text.lastIndexOf('}') + 1
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          text = text.substring(jsonStart, jsonEnd)
          analise = JSON.parse(text)
        }
      } catch (err) {
        console.log('⚠️ Usando análise padrão')
      }
    }

    const correcao: CorrecaoSimulado = {
      notaTotal,
      notaPorArea,
      acertos,
      erros,
      emBranco,
      percentualAcerto: Math.round((acertos / questoes.length) * 100),
      questoesErradas,
      pontosFracos: analise.pontosFracos,
      pontoFortes: analise.pontosFortes,
      recomendacoes: analise.recomendacoes
    }

    console.log('✅ Simulado corrigido!')
    return NextResponse.json(correcao)

  } catch (error: any) {
    console.error('💥 ERRO:', error?.message)
    return NextResponse.json(
      { error: 'Erro ao corrigir simulado. Tente novamente.' },
      { status: 500 }
    )
  }
}