'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Brain, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  TrendingUp,
  Award,
  ArrowLeft,
  Play
} from 'lucide-react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Questao {
  id: string
  numero: number
  enunciado: string
  alternativas: string[]
  respostaCorreta: number
  disciplina: string
  dificuldade: string
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
  analise?: AnaliseSimulado
}

interface AnaliseSimulado {
  notaFinal: number
  acertos: number
  erros: number
  emBranco: number
  tempoTotal: number
  desempenhoPorDisciplina: {
    disciplina: string
    acertos: number
    total: number
    percentual: number
  }[]
  questoesErradas: {
    numero: number
    disciplina: string
    respostaCorreta: number
    respostaDada: number | null
    enunciado: string
  }[]
  pontosFracos: string[]
  pontosFortes: string[]
  recomendacoes: string[]
}

function SimuladoContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [simulados, setSimulados] = useState<Simulado[]>([])
  const [simuladoAtual, setSimuladoAtual] = useState<Simulado | null>(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<(number | null)[]>([])
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(false)
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>([])
  const [isGerando, setIsGerando] = useState(false)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [analisando, setAnalisando] = useState(false)

  // Configuração do simulado
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
          const data = doc.data()
          
          const disciplinasArray = Array.isArray(data.disciplinas) 
            ? data.disciplinas 
            : data.disciplina 
            ? [data.disciplina] 
            : ['Geral']
          
          simuladosData.push({ 
            id: doc.id, 
            ...data,
            disciplinas: disciplinasArray
          } as Simulado)
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
    if (disciplinasSelecionadas.length === 0) {
      alert('Selecione pelo menos uma disciplina')
      return
    }

    setIsGerando(true)

    try {
      const response = await fetch('/api/simulado/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplinas: disciplinasSelecionadas,
          quantidade: 5
        })
      })

      if (!response.ok) throw new Error('Erro ao gerar simulado')

      const data = await response.json()
      
      // ✅ GARANTIR QUE TODAS AS QUESTÕES TÊM NUMERO
      const questoesComNumero = data.questoes.map((q: Questao, index: number) => ({
        ...q,
        numero: q.numero || (index + 1) // Se não tiver numero, adiciona baseado no index
      }))

      const novoSimulado: Simulado = {
        id: '',
        userId: user!.uid,
        disciplinas: disciplinasSelecionadas,
        questoes: questoesComNumero,
        respostas: Array(questoesComNumero.length).fill(null),
        status: 'em-andamento',
        dataCriacao: new Date().toISOString()
      }

      setSimuladoAtual(novoSimulado)
      setRespostas(Array(questoesComNumero.length).fill(null))
      setQuestaoAtual(0)
      setTempoDecorrido(0)
      setTimerAtivo(true)

      console.log('✅ Simulado gerado com questões numeradas')
    } catch (error) {
      console.error('❌ Erro ao gerar simulado:', error)
      alert('Erro ao gerar simulado')
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
    setAnalisando(true)

    try {
      // Preparar respostas no formato correto
      const respostasFormatadas = simuladoAtual.questoes.map((questao, index) => ({
        questaoId: questao.id,
        respostaMarcada: respostas[index] !== null 
          ? String.fromCharCode(65 + respostas[index]) // 0 -> 'A', 1 -> 'B', etc
          : null
      }))

      console.log('🔍 Enviando para correção...')

      // Chamar API de correção (que já faz a análise)
      const correcaoResponse = await fetch('/api/simulado/corrigir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questoes: simuladoAtual.questoes,
          respostas: respostasFormatadas
        })
      })

      if (!correcaoResponse.ok) {
        throw new Error('Erro ao corrigir simulado')
      }

      const correcao = await correcaoResponse.json()
      console.log('✅ Correção recebida:', correcao)

      // Montar análise
      const analise: AnaliseSimulado = {
        notaFinal: correcao.notaTotal,
        acertos: correcao.acertos,
        erros: correcao.erros,
        emBranco: correcao.emBranco,
        tempoTotal: tempoDecorrido,
        desempenhoPorDisciplina: Object.entries(correcao.notaPorArea).map(([area, nota]) => {
          const questoesArea = simuladoAtual.questoes.filter(q => q.disciplina === area)
          const acertosArea = questoesArea.filter((q) => {
            const questaoIndex = simuladoAtual.questoes.indexOf(q)
            return respostas[questaoIndex] === q.respostaCorreta
          }).length

          return {
            disciplina: area.charAt(0).toUpperCase() + area.slice(1),
            acertos: acertosArea,
            total: questoesArea.length,
            percentual: Math.round((acertosArea / questoesArea.length) * 100)
          }
        }),
        questoesErradas: correcao.questoesErradas.map((q: any) => {
          const gabaritoCorreto = q.gabaritoCorreto || q.respostaCorreta || 'A'
          const respostaMarcada = q.respostaMarcada || null

          let respostaCorretaNum: number
          if (typeof gabaritoCorreto === 'string') {
            respostaCorretaNum = gabaritoCorreto.charCodeAt(0) - 65
          } else {
            respostaCorretaNum = gabaritoCorreto
          }

          let respostaDadaNum: number | null = null
          if (respostaMarcada !== null) {
            if (typeof respostaMarcada === 'string') {
              respostaDadaNum = respostaMarcada.charCodeAt(0) - 65
            } else {
              respostaDadaNum = respostaMarcada
            }
          }

          return {
            numero: q.numero,
            disciplina: q.disciplina,
            respostaCorreta: respostaCorretaNum,
            respostaDada: respostaDadaNum,
            enunciado: simuladoAtual.questoes.find(quest => quest.numero === q.numero)?.enunciado || ''
          }
        }),
        pontosFracos: correcao.pontosFracos || ['Áreas que precisam de atenção'],
        pontosFortes: correcao.pontoFortes || ['Continue praticando'],
        recomendacoes: correcao.recomendacoes || ['Revise as questões erradas']
      }

      // ✅ LIMPAR CAMPOS UNDEFINED ANTES DE SALVAR
      const simuladoFinalizado = {
        userId: user.uid,
        disciplinas: simuladoAtual.disciplinas,
        questoes: simuladoAtual.questoes.map(q => ({
          id: q.id,
          numero: q.numero,
          enunciado: q.enunciado,
          alternativas: q.alternativas,
          respostaCorreta: q.respostaCorreta,
          disciplina: q.disciplina,
          dificuldade: q.dificuldade
        })),
        respostas: respostas,
        nota: correcao.notaTotal,
        acertos: correcao.acertos,
        tempo: tempoDecorrido,
        status: 'finalizado' as const,
        dataCriacao: simuladoAtual.dataCriacao,
        dataFinalizacao: new Date().toISOString(),
        analise: {
          notaFinal: analise.notaFinal,
          acertos: analise.acertos,
          erros: analise.erros,
          emBranco: analise.emBranco,
          tempoTotal: analise.tempoTotal,
          desempenhoPorDisciplina: analise.desempenhoPorDisciplina,
          questoesErradas: analise.questoesErradas,
          pontosFracos: analise.pontosFracos,
          pontosFortes: analise.pontosFortes,
          recomendacoes: analise.recomendacoes
        }
      }

      // ✅ ADICIONAR ESTE LOG ANTES DE SALVAR:
      console.log('🔍 Verificando campos undefined:')
      console.log('simuladoFinalizado:', JSON.stringify(simuladoFinalizado, null, 2))
      
      // Verificar cada campo manualmente
      const camposUndefined = []
      
      if (simuladoFinalizado.userId === undefined) camposUndefined.push('userId')
      if (simuladoFinalizado.disciplinas === undefined) camposUndefined.push('disciplinas')
      if (simuladoFinalizado.questoes === undefined) camposUndefined.push('questoes')
      if (simuladoFinalizado.respostas === undefined) camposUndefined.push('respostas')
      if (simuladoFinalizado.nota === undefined) camposUndefined.push('nota')
      if (simuladoFinalizado.acertos === undefined) camposUndefined.push('acertos')
      if (simuladoFinalizado.tempo === undefined) camposUndefined.push('tempo')
      if (simuladoFinalizado.status === undefined) camposUndefined.push('status')
      if (simuladoFinalizado.dataCriacao === undefined) camposUndefined.push('dataCriacao')
      if (simuladoFinalizado.dataFinalizacao === undefined) camposUndefined.push('dataFinalizacao')
      if (simuladoFinalizado.analise === undefined) camposUndefined.push('analise')
      
      // Verificar questões
      simuladoFinalizado.questoes.forEach((q: any, idx: number) => {
        Object.keys(q).forEach(key => {
          if (q[key] === undefined) {
            camposUndefined.push(`questoes[${idx}].${key}`)
          }
        })
      })
      
      // Verificar análise
      if (simuladoFinalizado.analise) {
        Object.keys(simuladoFinalizado.analise).forEach(key => {
          if ((simuladoFinalizado.analise as any)[key] === undefined) {
            camposUndefined.push(`analise.${key}`)
          }
        })
      }
      
      if (camposUndefined.length > 0) {
        console.error('❌ CAMPOS UNDEFINED ENCONTRADOS:', camposUndefined)
        alert('Erro: Campos undefined: ' + camposUndefined.join(', '))
        setAnalisando(false)
        return
      }

      console.log('✅ Nenhum campo undefined, salvando...')

      try {
        await addDoc(collection(db, 'simulados'), simuladoFinalizado)
        console.log('✅ Salvo com sucesso!')
        
        // Atualizar lista
        const q = query(collection(db, 'simulados'), where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        const simuladosData: Simulado[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const disciplinasArray = Array.isArray(data.disciplinas) 
            ? data.disciplinas 
            : data.disciplina 
            ? [data.disciplina] 
            : ['Geral']
          
          simuladosData.push({ 
            id: doc.id, 
            ...data,
            disciplinas: disciplinasArray
          } as Simulado)
        })
        
        simuladosData.sort((a, b) => 
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
        )
        
        setSimulados(simuladosData)

        setSimuladoAtual({ ...simuladoAtual, analise })
        setMostrarResultado(true)

        console.log('✅ Simulado finalizado e salvo')
      } catch (error) {
        console.error('❌ Erro ao salvar:', error)
        alert('Erro ao finalizar simulado: ' + (error as Error).message)
      } finally {
        setAnalisando(false)
      }
    } catch (error) {
      console.error('❌ Erro ao finalizar simulado:', error)
      alert('Erro ao finalizar simulado: ' + (error as Error).message)
    } finally {
      setAnalisando(false)
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
              <div className="flex items-center space-x-4">
                {/* ✅ BOTÃO VOLTAR */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Simulados IA</h1>
                    <p className="text-xs text-muted-foreground">
                      {simulados.filter(s => s.status === 'finalizado').length} simulados realizados
                    </p>
                  </div>
                </div>
              </div>
              {/* ✅ BOTÃO HOME (alternativa) */}
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Página Inicial</span>
              </Button>
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
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {/* ✅ VALIDAÇÃO ADICIONADA */}
                            {(simulado.disciplinas || ['Geral']).map((disc, index) => (
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

  // ✅ ADICIONAR ESTA TELA DE RESULTADO ANTES DO RETURN DO SIMULADO EM ANDAMENTO
  if (mostrarResultado && simuladoAtual?.analise) {
    const { analise } = simuladoAtual

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMostrarResultado(false)
                  setSimuladoAtual(null)
                  setRespostas([])
                  setQuestaoAtual(0)
                  setTempoDecorrido(0)
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Novo Simulado
              </Button>

              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-xl font-bold">Resultado do Simulado</h1>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Nota Final */}
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-3xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Award className="h-10 w-10 text-yellow-500" />
                  <span>Nota Final</span>
                </div>
              </CardTitle>
              <div className="text-6xl font-bold text-blue-600 my-4">
                {analise.notaFinal}
                <span className="text-2xl text-muted-foreground">/1000</span>
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{analise.acertos} acertos</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>{analise.erros} erros</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span>{analise.emBranco} em branco</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>{Math.floor(analise.tempoTotal / 60)}min</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Desempenho por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Desempenho por Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analise.desempenhoPorDisciplina.map((desemp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{desemp.disciplina}</span>
                    <span className="text-sm text-muted-foreground">
                      {desemp.acertos}/{desemp.total} ({desemp.percentual}%)
                    </span>
                  </div>
                  <Progress value={desemp.percentual} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Questões Erradas */}
          {analise.questoesErradas.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Questões que você errou ({analise.questoesErradas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise.questoesErradas.slice(0, 10).map((questao, idx) => (
                  <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        Questão {questao.numero}
                      </Badge>
                      <Badge variant="secondary">{questao.disciplina}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {questao.enunciado.substring(0, 150)}...
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-red-600">
                        Sua resposta: {questao.respostaDada !== null ? String.fromCharCode(65 + questao.respostaDada) : 'Em branco'}
                      </span>
                      <span className="text-green-600">
                        Resposta correta: {String.fromCharCode(65 + questao.respostaCorreta)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pontos Fortes */}
          {analise.pontosFortes.length > 0 && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analise.pontosFortes.map((ponto, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Pontos Fracos */}
          {analise.pontosFracos.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Pontos a Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analise.pontosFracos.map((ponto, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600">!</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recomendações */}
          {analise.recomendacoes.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analise.recomendacoes.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
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
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base px-3 py-1">
                <Clock className="h-4 w-4 mr-2" />
                {formatarTempo(tempoDecorrido)}
              </Badge>
              {/* ✅ BOTÃO SAIR DO SIMULADO */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Deseja realmente sair? O progresso será perdido.')) {
                    setSimuladoAtual(null)
                    setRespostas([])
                    setQuestaoAtual(0)
                    setTempoDecorrido(0)
                    setTimerAtivo(false)
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
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