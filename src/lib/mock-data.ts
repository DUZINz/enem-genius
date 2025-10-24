import { Redacao, Competencia, Questao, AIPromptTemplate } from './types'

// Mock data para desenvolvimento
export const mockUser = {
  id: '1',
  name: 'Ana Silva',
  email: 'ana@exemplo.com',
  role: 'student' as const,
  preferences: {
    theme: 'light' as const,
    studyHours: 4,
    focusAreas: ['redacao', 'matematica'],
    notifications: true
  },
  createdAt: new Date('2024-01-15T10:00:00.000Z')
}

export const mockCompetencias: Competencia[] = [
  {
    id: 1,
    nome: 'Demonstrar domínio da modalidade escrita formal da língua portuguesa',
    nota: 180,
    feedback: 'Excelente domínio da norma culta, com poucos desvios gramaticais.',
    trechosExemplos: ['uso correto de vírgulas', 'concordância verbal adequada'],
    peso: 1
  },
  {
    id: 2,
    nome: 'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento',
    nota: 160,
    feedback: 'Boa compreensão do tema, mas poderia explorar mais conceitos interdisciplinares.',
    trechosExemplos: ['contextualização histórica', 'dados estatísticos'],
    peso: 1
  },
  {
    id: 3,
    nome: 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos',
    nota: 140,
    feedback: 'Argumentação sólida, mas organização pode ser melhorada.',
    trechosExemplos: ['uso de conectivos', 'progressão temática'],
    peso: 1
  },
  {
    id: 4,
    nome: 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
    nota: 170,
    feedback: 'Excelente uso de recursos coesivos e estruturas argumentativas.',
    trechosExemplos: ['operadores argumentativos', 'períodos complexos'],
    peso: 1
  },
  {
    id: 5,
    nome: 'Elaborar proposta de intervenção para o problema abordado',
    nota: 150,
    feedback: 'Proposta viável, mas poderia ser mais detalhada e específica.',
    trechosExemplos: ['agente responsável', 'meio de execução'],
    peso: 1
  }
]

export const mockRedacoes: Redacao[] = [
  {
    id: '1',
    userId: '1',
    textoOriginal: 'A democratização do acesso ao cinema no Brasil é um tema de grande relevância social...',
    textoRevisado: 'A democratização do acesso ao cinema no Brasil é um tema de grande relevância social e cultural...',
    notaTotal: 800,
    competencias: mockCompetencias,
    feedback: 'Redação bem estruturada com argumentação consistente. Pontos a melhorar: maior diversidade de repertório sociocultural.',
    tema: 'Democratização do acesso ao cinema no Brasil',
    ano: 2019,
    createdAt: new Date('2024-01-20T14:30:00.000Z')
  },
  {
    id: '2',
    userId: '1',
    textoOriginal: 'O estigma associado às doenças mentais no Brasil...',
    notaTotal: 720,
    competencias: mockCompetencias.map(c => ({ ...c, nota: c.nota - 40 })),
    feedback: 'Boa abordagem do tema, mas precisa desenvolver melhor a proposta de intervenção.',
    tema: 'O estigma associado às doenças mentais no Brasil',
    ano: 2020,
    createdAt: new Date('2024-01-18T09:15:00.000Z')
  },
  {
    id: '3',
    userId: '1',
    textoOriginal: 'A importância da educação financeira no Brasil...',
    notaTotal: 680,
    competencias: mockCompetencias.map(c => ({ ...c, nota: c.nota - 60 })),
    feedback: 'Tema bem desenvolvido, mas necessita de mais repertório sociocultural e melhor estruturação da proposta.',
    tema: 'A importância da educação financeira no Brasil',
    ano: 2021,
    createdAt: new Date('2024-01-16T16:45:00.000Z')
  }
]

export const mockQuestoes: Questao[] = [
  {
    id: '1',
    enunciado: 'Leia o texto abaixo e responda: "A literatura brasileira do século XIX foi marcada por diferentes movimentos artísticos..." Qual movimento literário é caracterizado pelo subjetivismo e individualismo?',
    area: 'linguagens',
    ano: 2023,
    alternativas: [
      { letra: 'A', texto: 'Realismo' },
      { letra: 'B', texto: 'Naturalismo' },
      { letra: 'C', texto: 'Romantismo' },
      { letra: 'D', texto: 'Parnasianismo' },
      { letra: 'E', texto: 'Simbolismo' }
    ],
    gabarito: 'C',
    explicacao: 'O Romantismo é caracterizado pelo subjetivismo, individualismo, sentimentalismo e valorização das emoções.',
    probabilidadePredita: 85,
    dificuldade: 'medio',
    tags: ['literatura', 'movimentos-literarios', 'romantismo']
  },
  {
    id: '2',
    enunciado: 'Uma função f(x) = 2x + 3. Qual o valor de f(5)?',
    area: 'matematica',
    ano: 2023,
    alternativas: [
      { letra: 'A', texto: '8' },
      { letra: 'B', texto: '10' },
      { letra: 'C', texto: '13' },
      { letra: 'D', texto: '15' },
      { letra: 'E', texto: '18' }
    ],
    gabarito: 'C',
    explicacao: 'Substituindo x = 5 na função: f(5) = 2(5) + 3 = 10 + 3 = 13',
    probabilidadePredita: 92,
    dificuldade: 'facil',
    tags: ['funcoes', 'algebra', 'calculo-basico']
  }
]

export const mockRedacoesNota1000 = [
  {
    id: '1',
    titulo: 'A democratização do acesso ao cinema no Brasil',
    tema: 'Democratização do acesso ao cinema no Brasil',
    ano: 2019,
    texto: 'A sétima arte, como é conhecido o cinema, possui um papel fundamental na formação cultural e social dos indivíduos...',
    analise: {
      estrutura: 'Estrutura dissertativa-argumentativa perfeita com introdução, desenvolvimento e conclusão bem delimitados.',
      argumentacao: 'Argumentação sólida baseada em dados estatísticos, exemplos históricos e repertório sociocultural diversificado.',
      repertorio: ['Dados do IBGE sobre acesso ao cinema', 'Lei de Incentivo à Cultura', 'Conceito de indústria cultural de Adorno'],
      pontosFortesEstrutura: ['Tese clara na introdução', 'Dois argumentos bem desenvolvidos', 'Proposta de intervenção completa'],
      tecnicasUtilizadas: ['Uso de dados estatísticos', 'Exemplificação', 'Comparação histórica', 'Citação indireta'],
      competencias: mockCompetencias
    },
    tags: ['cinema', 'cultura', 'democratizacao', 'nota-1000']
  }
]

export const mockDashboardStats = {
  totalRedacoes: 12,
  mediaNotas: 756,
  simuladosFeitos: 8,
  horasEstudadas: 45,
  progressoPlano: 68,
  pontosFracos: ['Proposta de intervenção', 'Repertório sociocultural'],
  pontosFortes: ['Domínio da norma culta', 'Organização textual'],
  proximasMetas: ['Melhorar nota em Matemática', 'Completar 5 redações esta semana']
}

// Templates de prompts para IA
export const aiPromptTemplates: AIPromptTemplate[] = [
  {
    id: 'correcao-redacao',
    name: 'Correção de Redação ENEM',
    template: `Você é um corretor especialista em redações do ENEM. Analise a redação abaixo segundo as 5 competências:

REDAÇÃO:
{texto}

TEMA: {tema}
ANO: {ano}

Forneça uma análise detalhada em JSON com:
- nota_total (0-1000)
- competencias: array com id, nota (0-200), feedback, trechos_exemplos
- versao_revisada: texto com marcações [SUGESTÃO: texto]
- dicas_repertorio: array de sugestões
- tag_de_estilo: classificação do estilo

Seja rigoroso mas construtivo no feedback.`,
    variables: ['texto', 'tema', 'ano'],
    examples: [
      {
        input: 'Redação sobre violência contra a mulher...',
        output: '{"nota_total": 840, "competencias": [...], "versao_revisada": "...", "dicas_repertorio": [...]}',
        explanation: 'Exemplo de correção completa com feedback detalhado'
      }
    ]
  },
  {
    id: 'mentor-chat',
    name: 'Agente Mentor ENEM',
    template: `Você é um mentor especialista em ENEM, sempre encorajador e didático.

CONTEXTO DO ESTUDANTE:
- Área de dificuldade: {area_dificuldade}
- Último desempenho: {ultimo_desempenho}
- Meta: {meta}

PERGUNTA: {pergunta}

Responda de forma:
- Clara e didática
- Encorajadora
- Com exemplos práticos
- Incluindo referências quando relevante
- Sugerindo próximos passos

Mantenha tom motivacional e foque no aprendizado.`,
    variables: ['area_dificuldade', 'ultimo_desempenho', 'meta', 'pergunta'],
    examples: [
      {
        input: 'Como melhorar minha argumentação na redação?',
        output: 'Ótima pergunta! A argumentação é fundamental...',
        explanation: 'Resposta didática e encorajadora com dicas práticas'
      }
    ]
  }
]

export const mockPlanoEstudos = {
  id: '1',
  userId: '1',
  plano: [
    {
      id: '1',
      titulo: 'Revisão de Funções Matemáticas',
      descricao: 'Estudar funções do 1º e 2º grau, exponenciais e logarítmicas',
      area: 'matematica',
      estimativaHoras: 4,
      concluido: true,
      dataLimite: new Date('2024-02-01T23:59:59.000Z'),
      recursos: ['Videoaulas', 'Lista de exercícios', 'Simulado']
    },
    {
      id: '2',
      titulo: 'Redação - Competência 5',
      descricao: 'Praticar elaboração de propostas de intervenção',
      area: 'redacao',
      estimativaHoras: 3,
      concluido: false,
      dataLimite: new Date('2024-02-03T23:59:59.000Z'),
      recursos: ['Exemplos nota 1000', 'Template de proposta', 'Exercícios práticos']
    },
    {
      id: '3',
      titulo: 'História do Brasil - República',
      descricao: 'Revisar período republicano e principais eventos',
      area: 'humanas',
      estimativaHoras: 5,
      concluido: false,
      dataLimite: new Date('2024-02-05T23:59:59.000Z'),
      recursos: ['Resumos', 'Mapas mentais', 'Questões comentadas']
    }
  ],
  progresso: 45,
  metaSemanal: 12,
  createdAt: new Date('2024-01-15T08:00:00.000Z'),
  updatedAt: new Date('2024-01-25T18:30:00.000Z')
}