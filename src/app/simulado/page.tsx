'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  Award,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Questao {
  id: string
  enunciado: string
  alternativas: string[]
  respostaCorreta: number
  explicacao: string
  disciplina: string
  dificuldade: 'facil' | 'medio' | 'dificil'
}

interface Simulado {
  id: string
  userId: string
  disciplinas: string[]
  questoes: Questao[]
  respostas: (number | null)[]
  nota?: number
  acertos?: number
  tempo?: number
  status: 'em-andamento' | 'finalizado'
  dataCriacao: string
  dataFinalizacao?: string
}

function SimuladoContent() {
  const { user, userProfile, atualizarStats } = useAuth()
  const [simulados, setSimulados] = useState<Simulado[]>([])
  const [simuladoAtual, setSimuladoAtual] = useState<Simulado | null>(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<(number | null)[]>([])
  const [isGerando, setIsGerando] = useState(false)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(false)
  
  // Configuração do simulado
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>([])
  const [quantidadeQuestoes, setQuantidadeQuestoes] = useState<number>(10)

  const disciplinas = [
    { id: 'matematica', nome: 'Matemática', cor: 'bg-blue-500', icon: '📐' },
    { id: 'portugues', nome: 'Português', cor: 'bg-green-500', icon: '📚' },
    { id: 'fisica', nome: 'Física', cor: 'bg-purple-500', icon: '⚛️' },
    { id: 'quimica', nome: 'Química', cor: 'bg-orange-500', icon: '🧪' },
    { id: 'biologia', nome: 'Biologia', cor: 'bg-emerald-500', icon: '🧬' },
    { id: 'historia', nome: 'História', cor: 'bg-yellow-600', icon: '📜' },
    { id: 'geografia', nome: 'Geografia', cor: 'bg-cyan-500', icon: '🌍' },
    { id: 'filosofia', nome: 'Filosofia', cor: 'bg-indigo-500', icon: '💭' },
    { id: 'sociologia', nome: 'Sociologia', cor: 'bg-pink-500', icon: '👥' }
  ]

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (timerAtivo && simuladoAtual) {
      interval = setInterval(() => {
        setTempoDecorrido(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerAtivo, simuladoAtual])

  // Carregar simulados do Firebase
  useEffect(() => {
    const carregarSimulados = async () => {
      if (!user) return

      try {
        const q = query(
          collection(db, 'simulados'),
          where('userId', '==', user.uid)
        )

        const querySnapshot = await getDocs(q)
        const simuladosData: Simulado[] = []

        querySnapshot.forEach((doc) => {
          simuladosData.push({ id: doc.id, ...doc.data() } as Simulado)
        })

        simuladosData.sort((a, b) => 
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
        )

        setSimulados(simuladosData)
        console.log('✅ Simulados carregados:', simuladosData.length)
      } catch (error) {
        console.error('❌ Erro ao carregar simulados:', error)
      }
    }

    carregarSimulados()
  }, [user])

  const handleToggleDisciplina = (disciplinaId: string) => {
    setDisciplinasSelecionadas(prev => 
      prev.includes(disciplinaId)
        ? prev.filter(d => d !== disciplinaId)
        : [...prev, disciplinaId]
    )
  }

  const handleGerarSimulado = async () => {
    if (!user || disciplinasSelecionadas.length === 0) {
      alert('Selecione pelo menos uma disciplina')
      return
    }

    setIsGerando(true)

    try {
      console.log('📝 Gerando simulado com:', {
        disciplinas: disciplinasSelecionadas,
        quantidade: quantidadeQuestoes
      })

      const disciplinasNomes = disciplinasSelecionadas.map(id => 
        disciplinas.find(d => d.id === id)?.nome
      ).filter(Boolean)

      // Gerar questões via API (uma por disciplina)
      const todasQuestoes: Questao[] = []

      for (const disciplina of disciplinasNomes) {
        const questoesPorDisciplina = Math.ceil(quantidadeQuestoes / disciplinasNomes.length)
        
        const response = await fetch('/api/simulado/gerar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            disciplina, 
            quantidade: questoesPorDisciplina 
          })
        })

        if (!response.ok) {
          throw new Error(`Erro ao gerar questões de ${disciplina}`)
        }

        const { questoes } = await response.json()
        todasQuestoes.push(...questoes)
      }

      // Limitar ao número exato de questões
      const questoesSelecionadas = todasQuestoes.slice(0, quantidadeQuestoes)

      console.log('✅ Total de questões geradas:', questoesSelecionadas.length)

      // Criar simulado
      const novoSimulado: Simulado = {
        id: '',
        userId: user.uid,
        disciplinas: disciplinasNomes as string[],
        questoes: questoesSelecionadas,
        respostas: new Array(questoesSelecionadas.length).fill(null),
        status: 'em-andamento',
        dataCriacao: new Date().toISOString()
      }

      setSimuladoAtual(novoSimulado)
      setRespostas(new Array(questoesSelecionadas.length).fill(null))
      setQuestaoAtual(0)
      setTempoDecorrido(0)
      setTimerAtivo(true)

      console.log('✅ Simulado iniciado')
    } catch (error: any) {
      console.error('❌ Erro ao gerar simulado:', error)
      alert('Erro ao gerar simulado: ' + error.message)
    } finally {
      setIsGerando(false)
    }
  }

  const handleResponder = (alternativa: number) => {
    const novasRespostas = [...respostas]
    novasRespostas[questaoAtual] = alternativa
    setRespostas(novasRespostas)
  }

  const handleProximaQuestao = () => {
    if (questaoAtual < (simuladoAtual?.questoes.length || 0) - 1) {
      setQuestaoAtual(questaoAtual + 1)
    }
  }

  const handleQuestaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
    }
  }

  const handleFinalizar = async () => {
    if (!simuladoAtual || !user) return

    setTimerAtivo(false)

    // Calcular nota
    let acertos = 0
    simuladoAtual.questoes.forEach((questao, index) => {
      if (respostas[index] === questao.respostaCorreta) {
        acertos++
      }
    })

    const nota = Math.round((acertos / simuladoAtual.questoes.length) * 1000)

    try {
      const simuladoFinalizado = {
        ...simuladoAtual,
        respostas,
        nota,
        acertos,
        tempo: tempoDecorrido,
        status: 'finalizado',
        dataFinalizacao: new Date().toISOString()
      }

      await addDoc(collection(db, 'simulados'), simuladoFinalizado)

      if (userProfile) {
        const novosStats = {
          ...userProfile.stats,
          totalSimulados: userProfile.stats.totalSimulados + 1,
          xpTotal: userProfile.stats.xpTotal + (nota >= 700 ? 150 : 100),
          nivel: Math.floor((userProfile.stats.xpTotal + 100) / 500) + 1,
          mediaGeral: Math.round(
            ((userProfile.stats.mediaGeral * (userProfile.stats.totalRedacoes + userProfile.stats.totalSimulados)) + nota) / 
            (userProfile.stats.totalRedacoes + userProfile.stats.totalSimulados + 1)
          )
        }

        await atualizarStats(novosStats)
      }

      alert(`🎉 Simulado Finalizado!\n\n✅ Acertos: ${acertos}/${simuladoAtual.questoes.length}\n📊 Nota: ${nota}/1000\n⏱️ Tempo: ${Math.floor(tempoDecorrido / 60)}min ${tempoDecorrido % 60}s\n✨ +${nota >= 700 ? 150 : 100} XP`)

      // Recarregar simulados
      const q = query(collection(db, 'simulados'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const simuladosData: Simulado[] = []
      querySnapshot.forEach((doc) => {
        simuladosData.push({ id: doc.id, ...doc.data() } as Simulado)
      })
      
      simuladosData.sort((a, b) => 
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      )
      
      setSimulados(simuladosData)

      setSimuladoAtual(null)
      setRespostas([])
      setQuestaoAtual(0)
      setTempoDecorrido(0)
      setDisciplinasSelecionadas([])

      console.log('✅ Simulado finalizado')
    } catch (error) {
      console.error('❌ Erro ao finalizar simulado:', error)
      alert('Erro ao finalizar simulado')
    }
  }

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!simuladoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Simulados IA</h1>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.stats.totalSimulados || 0} simulados realizados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="novo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="novo">
                <Play className="h-4 w-4 mr-2" />
                Novo Simulado
              </TabsTrigger>
              <TabsTrigger value="historico">
                <Clock className="h-4 w-4 mr-2" />
                Histórico ({simulados.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="novo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurar Simulado</CardTitle>
                  <CardDescription>
                    Escolha as disciplinas e quantidade de questões
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quantidade de Questões */}
                  <div className="space-y-2">
                    <Label>Quantidade de Questões</Label>
                    <Select
                      value={quantidadeQuestoes.toString()}
                      onValueChange={(value) => setQuantidadeQuestoes(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 questões (Rápido - 15min)</SelectItem>
                        <SelectItem value="10">10 questões (Médio - 30min)</SelectItem>
                        <SelectItem value="20">20 questões (Longo - 1h)</SelectItem>
                        <SelectItem value="45">45 questões (Simulado ENEM - 2h15min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disciplinas */}
                  <div className="space-y-3">
                    <Label>Selecione as Disciplinas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {disciplinas.map((disciplina) => (
                        <div
                          key={disciplina.id}
                          className={`
                            flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                            ${disciplinasSelecionadas.includes(disciplina.id) 
                              ? `${disciplina.cor} border-transparent text-white` 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => handleToggleDisciplina(disciplina.id)}
                        >
                          <Checkbox
                            checked={disciplinasSelecionadas.includes(disciplina.id)}
                            onCheckedChange={() => handleToggleDisciplina(disciplina.id)}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{disciplina.icon}</span>
                            <span className="font-medium text-sm">{disciplina.nome}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {disciplinasSelecionadas.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ✅ {disciplinasSelecionadas.length} disciplina(s) selecionada(s)
                      </p>
                    )}
                  </div>

                  {/* Botão Gerar */}
                  <Button
                    onClick={handleGerarSimulado}
                    disabled={isGerando || disciplinasSelecionadas.length === 0}
                    className="w-full h-14 text-lg"
                  >
                    {isGerando ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Gerando Simulado...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Iniciar Simulado ({quantidadeQuestoes} questões)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              {simulados.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Você ainda não realizou nenhum simulado</p>
                  </CardContent>
                </Card>
              ) : (
                simulados.map((simulado) => (
                  <Card key={simulado.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {simulado.disciplinas.map((disc, index) => (
                              <Badge key={index} variant="outline">{disc}</Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(simulado.dataCriacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {simulado.status === 'finalizado' && (
                          <div className="text-right">
                            <Badge className="bg-green-600 mb-2">
                              <Award className="h-3 w-3 mr-1" />
                              {simulado.nota}/1000
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              ✅ {simulado.acertos}/{simulado.questoes.length} acertos
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ⏱️ {Math.floor((simulado.tempo || 0) / 60)}min
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Tela do Simulado em Andamento
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Simulado em Andamento</h1>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              <Clock className="h-4 w-4 mr-2" />
              {formatarTempo(tempoDecorrido)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Progresso */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Questão {questaoAtual + 1} de {simuladoAtual.questoes.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {respostas.filter(r => r !== null).length} respondidas
              </span>
            </div>
            <Progress value={((questaoAtual + 1) / simuladoAtual.questoes.length) * 100} />
          </CardContent>
        </Card>

        {/* Questão */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>{simuladoAtual.questoes[questaoAtual].disciplina}</Badge>
              <Badge variant="outline">
                {simuladoAtual.questoes[questaoAtual].dificuldade}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">
              {simuladoAtual.questoes[questaoAtual].enunciado}
            </p>

            <RadioGroup
              value={respostas[questaoAtual]?.toString()}
              onValueChange={(value) => handleResponder(parseInt(value))}
            >
              {simuladoAtual.questoes[questaoAtual].alternativas.map((alt, index) => (
                <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`alt-${index}`} />
                  <Label htmlFor={`alt-${index}`} className="flex-1 cursor-pointer">
                    {String.fromCharCode(65 + index)}) {alt}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleQuestaoAnterior}
                disabled={questaoAtual === 0}
              >
                Anterior
              </Button>
              {questaoAtual < simuladoAtual.questoes.length - 1 ? (
                <Button onClick={handleProximaQuestao} className="flex-1">
                  Próxima
                </Button>
              ) : (
                <Button onClick={handleFinalizar} className="flex-1">
                  <Award className="h-4 w-4 mr-2" />
                  Finalizar Simulado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mini Mapa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Navegação Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {simuladoAtual.questoes.map((_, index) => (
                <Button
                  key={index}
                  variant={respostas[index] !== null ? 'default' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => setQuestaoAtual(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SimuladoPage() {
  return (
    <ProtectedRoute>
      <SimuladoContent />
    </ProtectedRoute>
  )
}