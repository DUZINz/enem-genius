export interface QuestaoSimulado {
  id: string
  numero: number
  disciplina: string
  area: 'linguagens' | 'humanas' | 'natureza' | 'matematica'
  comando: string
  alternativas: {
    letra: 'A' | 'B' | 'C' | 'D' | 'E'
    texto: string
  }[]
  gabarito: 'A' | 'B' | 'C' | 'D' | 'E'
  dificuldade: 'facil' | 'medio' | 'dificil'
  tema: string
}

export interface SimuladoGerado {
  id: string
  titulo: string
  dataGeracao: Date
  questoes: QuestaoSimulado[]
  totalQuestoes: number
  distribuicao: {
    linguagens: number
    humanas: number
    natureza: number
    matematica: number
  }
}

export interface RespostaAluno {
  questaoId: string
  respostaMarcada: 'A' | 'B' | 'C' | 'D' | 'E' | null
}

export interface CorrecaoSimulado {
  notaTotal: number
  notaPorArea: {
    linguagens: number
    humanas: number
    natureza: number
    matematica: number
  }
  acertos: number
  erros: number
  emBranco: number
  percentualAcerto: number
  questoesErradas: {
    numero: number
    disciplina: string
    tema: string
    respostaMarcada: string
    gabaritoCorreto: string
    explicacao: string
  }[]
  pontosFracos: string[]
  pontoFortes: string[]
  recomendacoes: string[]
}