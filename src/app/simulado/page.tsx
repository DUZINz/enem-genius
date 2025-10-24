'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  BarChart3,
  Target,
  BookOpen,
  Users,
  Brain,
  Lightbulb,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { mockQuestoes } from '@/lib/mock-data'
import { formatDuration, getAreaColor } from '@/lib/utils'

interface SimuladoState {
  questaoAtual: number
  respostas: Record<string, string>
  tempoInicio: number
  tempoRestante: number
  finalizado: boolean
  area: string
}

interface ResultadoSimulado {
  acertos: number
  total: number
  nota: number
  tempoTotal: number
  desempenhoArea: Record<string, number>
}

export default function SimuladoPage() {
  const [simulado, setSimulado] = useState<SimuladoState>({
    questaoAtual: 0,
    respostas: {},
    tempoInicio: Date.now(),
    tempoRestante: 45 * 60, // 45 minutos em segundos
    finalizado: false,
    area: 'completo'
  })
  
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null)
  const [mostrarExplicacao, setMostrarExplicacao] = useState<Record<string, boolean>>({})

  // Timer
  useEffect(() => {
    if (simulado.finalizado) return

    const timer = setInterval(() => {
      setSimulado(prev => {
        if (prev.tempoRestante <= 1) {
          finalizarSimulado()
          return { ...prev, tempoRestante: 0, finalizado: true }
        }
        return { ...prev, tempoRestante: prev.tempoRestante - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [simulado.finalizado])

  const questoes = mockQuestoes.slice(0, 10) // Simulado com 10 questões
  const questaoAtual = questoes[simulado.questaoAtual]

  const selecionarResposta = (questaoId: string, resposta: string) => {
    setSimulado(prev => ({
      ...prev,
      respostas: { ...prev.respostas, [questaoId]: resposta }
    }))
  }

  const proximaQuestao = () => {
    if (simulado.questaoAtual < questoes.length - 1) {
      setSimulado(prev => ({ ...prev, questaoAtual: prev.questaoAtual + 1 }))
    }
  }

  const questaoAnterior = () => {
    if (simulado.questaoAtual > 0) {
      setSimulado(prev => ({ ...prev, questaoAtual: prev.questaoAtual - 1 }))
    }
  }

  const finalizarSimulado = () => {
    const acertos = questoes.filter(q => simulado.respostas[q.id] === q.gabarito).length
    const nota = Math.round((acertos / questoes.length) * 1000)
    const tempoTotal = Math.round((Date.now() - simulado.tempoInicio) / 1000)
    
    const desempenhoArea: Record<string, number> = {}
    questoes.forEach(q => {
      if (!desempenhoArea[q.area]) desempenhoArea[q.area] = 0
      if (simulado.respostas[q.id] === q.gabarito) {
        desempenhoArea[q.area]++
      }
    })

    setResultado({
      acertos,
      total: questoes.length,
      nota,
      tempoTotal,
      desempenhoArea
    })

    setSimulado(prev => ({ ...prev, finalizado: true }))
  }

  const toggleExplicacao = (questaoId: string) => {
    setMostrarExplicacao(prev => ({
      ...prev,
      [questaoId]: !prev[questaoId]
    }))
  }

  if (resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <h1 className="text-xl font-bold text-gray-900">Resultado do Simulado</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Resultado Geral */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {resultado.nota}
                  </div>
                  <p className="text-gray-600">Nota Final</p>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {resultado.acertos}/{resultado.total}
                  </div>
                  <p className="text-gray-600">Acertos</p>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {Math.round((resultado.acertos / resultado.total) * 100)}%
                  </div>
                  <p className="text-gray-600">Aproveitamento</p>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {formatDuration(resultado.tempoTotal)}
                  </div>
                  <p className="text-gray-600">Tempo Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desempenho por Área */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Desempenho por Área</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(resultado.desempenhoArea).map(([area, acertos]) => {
                  const total = questoes.filter(q => q.area === area).length
                  const percentual = total > 0 ? (acertos / total) * 100 : 0
                  
                  return (
                    <div key={area} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className={getAreaColor(area)}>
                          {area.charAt(0).toUpperCase() + area.slice(1)}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {acertos}/{total}
                        </span>
                      </div>
                      <Progress value={percentual} className="h-2" />
                      <p className="text-xs text-gray-600 text-center">
                        {Math.round(percentual)}% de aproveitamento
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Revisão das Questões */}
          <Card>
            <CardHeader>
              <CardTitle>Revisão das Questões</CardTitle>
              <CardDescription>
                Veja suas respostas e as explicações detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questoes.map((questao, index) => {
                const respostaUsuario = simulado.respostas[questao.id]
                const acertou = respostaUsuario === questao.gabarito
                
                return (
                  <div key={questao.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline">Questão {index + 1}</Badge>
                          <Badge className={getAreaColor(questao.area)}>
                            {questao.area}
                          </Badge>
                          <Badge variant={acertou ? 'default' : 'destructive'}>
                            {acertou ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {acertou ? 'Acertou' : 'Errou'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-4">{questao.enunciado}</p>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {questao.alternativas.map((alt) => {
                            let className = "p-3 rounded border text-sm"
                            
                            if (alt.letra === questao.gabarito) {
                              className += " bg-green-50 border-green-200 text-green-800"
                            } else if (alt.letra === respostaUsuario && !acertou) {
                              className += " bg-red-50 border-red-200 text-red-800"
                            } else {
                              className += " bg-gray-50 border-gray-200"
                            }
                            
                            return (
                              <div key={alt.letra} className={className}>
                                <span className="font-semibold mr-2">{alt.letra})</span>
                                {alt.texto}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Sua resposta: <span className="font-semibold">{respostaUsuario || 'Não respondida'}</span>
                        {' • '}
                        Gabarito: <span className="font-semibold text-green-600">{questao.gabarito}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExplicacao(questao.id)}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        {mostrarExplicacao[questao.id] ? 'Ocultar' : 'Ver'} Explicação
                      </Button>
                    </div>
                    
                    {mostrarExplicacao[questao.id] && (
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Explicação:</strong> {questao.explicacao}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/simulado">
                <BarChart3 className="h-4 w-4 mr-2" />
                Fazer Novo Simulado
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/redacao">
                <BookOpen className="h-4 w-4 mr-2" />
                Praticar Redação
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Simulado ENEM</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="font-mono text-orange-600">
                  {formatDuration(simulado.tempoRestante)}
                </span>
              </div>
              
              <Badge variant="outline">
                {simulado.questaoAtual + 1} de {questoes.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso do Simulado</span>
            <span>{Math.round(((simulado.questaoAtual + 1) / questoes.length) * 100)}%</span>
          </div>
          <Progress value={((simulado.questaoAtual + 1) / questoes.length) * 100} className="h-2" />
        </div>

        {/* Questão Atual */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">
                  Questão {simulado.questaoAtual + 1}
                </Badge>
                <Badge className={getAreaColor(questaoAtual.area)}>
                  {questaoAtual.area.charAt(0).toUpperCase() + questaoAtual.area.slice(1)}
                </Badge>
                <Badge variant="secondary">
                  {questaoAtual.dificuldade}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>{questaoAtual.probabilidadePredita}% probabilidade</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-800 leading-relaxed">
                {questaoAtual.enunciado}
              </p>
            </div>

            <RadioGroup
              value={simulado.respostas[questaoAtual.id] || ''}
              onValueChange={(value) => selecionarResposta(questaoAtual.id, value)}
              className="space-y-3"
            >
              {questaoAtual.alternativas.map((alternativa) => (
                <div key={alternativa.letra} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem 
                    value={alternativa.letra} 
                    id={alternativa.letra}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={alternativa.letra} 
                    className="flex-1 cursor-pointer text-sm leading-relaxed"
                  >
                    <span className="font-semibold mr-2">{alternativa.letra})</span>
                    {alternativa.texto}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={questaoAnterior}
            disabled={simulado.questaoAtual === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center space-x-4">
            {simulado.questaoAtual === questoes.length - 1 ? (
              <Button
                onClick={finalizarSimulado}
                disabled={!simulado.respostas[questaoAtual.id]}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Simulado
              </Button>
            ) : (
              <Button
                onClick={proximaQuestao}
                disabled={!simulado.respostas[questaoAtual.id]}
                size="lg"
              >
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Mapa de Questões */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Mapa de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questoes.map((_, index) => {
                const respondida = simulado.respostas[questoes[index].id]
                const atual = index === simulado.questaoAtual
                
                return (
                  <button
                    key={index}
                    onClick={() => setSimulado(prev => ({ ...prev, questaoAtual: index }))}
                    className={`
                      w-10 h-10 rounded text-sm font-semibold transition-colors
                      ${atual 
                        ? 'bg-blue-600 text-white' 
                        : respondida 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Atual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Respondida</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                <span>Não respondida</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}