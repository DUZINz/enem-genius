// Tipos para o sistema de Mentor IA

export interface PerfilEscrita {
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

export interface CorrecaoRedacao {
  id: string
  aluno_id: string
  texto_original: string
  texto_corrigido: string
  notas_competencias: {
    C1: number
    C2: number
    C3: number
    C4: number
    C5: number
  }
  nota_total: number
  comentarios: string[]
  erros_detectados: string[]
  dicas_personalizadas: string[]
  data_correcao: string
  tempo_correcao: number // em segundos
}

export interface HistoricoEvolucao {
  aluno_id: string
  correcoes: CorrecaoRedacao[]
  estatisticas: {
    total_redacoes: number
    media_geral: number
    melhor_nota: number
    competencia_mais_forte: string
    competencia_mais_fraca: string
    evolucao_mensal: {
      mes: string
      media: number
      total_redacoes: number
    }[]
  }
}

export interface MensagemChat {
  id: string
  tipo: 'user' | 'mentor'
  conteudo: string
  timestamp: Date
  categoria?: 'redacao' | 'simulado' | 'geral' | 'duvida' | 'correcao'
  anexos?: {
    tipo: 'texto' | 'imagem' | 'audio'
    conteudo: string
    nome?: string
  }[]
  correcao_id?: string // Referência para correção de redação
}

export interface ConfiguracoesMentor {
  aluno_id: string
  preferencias: {
    nivel_detalhamento: 'basico' | 'intermediario' | 'avancado'
    foco_principal: 'gramatica' | 'argumentacao' | 'estrutura' | 'repertorio'
    tom_feedback: 'encorajador' | 'neutro' | 'rigoroso'
    notificacoes: boolean
    lembretes_pratica: boolean
  }
  metas: {
    nota_objetivo: number
    prazo_objetivo: string
    redacoes_por_semana: number
    competencias_prioritarias: string[]
  }
}

export interface RepertorioSociocultural {
  id: string
  categoria: 'literatura' | 'historia' | 'filosofia' | 'sociologia' | 'atualidades' | 'cinema' | 'arte'
  titulo: string
  descricao: string
  como_usar: string
  temas_relacionados: string[]
  nivel_dificuldade: 'basico' | 'intermediario' | 'avancado'
  fonte: string
  data_adicao: string
}

export interface DesafioSemanal {
  id: string
  semana: string
  tema: string
  contexto: string
  instrucoes: string
  tempo_limite: number // em minutos
  participantes: number
  status: 'ativo' | 'finalizado' | 'em_breve'
  premiacao?: string
}

export interface RankingUsuario {
  posicao: number
  aluno_id: string
  nome: string
  avatar?: string
  pontuacao: number
  media_notas: number
  total_redacoes: number
  badges: string[]
  nivel: 'iniciante' | 'intermediário' | 'avançado'
}

// Tipos para análise avançada de texto
export interface AnaliseTexto {
  estrutura: {
    tem_introducao: boolean
    tem_desenvolvimento: boolean
    tem_conclusao: boolean
    paragrafos_desenvolvimento: number
    transicoes_adequadas: boolean
  }
  linguagem: {
    registro_formal: boolean
    variedade_vocabular: number
    conectivos_utilizados: string[]
    problemas_coesao: string[]
  }
  conteudo: {
    compreensao_tema: 'total' | 'parcial' | 'inadequada'
    argumentos_identificados: number
    repertorio_presente: boolean
    tipos_repertorio: string[]
    proposta_intervencao: {
      presente: boolean
      detalhada: boolean
      viavel: boolean
      respeita_direitos: boolean
    }
  }
  metricas: {
    palavras_total: number
    frases_total: number
    paragrafos_total: number
    complexidade_sintaxe: 'baixa' | 'media' | 'alta'
    legibilidade: number
  }
}

// Tipos para gamificação
export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  cor: string
  criterio: string
  raridade: 'comum' | 'raro' | 'epico' | 'lendario'
}

export interface ConquistaUsuario {
  aluno_id: string
  badge_id: string
  data_conquista: string
  progresso?: number // Para badges progressivos
}

// Tipos para relatórios
export interface RelatorioEvolucao {
  aluno_id: string
  periodo: {
    inicio: string
    fim: string
  }
  resumo: {
    total_redacoes: number
    media_periodo: number
    evolucao_percentual: number
    tempo_total_estudo: number // em minutos
  }
  competencias: {
    [key: string]: {
      media_atual: number
      media_anterior: number
      evolucao: number
      status: 'melhorando' | 'estavel' | 'precisa_atencao'
    }
  }
  pontos_fortes: string[]
  areas_melhoria: string[]
  recomendacoes: string[]
  projecao_nota: number
  grafico_evolucao: {
    data: string
    nota: number
  }[]
}

export interface FeedbackPersonalizado {
  tipo: 'elogio' | 'correcao' | 'dica' | 'motivacao'
  conteudo: string
  competencia?: string
  prioridade: 'alta' | 'media' | 'baixa'
  acao_sugerida?: string
}