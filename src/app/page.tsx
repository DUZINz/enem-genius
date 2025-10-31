'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Brain,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  Trophy,
  Star,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Loader2,
  Settings,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { usePlanoEstudos } from '@/hooks/usePlanoEstudos'
import type { PlanoEstudos, PerfilAluno, AtividadeEstudo } from '@/lib/types/plano-estudos'

export default function HomePage() {
  const [mostrarQuestionario, setMostrarQuestionario] = useState(false)
  const [planoAtual, setPlanoAtual] = useState<PlanoEstudos | null>(null)
  const [abaAtiva, setAbaAtiva] = useState('hoje')
  
  // Estado do formulário
  const [perfil, setPerfil] = useState<Partial<PerfilAluno>>({
    nivelAtual: 'intermediario',
    tempoDisponivelDia: 3,
    diasDisponiveisSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    areasFortes: [],
    areasFracas: [],
    preferencias: {
      horarioEstudo: 'noite',
      tipoConteudo: 'misto',
      usaPomodoro: true
    }
  })

  const { gerarPlano, atualizarProgresso, isLoading, erro } = usePlanoEstudos()

  const handleGerarPlano = async () => {
    if (!perfil.nome || !perfil.metaNota || !perfil.dataProva) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const plano = await gerarPlano(perfil as PerfilAluno)
    if (plano) {
      setPlanoAtual(plano)
      setMostrarQuestionario(false)
    }
  }

  const handleConcluirAtividade = async (atividadeId: string) => {
    if (!planoAtual) return
    
    const resultado = await atualizarProgresso(planoAtual.id, atividadeId, true, 85)
    if (resultado) {
      // Atualizar estado local
      console.log('✅ Atividade concluída!', resultado)
    }
  }

  // Dados mockados para demonstração
  const planoDemo: PlanoEstudos = planoAtual || {
    id: 'demo',
    alunoId: 'user-1',
    perfil: {
      nome: 'Teste',
      nivelAtual: 'intermediario',
      metaNota: 700,
      tempoDisponivelDia: 3,
      diasDisponiveisSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
      areasFortes: ['Linguagens'],
      areasFracas: ['Matemática', 'Física'],
      dataProva: new Date('2025-11-09'),
      preferencias: {
        horarioEstudo: 'noite',
        tipoConteudo: 'misto',
        usaPomodoro: true
      }
    },
    dataInicio: new Date(),
    dataFim: new Date('2025-11-09'),
    diasEstudo: [
      {
        data: new Date(),
        diaSemana: 'sexta-feira',
        atividades: [
          {
            id: '1',
            tipo: 'teoria',
            disciplina: 'Matemática',
            area: 'matematica',
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
            area: 'natureza',
            titulo: 'Exercícios de Cinemática',
            descricao: 'Resolver 20 questões sobre MRU e MRUV',
            duracaoMinutos: 90,
            dificuldade: 'dificil',
            recursos: {
              exercicios: 20
            },
            concluida: false
          }
        ],
        tempoTotalMinutos: 150,
        progresso: 0
      }
    ],
    metaSemanal: {
      horasEstudo: 15,
      atividadesConcluidas: 25,
      topicosRevisados: ['Funções', 'Cinemática', 'Redação']
    },
    progresso: {
      porcentagemGeral: 45,
      horasEstudadas: 52,
      atividadesConcluidas: 87,
      streak: 7,
      xpTotal: 2850,
      nivel: 5,
      badges: [
        {
          id: '1',
          nome: '🔥 Semana de Fogo',
          descricao: '7 dias consecutivos',
          icone: '🔥',
          dataConquista: new Date(),
          xp: 100
        },
        {
          id: '2',
          nome: '🎯 Persistente',
          descricao: '50 atividades concluídas',
          icone: '🎯',
          dataConquista: new Date(),
          xp: 150
        }
      ]
    },
    recomendacoes: [
      'Foque em Matemática nas próximas 2 semanas',
      'Faça um simulado completo no final da semana',
      'Revise redações nota 1000 da biblioteca'
    ],
    proximaAcao: 'Comece estudando Funções Quadráticas - teoria por 1h'
  }

  const diasAteProva = Math.ceil((planoDemo.dataFim.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const xpProximoNivel = Math.ceil((planoDemo.progresso.nivel * 500) * 1.5)

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
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-500">{planoDemo.progresso.streak} dias</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Nível {planoDemo.progresso.nivel}
              </Badge>
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{planoDemo.progresso.xpTotal}</span>
                <span className="text-muted-foreground">/ {xpProximoNivel} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Média Geral</p>
                  <p className="text-3xl font-bold">756</p>
                </div>
                <Trophy className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Redações</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <BookOpen className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Simulados</p>
                  <p className="text-3xl font-bold">8</p>
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
                  <p className="text-3xl font-bold">{planoDemo.progresso.horasEstudadas}h</p>
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
                  <p className="text-sm">{planoDemo.proximaAcao}</p>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Começar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progresso do Plano */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Seu Plano de Estudos
                    </CardTitle>
                    <CardDescription>
                      Progresso: {planoDemo.progresso.porcentagemGeral}% • Meta semanal: {planoDemo.metaSemanal.horasEstudo}h
                    </CardDescription>
                  </div>
                  <Dialog open={mostrarQuestionario} onOpenChange={setMostrarQuestionario}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Brain className="w-6 h-6 text-blue-600" />
                          Configurar Plano de Estudos com IA
                        </DialogTitle>
                        <DialogDescription>
                          Responda as perguntas para a IA gerar um plano personalizado
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {/* Nome */}
                        <div className="space-y-2">
                          <Label>Como podemos te chamar?</Label>
                          <Input
                            placeholder="Seu nome"
                            value={perfil.nome || ''}
                            onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                          />
                        </div>

                        {/* Nível */}
                        <div className="space-y-2">
                          <Label>Qual seu nível atual?</Label>
                          <Select
                            value={perfil.nivelAtual}
                            onValueChange={(value: any) => setPerfil({ ...perfil, nivelAtual: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="iniciante">🌱 Iniciante - Começando agora</SelectItem>
                              <SelectItem value="intermediario">📚 Intermediário - Já estudei um pouco</SelectItem>
                              <SelectItem value="avancado">🎯 Avançado - Domino bem o conteúdo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Meta de Nota */}
                        <div className="space-y-2">
                          <Label>Qual sua meta de nota no ENEM?</Label>
                          <Input
                            type="number"
                            min="400"
                            max="1000"
                            placeholder="Ex: 700"
                            value={perfil.metaNota || ''}
                            onChange={(e) => setPerfil({ ...perfil, metaNota: Number(e.target.value) })}
                          />
                        </div>

                        {/* Data da Prova */}
                        <div className="space-y-2">
                          <Label>Quando é sua prova do ENEM?</Label>
                          <Input
                            type="date"
                            value={perfil.dataProva ? perfil.dataProva.toISOString().split('T')[0] : ''}
                            onChange={(e) => setPerfil({ ...perfil, dataProva: new Date(e.target.value) })}
                          />
                        </div>

                        {/* Tempo Disponível */}
                        <div className="space-y-2">
                          <Label>Quantas horas por dia você pode estudar?</Label>
                          <Select
                            value={perfil.tempoDisponivelDia?.toString()}
                            onValueChange={(value) => setPerfil({ ...perfil, tempoDisponivelDia: Number(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hora</SelectItem>
                              <SelectItem value="2">2 horas</SelectItem>
                              <SelectItem value="3">3 horas</SelectItem>
                              <SelectItem value="4">4 horas</SelectItem>
                              <SelectItem value="5">5 horas</SelectItem>
                              <SelectItem value="6">6+ horas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Dias da Semana */}
                        <div className="space-y-2">
                          <Label>Quais dias você pode estudar?</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'].map(dia => (
                              <div key={dia} className="flex items-center space-x-2">
                                <Checkbox
                                  id={dia}
                                  checked={perfil.diasDisponiveisSemana?.includes(dia)}
                                  onCheckedChange={(checked) => {
                                    const dias = perfil.diasDisponiveisSemana || []
                                    setPerfil({
                                      ...perfil,
                                      diasDisponiveisSemana: checked
                                        ? [...dias, dia]
                                        : dias.filter(d => d !== dia)
                                    })
                                  }}
                                />
                                <Label htmlFor={dia} className="capitalize cursor-pointer">
                                  {dia.replace('terca', 'terça').replace('sabado', 'sábado')}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Áreas Fracas */}
                        <div className="space-y-2">
                          <Label>Quais suas maiores dificuldades?</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'Literatura', 
                              'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês', 'Redação'].map(area => (
                              <div key={area} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`fraca-${area}`}
                                  checked={perfil.areasFracas?.includes(area)}
                                  onCheckedChange={(checked) => {
                                    const areas = perfil.areasFracas || []
                                    setPerfil({
                                      ...perfil,
                                      areasFracas: checked
                                        ? [...areas, area]
                                        : areas.filter(a => a !== area)
                                    })
                                  }}
                                />
                                <Label htmlFor={`fraca-${area}`} className="cursor-pointer text-sm">
                                  {area}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Horário Preferido */}
                        <div className="space-y-2">
                          <Label>Qual seu melhor horário para estudar?</Label>
                          <Select
                            value={perfil.preferencias?.horarioEstudo}
                            onValueChange={(value: any) => setPerfil({
                              ...perfil,
                              preferencias: { ...perfil.preferencias!, horarioEstudo: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manha">🌅 Manhã</SelectItem>
                              <SelectItem value="tarde">☀️ Tarde</SelectItem>
                              <SelectItem value="noite">🌙 Noite</SelectItem>
                              <SelectItem value="flexible">🔄 Flexível</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {erro && (
                          <Alert variant="destructive">
                            <AlertDescription>{erro}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={handleGerarPlano}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Gerando Plano com IA...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-5 w-5" />
                              Gerar Plano Personalizado
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={planoDemo.progresso.porcentagemGeral} className="h-3 mb-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{planoDemo.progresso.atividadesConcluidas}</p>
                    <p className="text-xs text-muted-foreground">Atividades</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{planoDemo.progresso.horasEstudadas}h</p>
                    <p className="text-xs text-muted-foreground">Estudadas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{diasAteProva}</p>
                    <p className="text-xs text-muted-foreground">Dias até ENEM</p>
                  </div>
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
                  {planoDemo.diasEstudo[0]?.diaSemana} • {planoDemo.diasEstudo[0]?.tempoTotalMinutos} min
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {planoDemo.diasEstudo[0]?.atividades.map((atividade) => (
                  <Card key={atividade.id} className="hover:shadow-md transition-shadow">
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
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={atividade.concluida ? 'outline' : 'default'}
                          onClick={() => handleConcluirAtividade(atividade.id)}
                        >
                          {atividade.concluida ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                              Concluído
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Iniciar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                  {planoDemo.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
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
                  Conquistas ({planoDemo.progresso.badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {planoDemo.progresso.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg text-center"
                    >
                      <div className="text-3xl mb-1">{badge.icone}</div>
                      <p className="font-semibold text-xs">{badge.nome}</p>
                      <p className="text-xs text-muted-foreground mt-1">+{badge.xp} XP</p>
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
                    <span>Nível {planoDemo.progresso.nivel}</span>
                    <span className="text-muted-foreground">
                      {planoDemo.progresso.xpTotal} / {xpProximoNivel} XP
                    </span>
                  </div>
                  <Progress 
                    value={(planoDemo.progresso.xpTotal / xpProximoNivel) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {xpProximoNivel - planoDemo.progresso.xpTotal} XP para o próximo nível
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
                <Link href="/mentor">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Mentor IA
                  </Button>
                </Link>
                <Link href="/redacao">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Redação
                  </Button>
                </Link>
                <Link href="/simulado">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Simulados
                  </Button>
                </Link>
                <Link href="/biblioteca">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Biblioteca Nota 1000
                  </Button>
                </Link>
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
                    <span className="font-semibold">12 / {planoDemo.metaSemanal.horasEstudo}h</span>
                  </div>
                  <Progress value={(12 / planoDemo.metaSemanal.horasEstudo) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Atividades</span>
                    <span className="font-semibold">18 / {planoDemo.metaSemanal.atividadesConcluidas}</span>
                  </div>
                  <Progress value={(18 / planoDemo.metaSemanal.atividadesConcluidas) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}