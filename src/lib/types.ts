// Tipos principais do ENEM Genius
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  studyHours: number;
  focusAreas: string[];
  notifications: boolean;
}

export interface Redacao {
  id: string;
  userId: string;
  textoOriginal: string;
  textoRevisado?: string;
  notaTotal: number;
  competencias: Competencia[];
  ocrText?: string;
  feedback: string;
  tema: string;
  ano?: number;
  createdAt: Date;
}

export interface Competencia {
  id: number;
  nome: string;
  nota: number;
  feedback: string;
  trechosExemplos: string[];
  peso: number;
}

export interface Simulado {
  id: string;
  userId: string;
  tipo: 'linguagens' | 'matematica' | 'humanas' | 'natureza' | 'completo';
  notaEstimada: number;
  respostas: RespostaSimulado[];
  tempoGasto: number;
  createdAt: Date;
}

export interface RespostaSimulado {
  questaoId: string;
  resposta: string;
  correta: boolean;
  tempoResposta: number;
}

export interface Questao {
  id: string;
  enunciado: string;
  area: 'linguagens' | 'matematica' | 'humanas' | 'natureza';
  ano: number;
  alternativas: Alternativa[];
  gabarito: string;
  explicacao: string;
  probabilidadePredita: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tags: string[];
}

export interface Alternativa {
  letra: string;
  texto: string;
}

export interface PlanoEstudos {
  id: string;
  userId: string;
  plano: ItemPlano[];
  progresso: number;
  metaSemanal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemPlano {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  estimativaHoras: number;
  concluido: boolean;
  dataLimite: Date;
  recursos: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  type: 'text' | 'image' | 'voice';
  context?: string;
  createdAt: Date;
}

export interface RedacaoNota1000 {
  id: string;
  titulo: string;
  tema: string;
  ano: number;
  texto: string;
  analise: AnaliseRedacao;
  tags: string[];
}

export interface AnaliseRedacao {
  estrutura: string;
  argumentacao: string;
  repertorio: string[];
  pontosFortesEstrutura: string[];
  tecnicasUtilizadas: string[];
  competencias: Competencia[];
}

export interface DashboardStats {
  totalRedacoes: number;
  mediaNotas: number;
  simuladosFeitos: number;
  horasEstudadas: number;
  progressoPlano: number;
  pontosFracos: string[];
  pontosFortes: string[];
  proximasMetas: string[];
}

// Tipos para integração com IA
export interface AIPromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  examples: FewShotExample[];
}

export interface FewShotExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: BoundingBox[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

// Tipos para API responses
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}