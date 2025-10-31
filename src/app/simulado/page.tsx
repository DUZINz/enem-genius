'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Target,
  ArrowLeft
} from 'lucide-react'
import { useSimulado } from '@/hooks/useSimulado'
import type { SimuladoGerado, RespostaAluno, CorrecaoSimulado, QuestaoSimulado } from '@/lib/types/simulado'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useUserStats } from '@/hooks/useUserStats'

export default function SimuladoPage() {
  const [activeTab, setActiveTab] = useState('config')
  const [simuladoAtual, setSimuladoAtual] = useState<SimuladoGerado | null>(null)
  const [respostas, setRespostas] = useState<RespostaAluno[]>([])
  const [correcao, setCorrecao] = useState<CorrecaoSimulado | null>(null)
  const [areasEscolhidas, setAreasEscolhidas] = useState<string[]>(['linguagens', 'humanas', 'natureza', 'matematica'])
  const [quantidade, setQuantidade] = useState(20)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [iniciado, setIniciado] = useState(false)

  const { gerarSimulado, corrigirSimulado, isLoading, erro } = useSimulado()
  const { registrarSimulado } = useUserStats()

  // Timer
  useState(() => {
    let interval: NodeJS.Timeout
    if (iniciado && !correcao) {
      interval = setInterval(() => {
        setTempoDecorrido(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  })

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const handleGerarSimulado = async () => {
    const simulado = await gerarSimulado(areasEscolhidas, quantidade)
    if (simulado) {
      setSimuladoAtual(simulado)
      setRespostas(simulado.questoes.map(q => ({ questaoId: q.id, respostaMarcada: null })))
      setActiveTab('simulado')
      setIniciado(true)
      setTempoDecorrido(0)
    }
  }

  const handleMarcarResposta = (questaoId: string, alternativa: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setRespostas(prev => 
      prev.map(r => r.questaoId === questaoId ? { ...r, respostaMarcada: alternativa } : r)
    )
  }

  const handleCorrigir = async () => {
    if (!simuladoAtual) return
    
    const resultado = await corrigirSimulado(simuladoAtual.questoes, respostas)
    if (resultado) {
      setCorrecao(resultado)
      setActiveTab('resultado')
      setIniciado(false)
    }
  }

  const getCorNota = (nota: number) => {
    if (nota >= 700) return 'text-green-600'
    if (nota >= 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const toggleArea = (area: string) => {
    setAreasEscolhidas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    )
  }

  const handleFinalizarSimulado = async () => {
    if (!simuladoAtual) return

    // Calcular nota final (exemplo: soma das notas das questões)
    const notaFinal = correcao.acertos * 10 // Apenas um exemplo, ajuste conforme a lógica real

    // 🎯 REGISTRAR NO SISTEMA GLOBAL
    const tempoTotal = Math.floor((Date.now().getTime() - tempoDecorrido) / 1000 / 60) // em minutos
    const resultado = registrarSimulado(notaFinal, tempoTotal)
    
    alert(`🎉 Simulado concluído!\n\nNota: ${notaFinal}\n+${resultado.xpGanho} XP`)
    
    // Navegar para resultado
    // router.push(`/simulado/resultado?nota=${notaFinal}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Simulados ENEM
                </h1>
              </div>
            </div>
            {iniciado && !correcao && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                {formatarTempo(tempoDecorrido)}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="config" disabled={iniciado}>
              <FileText className="h-4 w-4 mr-2" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="simulado" disabled={!simuladoAtual}>
              <BookOpen className="h-4 w-4 mr-2" />
              Simulado
            </TabsTrigger>
            <TabsTrigger value="resultado" disabled={!correcao}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Resultado
            </TabsTrigger>
          </TabsList>

          {/* CONFIGURAÇÃO */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Configure seu Simulado
                </CardTitle>
                <CardDescription>
                  Escolha as áreas de conhecimento e o número de questões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Áreas */}
                <div>
                  <h3 className="font-semibold mb-3">Áreas de Conhecimento:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'linguagens', nome: 'Linguagens e Códigos', icon: '📘', cor: 'blue' },
                      { id: 'humanas', nome: 'Ciências Humanas', icon: '🗺️', cor: 'green' },
                      { id: 'natureza', nome: 'Ciências da Natureza', icon: '🧪', cor: 'purple' },
                      { id: 'matematica', nome: 'Matemática', icon: '🔢', cor: 'orange' }
                    ].map(area => (
                      <div
                        key={area.id}
                        onClick={() => toggleArea(area.id)}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          areasEscolhidas.includes(area.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Checkbox checked={areasEscolhidas.includes(area.id)} />
                        <span className="text-2xl">{area.icon}</span>
                        <span className="font-medium text-sm">{area.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantidade */}
                <div>
                  <h3 className="font-semibold mb-3">Número de Questões:</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 30, 45].map(num => (
                      <Button
                        key={num}
                        variant={quantidade === num ? 'default' : 'outline'}
                        onClick={() => setQuantidade(num)}
                      >
                        {num} questões
                      </Button>
                    ))}
                  </div>
                </div>

                {erro && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{erro}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleGerarSimulado} 
                  disabled={isLoading || areasEscolhidas.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando Simulado com IA...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Gerar Simulado com IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">ℹ️ Sobre o Simulado</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Questões geradas por IA no estilo ENEM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Correção automática com escala TRI simulada (300-1000 pontos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Feedback detalhado com pontos fortes e fracos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Recomendações personalizadas de estudo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIMULADO */}
          <TabsContent value="simulado" className="space-y-6">
            {simuladoAtual && (
              <>
                {/* Progresso */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Respondidas: {respostas.filter(r => r.respostaMarcada !== null).length}/{simuladoAtual.totalQuestoes}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((respostas.filter(r => r.respostaMarcada !== null).length / simuladoAtual.totalQuestoes) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(respostas.filter(r => r.respostaMarcada !== null).length / simuladoAtual.totalQuestoes) * 100} 
                    />
                  </CardContent>
                </Card>

                {/* Questões */}
                <div className="space-y-4">
                  {simuladoAtual.questoes.map((questao, index) => {
                    const respostaAtual = respostas.find(r => r.questaoId === questao.id)
                    
                    return (
                      <Card key={questao.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                              <Badge variant="outline" className="shrink-0">
                                #{questao.numero}
                              </Badge>
                              <div>
                                <Badge className="mb-2">{questao.disciplina}</Badge>
                                <p className="text-xs text-muted-foreground">{questao.tema}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={questao.dificuldade === 'dificil' ? 'destructive' : questao.dificuldade === 'medio' ? 'default' : 'secondary'}
                            >
                              {questao.dificuldade === 'dificil' ? 'Difícil' : questao.dificuldade === 'medio' ? 'Médio' : 'Fácil'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm leading-relaxed">{questao.comando}</p>
                          
                          <div className="space-y-2">
                            {questao.alternativas.map(alt => (
                              <div
                                key={alt.letra}
                                onClick={() => handleMarcarResposta(questao.id, alt.letra)}
                                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                  respostaAtual?.respostaMarcada === alt.letra
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                    respostaAtual?.respostaMarcada === alt.letra
                                      ? 'border-blue-500 bg-blue-500 text-white'
                                      : 'border-gray-300'
                                  }`}>
                                    {alt.letra}
                                  </div>
                                  <p className="text-sm flex-1">{alt.texto}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Botão Finalizar */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-center">
                        <span className="font-semibold">
                          {respostas.filter(r => r.respostaMarcada !== null).length}
                        </span>
                        {' '}de{' '}
                        <span className="font-semibold">{simuladoAtual.totalQuestoes}</span>
                        {' '}questões respondidas
                      </p>
                      <Button 
                        onClick={handleCorrigir}
                        disabled={isLoading}
                        size="lg"
                        className="w-full max-w-md"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Corrigindo com IA...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Finalizar e Ver Resultado
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* RESULTADO */}
          <TabsContent value="resultado" className="space-y-6">
            {correcao && simuladoAtual && (
              <>
                {/* Nota Geral */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-6 h-6 text-yellow-600" />
                          Resultado do Simulado
                        </CardTitle>
                        <CardDescription>
                          Tempo total: {formatarTempo(tempoDecorrido)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={`text-5xl font-bold ${getCorNota(correcao.notaTotal)}`}>
                          {correcao.notaTotal}
                        </p>
                        <p className="text-sm text-muted-foreground">pontos (escala TRI)</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-green-600">{correcao.acertos}</p>
                        <p className="text-xs text-muted-foreground">Acertos</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">{correcao.erros}</p>
                        <p className="text-xs text-muted-foreground">Erros</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-gray-600">{correcao.emBranco}</p>
                        <p className="text-xs text-muted-foreground">Em Branco</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(correcao.notaPorArea).map(([area, nota]) => (
                        <div key={area} className="text-center p-3 bg-white border rounded-lg">
                          <p className={`text-2xl font-bold ${getCorNota(nota)}`}>{nota}</p>
                          <p className="text-xs text-muted-foreground capitalize">{area}</p>
                          <Progress value={(nota / 1000) * 100} className="h-1 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pontos Fortes e Fracos */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-5 h-5" />
                        Pontos Fortes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {correcao.pontoFortes.map((ponto, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <TrendingDown className="w-5 h-5" />
                        Pontos Fracos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {correcao.pontosFracos.map((ponto, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recomendações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Recomendações de Estudo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {correcao.recomendacoes.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Questões Erradas */}
                {correcao.questoesErradas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Questões que você errou ({correcao.questoesErradas.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {correcao.questoesErradas.map((erro, index) => (
                          <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline">Questão #{erro.numero}</Badge>
                              <Badge>{erro.disciplina}</Badge>
                            </div>
                            <p className="text-sm font-medium mb-2">{erro.tema}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-muted-foreground">Sua resposta: </span>
                                <span className="font-bold text-red-600">{erro.respostaMarcada}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Gabarito: </span>
                                <span className="font-bold text-green-600">{erro.gabaritoCorreto}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{erro.explicacao}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Botão Novo Simulado */}
                <Button
                  onClick={() => {
                    setSimuladoAtual(null)
                    setCorrecao(null)
                    setRespostas([])
                    setTempoDecorrido(0)
                    setActiveTab('config')
                  }}
                  className="w-full"
                  size="lg"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Fazer Novo Simulado
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}