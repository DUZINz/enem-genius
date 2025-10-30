import { NextRequest, NextResponse } from 'next/server'

// Interface para o perfil de escrita do aluno
interface PerfilEscrita {
  aluno_id: string
  media_notas: {
    C1: number // Norma culta
    C2: number // Compreensão do tema
    C3: number // Organização das informações
    C4: number // Coesão e coerência
    C5: number // Proposta de intervenção
  }
  erros_mais_frequentes: string[]
  pontos_fortes: string[]
  nivel_escrita: 'iniciante' | 'intermediário' | 'avançado'
  estilo: string
  recomendacoes_personalizadas: string[]
  historico_redacoes: number
  ultima_atualizacao: string
}

// Interface para entrada da API
interface EntradaAPI {
  aluno_id: string
  texto: string
  perfil_atual?: PerfilEscrita
}

// Interface para saída da API
interface SaidaAPI {
  texto_corrigido: string
  comentarios: string[]
  notas_competencias: {
    C1: number
    C2: number
    C3: number
    C4: number
    C5: number
  }
  nota_total: number
  erros_detectados: string[]
  dicas_personalizadas: string[]
  recomendacoes_futuras: string[]
  mensagem_motivacional: string
  perfil_atualizado: PerfilEscrita
}

// Função para analisar e corrigir texto
function analisarTexto(texto: string, perfil?: PerfilEscrita) {
  const erros: string[] = []
  const comentarios: string[] = []
  const dicas: string[] = []
  
  // Análise básica de erros comuns
  if (texto.includes('mais') && texto.includes('mais')) {
    erros.push('repetição excessiva')
    comentarios.push('🔴 Evite repetir palavras como "mais" no mesmo parágrafo')
  }
  
  if (!texto.includes('.') || texto.split('.').length < 4) {
    erros.push('estrutura inadequada')
    comentarios.push('🔴 Sua redação precisa ter pelo menos 4 parágrafos bem estruturados')
  }
  
  if (texto.length < 200) {
    erros.push('texto muito curto')
    comentarios.push('🔴 Redações do ENEM devem ter entre 8-30 linhas (aproximadamente 200-800 palavras)')
  }
  
  // Análise de conectivos
  const conectivos = ['portanto', 'assim', 'dessa forma', 'por isso', 'logo', 'consequentemente']
  const temConectivos = conectivos.some(c => texto.toLowerCase().includes(c))
  
  if (!temConectivos) {
    erros.push('falta de conectivos')
    comentarios.push('🟡 Use mais conectivos para melhorar a coesão textual')
    dicas.push('Adicione conectivos como "portanto", "assim", "dessa forma" para ligar suas ideias')
  }
  
  // Análise personalizada baseada no perfil
  if (perfil) {
    if (perfil.erros_mais_frequentes.includes('acentuação')) {
      dicas.push('⚠️ Atenção especial à acentuação - seu ponto de melhoria identificado')
    }
    
    if (perfil.nivel_escrita === 'iniciante') {
      dicas.push('💡 Foque primeiro na estrutura: introdução, desenvolvimento (2 parágrafos) e conclusão')
    } else if (perfil.nivel_escrita === 'avançado') {
      dicas.push('🎯 Seu nível é avançado! Agora foque em repertórios mais sofisticados e argumentação complexa')
    }
  }
  
  return { erros, comentarios, dicas }
}

// Função para calcular notas por competência
function calcularNotas(texto: string, perfil?: PerfilEscrita) {
  const baseScore = 120 // Nota base
  const bonusVariation = 80 // Variação possível
  
  // Simulação de análise mais sofisticada
  const notas = {
    C1: Math.min(200, baseScore + Math.floor(Math.random() * bonusVariation)), // Norma culta
    C2: Math.min(200, baseScore + Math.floor(Math.random() * bonusVariation)), // Tema
    C3: Math.min(200, baseScore + Math.floor(Math.random() * bonusVariation)), // Organização
    C4: Math.min(200, baseScore + Math.floor(Math.random() * bonusVariation)), // Coesão
    C5: Math.min(200, baseScore + Math.floor(Math.random() * bonusVariation))  // Proposta
  }
  
  // Ajustes baseados no perfil
  if (perfil) {
    // Se o aluno tem histórico, use a média anterior como base
    Object.keys(notas).forEach(competencia => {
      const comp = competencia as keyof typeof notas
      const mediaAnterior = perfil.media_notas[comp]
      // Variação de ±20 pontos da média anterior
      notas[comp] = Math.max(0, Math.min(200, mediaAnterior + (Math.random() * 40 - 20)))
    })
  }
  
  return notas
}

// Função para gerar texto corrigido
function gerarTextoCorrigido(texto: string): string {
  let textoCorrigido = texto
  
  // Correções básicas simuladas
  textoCorrigido = textoCorrigido.replace(/mais mais/g, 'mais')
  textoCorrigido = textoCorrigido.replace(/\s+/g, ' ') // Remove espaços duplos
  
  // Adiciona estrutura se necessário
  if (!textoCorrigido.includes('Em primeiro lugar') && !textoCorrigido.includes('Primeiramente')) {
    textoCorrigido = textoCorrigido.replace(/^/, 'Primeiramente, é importante destacar que ')
  }
  
  return textoCorrigido.trim()
}

// Função para atualizar perfil do aluno
function atualizarPerfil(perfilAtual: PerfilEscrita | undefined, novasNotas: any, novosErros: string[]): PerfilEscrita {
  const agora = new Date().toISOString()
  
  if (!perfilAtual) {
    // Criar novo perfil
    return {
      aluno_id: 'user_' + Date.now(),
      media_notas: novasNotas,
      erros_mais_frequentes: novosErros,
      pontos_fortes: ['estrutura básica'],
      nivel_escrita: 'iniciante',
      estilo: 'formal básico',
      recomendacoes_personalizadas: [
        'Pratique a estrutura básica da redação',
        'Leia mais textos argumentativos',
        'Amplie seu repertório sociocultural'
      ],
      historico_redacoes: 1,
      ultima_atualizacao: agora
    }
  }
  
  // Atualizar perfil existente
  const novoHistorico = perfilAtual.historico_redacoes + 1
  
  // Calcular nova média das notas
  const novaMedia = {
    C1: Math.round((perfilAtual.media_notas.C1 + novasNotas.C1) / 2),
    C2: Math.round((perfilAtual.media_notas.C2 + novasNotas.C2) / 2),
    C3: Math.round((perfilAtual.media_notas.C3 + novasNotas.C3) / 2),
    C4: Math.round((perfilAtual.media_notas.C4 + novasNotas.C4) / 2),
    C5: Math.round((perfilAtual.media_notas.C5 + novasNotas.C5) / 2)
  }
  
  // Determinar novo nível
  const mediaGeral = Object.values(novaMedia).reduce((a, b) => a + b, 0) / 5
  let novoNivel: 'iniciante' | 'intermediário' | 'avançado' = 'iniciante'
  
  if (mediaGeral >= 160) novoNivel = 'avançado'
  else if (mediaGeral >= 120) novoNivel = 'intermediário'
  
  // Atualizar erros mais frequentes
  const errosAtualizados = [...new Set([...perfilAtual.erros_mais_frequentes, ...novosErros])]
  
  return {
    ...perfilAtual,
    media_notas: novaMedia,
    erros_mais_frequentes: errosAtualizados,
    nivel_escrita: novoNivel,
    historico_redacoes: novoHistorico,
    ultima_atualizacao: agora,
    recomendacoes_personalizadas: gerarRecomendacoes(novaMedia, errosAtualizados, novoNivel)
  }
}

// Função para gerar recomendações personalizadas
function gerarRecomendacoes(notas: any, erros: string[], nivel: string): string[] {
  const recomendacoes: string[] = []
  
  // Recomendações baseadas nas notas mais baixas
  const competenciasMaisBaixas = Object.entries(notas)
    .sort(([,a], [,b]) => (a as number) - (b as number))
    .slice(0, 2)
  
  competenciasMaisBaixas.forEach(([comp, nota]) => {
    switch (comp) {
      case 'C1':
        if ((nota as number) < 140) recomendacoes.push('Revisar gramática e ortografia')
        break
      case 'C2':
        if ((nota as number) < 140) recomendacoes.push('Praticar interpretação de temas')
        break
      case 'C3':
        if ((nota as number) < 140) recomendacoes.push('Melhorar organização das ideias')
        break
      case 'C4':
        if ((nota as number) < 140) recomendacoes.push('Usar mais conectivos e elementos coesivos')
        break
      case 'C5':
        if ((nota as number) < 140) recomendacoes.push('Elaborar propostas de intervenção mais detalhadas')
        break
    }
  })
  
  // Recomendações baseadas no nível
  if (nivel === 'iniciante') {
    recomendacoes.push('Focar na estrutura básica da redação')
    recomendacoes.push('Praticar parágrafos de desenvolvimento')
  } else if (nivel === 'avançado') {
    recomendacoes.push('Diversificar repertório sociocultural')
    recomendacoes.push('Aprimorar argumentação complexa')
  }
  
  return recomendacoes.slice(0, 4) // Máximo 4 recomendações
}

// Função para gerar mensagem motivacional
function gerarMensagemMotivacional(perfil: PerfilEscrita, notaTotal: number): string {
  const mensagens = {
    iniciante: [
      'Parabéns por começar sua jornada! Cada redação é um passo importante.',
      'Você está no caminho certo! Continue praticando com dedicação.',
      'Ótimo início! Sua evolução será notável com a prática constante.'
    ],
    intermediário: [
      'Excelente progresso! Você já domina o básico e está evoluindo.',
      'Muito bem! Sua dedicação está dando frutos visíveis.',
      'Parabéns pela evolução! Continue focado nos seus objetivos.'
    ],
    avançado: [
      'Impressionante! Você está muito próximo da nota 1000.',
      'Excelente trabalho! Seu nível de escrita é muito bom.',
      'Parabéns! Você demonstra domínio avançado da redação ENEM.'
    ]
  }
  
  const mensagensPorNivel = mensagens[perfil.nivel_escrita]
  const mensagemBase = mensagensPorNivel[Math.floor(Math.random() * mensagensPorNivel.length)]
  
  let complemento = ''
  if (notaTotal >= 900) {
    complemento = ' Você está no caminho da nota 1000! 🌟'
  } else if (notaTotal >= 700) {
    complemento = ' Continue assim e logo chegará aos 900 pontos! 💪'
  } else {
    complemento = ' Cada redação te aproxima mais do seu objetivo! 📈'
  }
  
  return mensagemBase + complemento
}

export async function POST(request: Request) {
  try {
    const { texto } = await request.json()

    if (!texto || texto.trim().length < 50) {
      return NextResponse.json(
        { error: 'Texto muito curto para análise' },
        { status: 400 }
      )
    }

    // Função para arredondar notas para números inteiros
    const arredondarNota = (nota: number): number => {
      return Math.round(Math.max(0, Math.min(200, nota)))
    }

    // Simulação da correção com notas arredondadas
    const notas = {
      C1: arredondarNota(Math.random() * 40 + 160), // 160-200
      C2: arredondarNota(Math.random() * 40 + 160), // 160-200  
      C3: arredondarNota(Math.random() * 40 + 140), // 140-180
      C4: arredondarNota(Math.random() * 40 + 140), // 140-180
      C5: arredondarNota(Math.random() * 40 + 120)  // 120-160
    }

    const notaTotal = Object.values(notas).reduce((sum, nota) => sum + nota, 0)

    const correcao: CorrecaoRedacao = {
      nota_total: notaTotal,
      notas_competencias: notas,
      comentarios: [
        "🟢 Boa estrutura dissertativa com introdução, desenvolvimento e conclusão bem definidos.",
        "🟡 Argumentação presente, mas pode ser mais aprofundada com mais repertório sociocultural.",
        "🔴 Atenção à concordância verbal em alguns trechos.",
        "🟢 Proposta de intervenção completa com agente, ação, meio e detalhamento."
      ],
      erros_detectados: [
        "Concordância verbal",
        "Uso inadequado de conectivos",
        "Repetição de palavras"
      ],
      dicas_personalizadas: [
        "Utilize mais conectivos para melhorar a coesão textual",
        "Incorpore dados estatísticos para fortalecer seus argumentos",
        "Varie o vocabulário para evitar repetições",
        "Detalhe melhor a proposta de intervenção"
      ],
      texto_corrigido: texto.replace(/\b(\w+)\s+\1\b/g, '$1')
    }

    return NextResponse.json(correcao)
  } catch (error) {
    console.error('Erro na correção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}