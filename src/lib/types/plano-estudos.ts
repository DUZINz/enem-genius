export interface PerfilAluno {
  nome: string
  nivelAtual: 'iniciante' | 'intermediario' | 'avancado'
  metaNota: number
  tempoDisponivelDia: number // em horas
  diasDisponiveisSemana: string[] // ['segunda', 'terca', ...]
  areasFortes: string[]
  areasFracas: string[]
  dataProva: Date
  preferencias: {
    horarioEstudo: 'manha' | 'tarde' | 'noite' | 'flexible'
    tipoConteudo: 'teoria' | 'pratica' | 'misto'
    usaPomodoro: boolean
  }
}

export interface AtividadeEstudo {
  id: string
  tipo: 'teoria' | 'exercicios' | 'simulado' | 'redacao' | 'revisao'
  disciplina: string
  area: 'linguagens' | 'humanas' | 'natureza' | 'matematica'
  titulo: string
  descricao: string
  duracaoMinutos: number
  dificuldade: 'facil' | 'medio' | 'dificil'
  recursos: {
    videoaulas?: string[]
    apostilas?: string[]
    exercicios?: number
  }
  concluida: boolean
  dataRealizacao?: Date
  notaObtida?: number
}

export interface DiaEstudo {
  data: Date
  diaSemana: string
  atividades: AtividadeEstudo[]
  tempoTotalMinutos: number
  progresso: number
}

export interface PlanoEstudos {
  id: string
  alunoId: string
  perfil: PerfilAluno
  dataInicio: Date
  dataFim: Date
  diasEstudo: DiaEstudo[]
  metaSemanal: {
    horasEstudo: number
    atividadesConcluidas: number
    topicosRevisados: string[]
  }
  progresso: {
    porcentagemGeral: number
    horasEstudadas: number
    atividadesConcluidas: number
    streak: number
    xpTotal: number
    nivel: number
    badges: Badge[]
  }
  recomendacoes: string[]
  proximaAcao: string
}

export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  dataConquista: Date
  xp: number
}

export interface EstatisticasEstudo {
  disciplina: string
  horasEstudadas: number
  questoesResolvidas: number
  taxaAcerto: number
  evolucao: number // % de melhora
  ultimaRevisao: Date
}