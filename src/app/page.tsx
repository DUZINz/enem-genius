'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Brain,
  Target,
  BookOpen,
  Award,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  Trophy,
  Star,
  PlayCircle,
  PauseCircle,
  Lightbulb,
  ArrowRight,
  Timer,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Atividade {
  id: string
  tipo: string
  disciplina: string
  titulo: string
  descricao: string
  duracaoMinutos: number
  dificuldade: string
  recursos: {
    videoaulas?: string[]
    exercicios?: number
  }
  concluida: boolean
}

function HomeContent() {
  const router = useRouter()
  const { userProfile, logout, atualizarStats } = useAuth()
  const [atividadeEmAndamento, setAtividadeEmAndamento] = useState<string | null>(null)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(false)

  // ⭐ USAR STATS DO FIREBASE em vez do localStorage
  const stats = userProfile?.stats || {
    mediaGeral: 0,
    totalRedacoes: 0,
    totalSimulados: 0,
    horasEstudadas: 0,
    streak: 0,
    nivel: 1,
    xpTotal: 0,
    atividadesConcluidas: 0,
    porcentagemGeral: 0
  }

  // Atividades do dia
  const [atividades, setAtividades] = useState<Atividade[]>([
    {
      id: '1',
      tipo: 'teoria',
      disciplina: 'Matemática',
      titulo: 'Funções Quadráticas',
      descricao: 'Estudo teórico sobre funções quadráticas e gráficos',
      duracaoMinutos: 60,
      dificuldade: 'medio',
      recursos: {
        videoaulas: ['Aula 1', 'Aula 2'],
        exercicios: 15
      },
      concluida: false
    },
    {
      id: '2',
      tipo: 'exercicios',
      disciplina: 'Física',
      titulo: 'Exercícios de Cinemática',
      descricao: 'Resolver 20 questões sobre MRU e MRUV',
      duracaoMinutos: 90,
      dificuldade: 'dificil',
      recursos: {
        exercicios: 20
      },
      concluida: false
    }
  ])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (timerAtivo && atividadeEmAndamento) {
      interval = setInterval(() => {
        setTempoDecorrido(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerAtivo, atividadeEmAndamento])

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleIniciarAtividade = (atividade: Atividade) => {
    if (atividadeEmAndamento) {
      if (confirm('Já existe uma atividade em andamento. Deseja pausá-la e iniciar esta?')) {
        setTimerAtivo(false)
      } else {
        return
      }
    }

    setAtividadeEmAndamento(atividade.id)
    setTempoDecorrido(0)
    setTimerAtivo(true)
    
    alert(`🚀 Atividade iniciada: ${atividade.titulo}\n\n⏱️ Tempo estimado: ${atividade.duracaoMinutos} minutos\n\n💡 Dica: Mantenha o foco e evite distrações!`)
  }

  const handlePausarAtividade = () => {
    setTimerAtivo(false)
  }

  const handleRetomarAtividade = () => {
    setTimerAtivo(true)
  }

  const handleConcluirAtividade = async (atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId)
    if (!atividade) return

    const tempoGastoMinutos = Math.floor(tempoDecorrido / 60)
    const tempoEstimado = atividade.duracaoMinutos
    const porcentagemConclusao = (tempoGastoMinutos / tempoEstimado) * 100

    // Validação
    if (tempoGastoMinutos < tempoEstimado * 0.3) {
      const confirmarRapido = confirm(
        `⚠️ Atenção!\n\nVocê gastou apenas ${tempoGastoMinutos} minutos de ${tempoEstimado} minutos estimados.\n\nTem certeza que completou toda a atividade?\n\n💡 Dica: Dedicar o tempo adequado melhora seu aprendizado!`
      )
      
      if (!confirmarRapido) return
    }

    // Calcular XP
    let xpMultiplicador = 1.0
    
    if (porcentagemConclusao >= 100) {
      xpMultiplicador = 1.5
    } else if (porcentagemConclusao >= 70) {
      xpMultiplicador = 1.2
    } else if (porcentagemConclusao < 30) {
      xpMultiplicador = 0.5
    }

    const xpBase = 50
    const xpCalculado = Math.round(xpBase * xpMultiplicador)

    const mensagemFeedback = porcentagemConclusao >= 100
      ? '🌟 Excelente! Você dedicou todo o tempo recomendado!'
      : porcentagemConclusao >= 70
      ? '👍 Bom trabalho! Continue assim!'
      : '⚡ Você concluiu rapidamente. Considere revisar o conteúdo!'

    if (confirm(`Confirmar conclusão da atividade?\n\n⏱️ Tempo gasto: ${tempoGastoMinutos} min (${Math.round(porcentagemConclusao)}% do recomendado)\n🎯 XP a ganhar: ${xpCalculado} XP\n\n${mensagemFeedback}`)) {
      // ⭐ ATUALIZAR ATIVIDADE
      setAtividades(prev => prev.map(a => 
        a.id === atividadeId ? { ...a, concluida: true } : a
      ))
      
      // ⭐ ATUALIZAR STATS NO FIREBASE
      const horasGastas = tempoGastoMinutos / 60
      const novoXP = stats.xpTotal + xpCalculado
      const novoNivel = Math.floor(novoXP / 500) + 1
      
      // Verificar se manteve streak (estudou hoje)
      const ultimoEstudo = localStorage.getItem('ultimoEstudo')
      const hoje = new Date().toDateString()
      let novoStreak = stats.streak
      
      if (ultimoEstudo !== hoje) {
        const ontem = new Date()
        ontem.setDate(ontem.getDate() - 1)
        
        if (ultimoEstudo === ontem.toDateString()) {
          novoStreak += 1
        } else {
          novoStreak = 1
        }
        
        localStorage.setItem('ultimoEstudo', hoje)
      }
      
      const novosStats = {
        ...stats,
        xpTotal: novoXP,
        nivel: novoNivel,
        atividadesConcluidas: stats.atividadesConcluidas + 1,
        horasEstudadas: Math.round((stats.horasEstudadas + horasGastas) * 10) / 10,
        streak: novoStreak,
        porcentagemGeral: Math.min(100, stats.porcentagemGeral + 2)
      }
      
      // 🔥 SALVAR NO FIREBASE
      await atualizarStats(novosStats)
      
      let mensagemFinal = `🎉 Parabéns! Atividade concluída!\n\n`
      mensagemFinal += `⏱️ Tempo: ${tempoGastoMinutos} min\n`
      mensagemFinal += `✨ +${xpCalculado} XP (Total: ${novoXP} XP)\n`
      mensagemFinal += `📊 Nível: ${novoNivel}\n`
      
      if (novoNivel > stats.nivel) {
        mensagemFinal += `\n🎊 SUBIU DE NÍVEL! Agora você é nível ${novoNivel}!`
      }
      
      if (porcentagemConclusao >= 100) {
        mensagemFinal += `\n🔥 Streak: ${novoStreak} dias consecutivos!`
      }
      
      alert(mensagemFinal)
      
      // Resetar timer
      setAtividadeEmAndamento(null)
      setTempoDecorrido(0)
      setTimerAtivo(false)
    }
  }

  const xpProximoNivel = stats.nivel * 500
  const proximaAtividade = atividades.find(a => !a.concluida)

  const badges = [
    {
      id: '1',
      nome: '🔥 Semana de Fogo',
      descricao: `${stats.streak} dias consecutivos`,
      icone: '🔥',
      xp: 100,
      desbloqueado: stats.streak >= 7
    },
    {
      id: '2',
      nome: '🎯 Persistente',
      descricao: `${stats.atividadesConcluidas} atividades concluídas`,
      icone: '🎯',
      xp: 150,
      desbloqueado: stats.atividadesConcluidas >= 50
    },
    {
      id: '3',
      nome: '📚 Estudioso',
      descricao: `${stats.horasEstudadas}h estudadas`,
      icone: '📚',
      xp: 200,
      desbloqueado: stats.horasEstudadas >= 50
    },
    {
      id: '4',
      nome: '⚡ Relâmpago',
      descricao: 'Nível 10 alcançado',
      icone: '⚡',
      xp: 300,
      desbloqueado: stats.nivel >= 10
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ENEM Genius
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Olá, <span className="font-semibold text-gray-900">{userProfile?.nome || 'Estudante'}</span>
              </span>
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-500">{stats.streak} dias</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Nível {stats.nivel}
              </Badge>
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{stats.xpTotal}</span>
                <span className="text-muted-foreground hidden sm:inline">/ {xpProximoNivel} XP</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Timer de Atividade em Andamento */}
        {atividadeEmAndamento && (
          <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
            <Timer className="h-5 w-5 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">
                  Atividade em andamento: {atividades.find(a => a.id === atividadeEmAndamento)?.titulo}
                </p>
                <p className="text-sm text-blue-700">Tempo decorrido: {formatarTempo(tempoDecorrido)}</p>
              </div>
              <div className="flex gap-2">
                {timerAtivo ? (
                  <Button size="sm" variant="outline" onClick={handlePausarAtividade}>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={handleRetomarAtividade}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Retomar
                  </Button>
                )}
                <Button size="sm" onClick={() => handleConcluirAtividade(atividadeEmAndamento)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Concluir
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Média Geral</p>
                  <p className="text-3xl font-bold">
                    {stats.mediaGeral > 0 ? stats.mediaGeral : '--'}
                  </p>
                </div>
                <Trophy className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/redacao')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Redações</p>
                  <p className="text-3xl font-bold">{stats.totalRedacoes}</p>
                </div>
                <BookOpen className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/simulado')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Simulados</p>
                  <p className="text-3xl font-bold">{stats.totalSimulados}</p>
                </div>
                <Target className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Horas Estudadas</p>
                  <p className="text-3xl font-bold">{stats.horasEstudadas}h</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próxima Ação */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Próxima Ação Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {proximaAtividade 
                      ? `Comece estudando ${proximaAtividade.titulo} - ${proximaAtividade.tipo} por ${proximaAtividade.duracaoMinutos}min`
                      : '🎉 Parabéns! Você concluiu todas as atividades de hoje!'
                    }
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => proximaAtividade && handleIniciarAtividade(proximaAtividade)}
                    disabled={!proximaAtividade || atividadeEmAndamento !== null}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Começar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Atividades de Hoje */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                  Atividades de Hoje
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {atividades.map((atividade) => {
                  const estaEmAndamento = atividadeEmAndamento === atividade.id
                  
                  return (
                    <Card 
                      key={atividade.id} 
                      className={`hover:shadow-md transition-shadow ${estaEmAndamento ? 'border-blue-500 bg-blue-50' : ''} ${atividade.concluida ? 'opacity-60 bg-green-50' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{atividade.tipo}</Badge>
                              <Badge>{atividade.disciplina}</Badge>
                              <Badge
                                variant={
                                  atividade.dificuldade === 'facil' ? 'secondary' :
                                  atividade.dificuldade === 'medio' ? 'default' : 'destructive'
                                }
                              >
                                {atividade.dificuldade}
                              </Badge>
                              {estaEmAndamento && (
                                <Badge className="bg-blue-500 animate-pulse">
                                  <Timer className="h-3 w-3 mr-1" />
                                  Em andamento
                                </Badge>
                              )}
                              {atividade.concluida && (
                                <Badge className="bg-green-500">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Concluída
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold mb-1">{atividade.titulo}</h4>
                            <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {atividade.duracaoMinutos} min
                              </span>
                              {atividade.recursos.exercicios && (
                                <span>{atividade.recursos.exercicios} exercícios</span>
                              )}
                              {estaEmAndamento && (
                                <span className="font-semibold text-blue-600">
                                  ⏱️ {formatarTempo(tempoDecorrido)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {atividade.concluida ? (
                              <Button size="sm" variant="outline" disabled>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                Concluído
                              </Button>
                            ) : estaEmAndamento ? (
                              <>
                                {timerAtivo ? (
                                  <Button size="sm" variant="outline" onClick={handlePausarAtividade}>
                                    <PauseCircle className="h-4 w-4 mr-2" />
                                    Pausar
                                  </Button>
                                ) : (
                                  <Button size="sm" onClick={handleRetomarAtividade}>
                                    <PlayCircle className="h-4 w-4 mr-2" />
                                    Retomar
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleConcluirAtividade(atividade.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Concluir
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleIniciarAtividade(atividade)}
                                disabled={atividadeEmAndamento !== null}
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Iniciar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recomendações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Recomendações da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {stats.nivel < 5 && (
                    <li className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Continue estudando para subir de nível! Você está quase lá!</span>
                    </li>
                  )}
                  {stats.streak === 0 && (
                    <li className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Comece seu streak hoje! Estude pelo menos 30 minutos.</span>
                    </li>
                  )}
                  {stats.totalRedacoes < 5 && (
                    <li className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Pratique mais redações! Meta: 1 redação por semana.</span>
                    </li>
                  )}
                  {stats.totalSimulados < 3 && (
                    <li className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Faça um simulado completo para avaliar seu nível atual.</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Revise redações nota 1000 na biblioteca para melhorar sua escrita.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Conquistas ({badges.filter(b => b.desbloqueado).length}/{badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                        badge.desbloqueado
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md'
                          : 'bg-gray-100 border-gray-200 opacity-50'
                      }`}
                      onClick={() => {
                        if (badge.desbloqueado) {
                          alert(`🏆 ${badge.nome}\n\n${badge.descricao}\n\n+${badge.xp} XP`)
                        } else {
                          alert(`🔒 ${badge.nome}\n\n${badge.descricao}\n\nContinue estudando para desbloquear!`)
                        }
                      }}
                    >
                      <div className="text-3xl mb-1">
                        {badge.desbloqueado ? badge.icone : '🔒'}
                      </div>
                      <p className="font-semibold text-xs">{badge.nome}</p>
                      {badge.desbloqueado && (
                        <p className="text-xs text-muted-foreground mt-1">+{badge.xp} XP</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* XP Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Progresso de XP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Nível {stats.nivel}</span>
                    <span className="text-muted-foreground">
                      {stats.xpTotal} / {xpProximoNivel} XP
                    </span>
                  </div>
                  <Progress 
                    value={(stats.xpTotal / xpProximoNivel) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {xpProximoNivel - stats.xpTotal} XP para o próximo nível
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Menu Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Menu Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/mentor')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Mentor IA
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/redacao')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Redação
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/simulado')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Simulados
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/biblioteca')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Biblioteca Nota 1000
                </Button>
              </CardContent>
            </Card>

            {/* Meta Semanal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Semanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Horas de Estudo</span>
                    <span className="font-semibold">{stats.horasEstudadas} / 15h</span>
                  </div>
                  <Progress value={(stats.horasEstudadas / 15) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Atividades</span>
                    <span className="font-semibold">{stats.atividadesConcluidas} / 25</span>
                  </div>
                  <Progress value={(stats.atividadesConcluidas / 25) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🔥 COMPONENTE PRINCIPAL COM PROTEÇÃO
export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}