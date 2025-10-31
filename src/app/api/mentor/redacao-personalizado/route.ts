import { NextResponse } from 'next/server'
import { CorrecaoRedacao } from '@/lib/types/mentor'

export async function POST(request: Request) {
  let textoOriginal = ''
  
  try {
    const { texto } = await request.json()
    textoOriginal = texto

    if (!texto || texto.trim().length < 50) {
      return NextResponse.json(
        { error: 'Texto muito curto para análise. Escreva pelo menos 50 caracteres.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    console.log('🔑 Gemini API Key presente')

    const prompt = `Você é um CORRETOR OFICIAL DE REDAÇÕES DO ENEM. Analise a redação abaixo e retorne APENAS um JSON válido.

REDAÇÃO:
"""
${texto}
"""

IMPORTANTE: Retorne APENAS o JSON abaixo, sem texto antes ou depois, sem markdown:

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
    "🟢 PONTOS FORTES: [Liste 3-4 pontos positivos específicos da redação]",
    "🟡 PONTOS A MELHORAR: [Liste 3-4 aspectos que podem melhorar]",
    "🔴 PONTOS CRÍTICOS: [Liste 2-3 problemas graves]"
  ],
  "erros_detectados": [
    "Erro 1 com exemplo",
    "Erro 2 com exemplo",
    "Erro 3 com exemplo"
  ],
  "dicas_personalizadas": [
    "💡 C1: [Dica gramática]",
    "💡 C2: [Dica tema]",
    "💡 C3: [Dica argumentação]",
    "💡 C4: [Dica coesão]",
    "💡 C5: [Dica proposta]"
  ],
  "texto_corrigido": "Versão corrigida"
}

CRITÉRIOS (0-200, múltiplos de 20):
C1: Gramática | C2: Tema | C3: Argumentação | C4: Coesão | C5: Proposta (AÇÃO+AGENTE+MODO+FINALIDADE+DETALHAMENTO)

ESCALA: 200=Excelente | 160=Bom | 120=Regular | 80=Fraco

JSON PURO!`

    // Lista de endpoints para tentar
    const endpoints = [
      // Novos modelos (v1beta)
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`,
      // Modelos antigos (v1beta)
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
      // v1
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`,
    ]

    let ultimoErro = null

    for (const endpoint of endpoints) {
      try {
        const modelName = endpoint.split('/models/')[1]?.split(':')[0] || 'unknown'
        console.log(`🔄 Tentando: ${modelName}...`)

        const response = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4096,
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.log(`❌ ${modelName}: ${errorData.error?.message || 'erro desconhecido'}`)
          ultimoErro = errorData
          continue
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (!text) {
          console.log(`⚠️ ${modelName}: resposta vazia`)
          continue
        }

        console.log(`✅ FUNCIONOU com: ${modelName}`)
        console.log('📄 Primeiros 300 chars:', text.substring(0, 300))
        
        // Limpar e extrair JSON
        let jsonText = text.trim()
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        
        const jsonStart = jsonText.indexOf('{')
        const jsonEnd = jsonText.lastIndexOf('}') + 1
        
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          jsonText = jsonText.substring(jsonStart, jsonEnd)
        }
        
        const correcao: CorrecaoRedacao = JSON.parse(jsonText)
        
        console.log('✅ JSON parseado!')
        console.log('📊 Notas:', correcao.notas_competencias)
        
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
          comentarios: correcao.comentarios,
          erros_detectados: correcao.erros_detectados,
          dicas_personalizadas: correcao.dicas_personalizadas,
          texto_corrigido: correcao.texto_corrigido || textoOriginal
        }
        
        console.log('🎯 Nota final:', correcaoValidada.nota_total)
        
        return NextResponse.json(correcaoValidada)

      } catch (err: any) {
        console.log(`⚠️ Erro:`, err.message)
        ultimoErro = err
        continue
      }
    }

    // Se nenhum funcionou
    throw new Error('Nenhum modelo do Gemini está disponível. Gere uma nova API key em: https://aistudio.google.com/app/apikey')
    
  } catch (error: any) {
    console.error('💥 ERRO FINAL:', error?.message)
    
    const fallbackCorrecao: CorrecaoRedacao = {
      nota_total: 600,
      notas_competencias: { C1: 120, C2: 100, C3: 120, C4: 120, C5: 140 },
      comentarios: [
        "🔴 SUA API KEY DO GEMINI NÃO TEM ACESSO",
        "📝 SOLUÇÕES:",
        "1️⃣ Gere nova key em: https://aistudio.google.com/app/apikey",
        "2️⃣ Aceite os termos de uso no Google AI Studio",
        "3️⃣ Verifique se Gemini está disponível no seu país",
        "4️⃣ Use VPN se estiver em região restrita"
      ],
      erros_detectados: [
        "Nenhum modelo Gemini acessível",
        "Possível restrição regional ou API key inválida"
      ],
      dicas_personalizadas: [
        "🌍 O Gemini pode não estar disponível no Brasil",
        "🔑 Tente gerar uma NOVA API key",
        "🔄 Delete a antiga e crie outra",
        "✅ Ou use OpenRouter (funciona em qualquer país)",
        "👉 https://openrouter.ai - tem Gemini grátis"
      ],
      texto_corrigido: textoOriginal
    }
    
    return NextResponse.json(fallbackCorrecao)
  }
}