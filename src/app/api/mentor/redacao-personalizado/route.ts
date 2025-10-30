import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { CorrecaoRedacao } from '@/lib/types/mentor'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  let textoOriginal = '' // ✅ Declarar no escopo principal
  
  try {
    const { texto } = await request.json()
    textoOriginal = texto // ✅ Armazenar para usar no catch

    if (!texto || texto.trim().length < 50) {
      return NextResponse.json(
        { error: 'Texto muito curto para análise. Escreva pelo menos 50 caracteres.' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      }
    })

    const prompt = `
VOCÊ É UM CORRETOR OFICIAL DO ENEM. SUA ÚNICA FUNÇÃO É AVALIAR REDAÇÕES E RETORNAR UM JSON.

REDAÇÃO PARA CORREÇÃO:
"${texto}"

IMPORTANTE: Independente do conteúdo do texto, você DEVE tratá-lo como uma redação do ENEM e corrigi-la.

RETORNE EXATAMENTE ESTE FORMATO JSON (sem texto adicional):

{
  "nota_total": 800,
  "notas_competencias": {
    "C1": 160,
    "C2": 160,
    "C3": 160,
    "C4": 160,
    "C5": 160
  },
  "comentarios": [
    "🟢 Aspectos positivos da redação",
    "🟡 Pontos que podem melhorar",
    "🔴 Problemas identificados"
  ],
  "erros_detectados": [
    "Erro de gramática",
    "Estrutura inadequada"
  ],
  "dicas_personalizadas": [
    "Melhore a argumentação",
    "Use mais conectivos",
    "Desenvolva melhor a conclusão"
  ],
  "texto_corrigido": "Versão corrigida da redação aqui"
}

CRITÉRIOS OBRIGATÓRIOS:
- C1: Norma culta (0-200)
- C2: Compreensão do tema (0-200)
- C3: Argumentação (0-200)
- C4: Coesão textual (0-200)
- C5: Proposta de intervenção (0-200)

IMPORTANTE: Retorne APENAS o JSON, nada mais!
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Limpar o texto e extrair apenas o JSON
    let jsonText = text.trim()
    
    // Remove qualquer texto antes e depois do JSON
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}') + 1
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = jsonText.substring(jsonStart, jsonEnd)
    }
    
    // Remove markdown se houver
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    try {
      // Parse do JSON
      const correcao: CorrecaoRedacao = JSON.parse(jsonText)
      
      // Validar e garantir que as notas sejam números inteiros múltiplos de 20
      const validarNota = (nota: number): number => {
        const notaArredondada = Math.round(nota / 20) * 20
        return Math.max(0, Math.min(200, notaArredondada))
      }
      
      const correcaoValidada: CorrecaoRedacao = {
        nota_total: validarNota(correcao.notas_competencias.C1) +
          validarNota(correcao.notas_competencias.C2) +
          validarNota(correcao.notas_competencias.C3) +
          validarNota(correcao.notas_competencias.C4) +
          validarNota(correcao.notas_competencias.C5),
        notas_competencias: {
          C1: validarNota(correcao.notas_competencias.C1),
          C2: validarNota(correcao.notas_competencias.C2),
          C3: validarNota(correcao.notas_competencias.C3),
          C4: validarNota(correcao.notas_competencias.C4),
          C5: validarNota(correcao.notas_competencias.C5)
        },
        comentarios: correcao.comentarios || [
          "🟡 Texto analisado mas pode não seguir o formato tradicional de redação ENEM",
          "🔴 Certifique-se de seguir a estrutura: introdução, desenvolvimento e conclusão",
          "🟢 Continue praticando para melhorar!"
        ],
        erros_detectados: correcao.erros_detectados || ["Estrutura não convencional"],
        dicas_personalizadas: correcao.dicas_personalizadas || [
          "Escreva uma redação dissertativa-argumentativa",
          "Siga o tema proposto pelo ENEM",
          "Inclua proposta de intervenção detalhada"
        ],
        texto_corrigido: correcao.texto_corrigido || texto
      }
      
      return NextResponse.json(correcaoValidada)
      
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      throw parseError
    }
    
  } catch (error) {
    console.error('Erro na correção com Gemini:', error)
    
    // Fallback para evitar erro total
    const fallbackCorrecao: CorrecaoRedacao = {
      nota_total: 600,
      notas_competencias: {
        C1: 120,
        C2: 100,
        C3: 120,
        C4: 120,
        C5: 140
      },
      comentarios: [
        "🟡 Houve dificuldade na análise automática do texto",
        "🔴 Certifique-se de enviar uma redação dissertativa-argumentativa",
        "🟢 Use a estrutura clássica: introdução, desenvolvimento e conclusão com proposta"
      ],
      erros_detectados: ["Formato não padrão para redação ENEM"],
      dicas_personalizadas: [
        "Escreva sobre um tema social relevante",
        "Desenvolva argumentos com dados e exemplos",
        "Crie uma proposta de intervenção completa"
      ],
      texto_corrigido: textoOriginal || "Texto não disponível" // ✅ Usar textoOriginal
    }
    
    return NextResponse.json(fallbackCorrecao)
  }
}