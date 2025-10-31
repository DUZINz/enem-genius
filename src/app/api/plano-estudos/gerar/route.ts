import { NextResponse } from 'next/server'
import type { PlanoEstudos, PerfilAluno } from '@/lib/types/plano-estudos'

export async function POST(request: Request) {
  try {
    const perfil: PerfilAluno = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    // Calcular semanas até a prova
    const hoje = new Date()
    const diasAteProva = Math.ceil((perfil.dataProva.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    const semanasAteProva = Math.ceil(diasAteProva / 7)

    const prompt = `Você é um ESPECIALISTA EM PLANEJAMENTO DE ESTUDOS PARA O ENEM.

Crie um plano de estudos PERSONALIZADO e DETALHADO baseado neste perfil:

PERFIL DO ALUNO:
- Nível atual: ${perfil.nivelAtual}
- Meta de nota: ${perfil.metaNota}
- Tempo disponível por dia: ${perfil.tempoDisponivelDia}h
- Dias disponíveis: ${perfil.diasDisponiveisSemana.join(', ')}
- Áreas fortes: ${perfil.areasFortes.join(', ')}
- Áreas fracas: ${perfil.areasFracas.join(', ')}
- Dias até o ENEM: ${diasAteProva} (${semanasAteProva} semanas)
- Horário preferido: ${perfil.preferencias.horarioEstudo}
- Tipo de conteúdo: ${perfil.preferencias.tipoConteudo}

INSTRUÇÕES:
1. Crie atividades para os próximos 14 dias
2. Priorize áreas fracas (60% do tempo)
3. Revise áreas fortes (25% do tempo)
4. Simulados e redações (15% do tempo)
5. Distribua equilibradamente entre teoria e prática
6. Respeite o tempo disponível por dia
7. Varie disciplinas para evitar saturação
8. Inclua revisões periódicas

RETORNE APENAS JSON VÁLIDO (sem markdown):

{
  "diasEstudo": [
    {
      "data": "2025-11-01",
      "diaSemana": "sexta-feira",
      "atividades": [
        {
          "tipo": "teoria",
          "disciplina": "Matemática",
          "area": "matematica",
          "titulo": "Funções Quadráticas - Conceitos",
          "descricao": "Estudo teórico sobre funções quadráticas, gráficos e aplicações",
          "duracaoMinutos": 60,
          "dificuldade": "medio",
          "recursos": {
            "videoaulas": ["Link 1", "Link 2"],
            "apostilas": ["Material sobre funções"],
            "exercicios": 15
          }
        },
        {
          "tipo": "exercicios",
          "disciplina": "Matemática",
          "area": "matematica",
          "titulo": "Exercícios de Funções",
          "descricao": "Resolver 20 questões sobre funções quadráticas",
          "duracaoMinutos": 90,
          "dificuldade": "medio",
          "recursos": {
            "exercicios": 20
          }
        }
      ]
    }
  ],
  "metaSemanal": {
    "horasEstudo": ${perfil.tempoDisponivelDia * perfil.diasDisponiveisSemana.length},
    "atividadesConcluidas": 25,
    "topicosRevisados": ["Funções", "Geometria", "Redação Competência 3"]
  },
  "recomendacoes": [
    "Foque em Matemática nas próximas 2 semanas",
    "Faça um simulado completo no final da semana",
    "Revise redações nota 1000 da biblioteca",
    "Use técnica Pomodoro para manter foco"
  ],
  "proximaAcao": "Comece estudando Funções Quadráticas - teoria por 1h"
}

SEJA ESPECÍFICO E REALISTA!`

    console.log('🎯 Gerando plano de estudos personalizado...')

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
      throw new Error('Erro ao conectar com a IA')
    }

    const data = await response.json()
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Resposta vazia da IA')
    }

    // Limpar JSON
    text = text.trim()
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}') + 1
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      text = text.substring(jsonStart, jsonEnd)
    }

    // Corrigir vírgulas extras
    text = text.replace(/,\s*([}\]])/g, '$1')

    const planoGerado = JSON.parse(text)

    // Adicionar IDs e processar datas
    const diasEstudo = planoGerado.diasEstudo.map((dia: any, index: number) => {
      const data = new Date(dia.data)
      return {
        ...dia,
        data,
        atividades: dia.atividades.map((ativ: any, aIndex: number) => ({
          ...ativ,
          id: `ativ-${Date.now()}-${index}-${aIndex}`,
          concluida: false
        })),
        tempoTotalMinutos: dia.atividades.reduce((acc: number, a: any) => acc + a.duracaoMinutos, 0),
        progresso: 0
      }
    })

    const plano: PlanoEstudos = {
      id: `plano-${Date.now()}`,
      alunoId: 'user-1', // Seria o ID real do usuário
      perfil,
      dataInicio: hoje,
      dataFim: perfil.dataProva,
      diasEstudo,
      metaSemanal: planoGerado.metaSemanal,
      progresso: {
        porcentagemGeral: 0,
        horasEstudadas: 0,
        atividadesConcluidas: 0,
        streak: 0,
        xpTotal: 0,
        nivel: 1,
        badges: []
      },
      recomendacoes: planoGerado.recomendacoes,
      proximaAcao: planoGerado.proximaAcao
    }

    console.log('✅ Plano de estudos gerado com sucesso!')
    console.log(`📅 ${diasEstudo.length} dias de estudo planejados`)

    return NextResponse.json(plano)

  } catch (error: any) {
    console.error('💥 ERRO:', error?.message)
    return NextResponse.json(
      { 
        error: 'Erro ao gerar plano de estudos',
        detalhes: error?.message 
      },
      { status: 500 }
    )
  }
}