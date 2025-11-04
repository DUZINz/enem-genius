'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  FileText,
  Clock,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  BookOpen,
  Home,
  ArrowLeft,
  XCircle
} from 'lucide-react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Competencia {
  numero: number
  titulo: string
  nota: number
  feedback: string
}

interface Redacao {
  id: string
  userId: string
  tema: string
  texto: string
  notaFinal: number
  competencias: Competencia[]
  pontosFortesGerais: string[]
  pontosAMelhorarGerais: string[]
  sugestoesGerais: string
  status: 'em-analise' | 'corrigida'
  dataCriacao: string
  dataCorrecao?: string
}

function RedacaoContent() {
  const router = useRouter()
  const { user, userProfile, atualizarStats } = useAuth()
  
  // 🔹 ADICIONE ESSAS LINHAS
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }
  
  const [redacoes, setRedacoes] = useState<Redacao[]>([])
  const [redacaoAtual, setRedacaoAtual] = useState<Redacao | null>(null)
  const [texto, setTexto] = useState('')
  const [tema, setTema] = useState('')
  const [isCorrigindo, setIsCorrigindo] = useState(false)
  const [mostrarCorrecao, setMostrarCorrecao] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ TEMAS EXPANDIDOS - REAIS DO ENEM + GENÉRICOS
  const temasDisponiveis = [
    // 🎯 TEMAS REAIS DO ENEM (2016-2022)
    { 
      texto: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
      ano: '2022',
      isReal: true
    },
    { 
      texto: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
      ano: '2021',
      isReal: true
    },
    { 
      texto: 'O estigma associado às doenças mentais na sociedade brasileira',
      ano: '2020',
      isReal: true
    },
    { 
      texto: 'Democratização do acesso ao cinema no Brasil',
      ano: '2019',
      isReal: true
    },
    { 
      texto: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
      ano: '2018',
      isReal: true
    },
    { 
      texto: 'Desafios para a formação educacional de surdos no Brasil',
      ano: '2017',
      isReal: true
    },
    { 
      texto: 'Caminhos para combater a intolerância religiosa no Brasil',
      ano: '2016',
      isReal: true
    },
    
    // 📚 TEMAS GENÉRICOS (Simulação)
    { 
      texto: 'A importância da educação digital no século XXI',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Desafios da mobilidade urbana sustentável no Brasil',
      ano: null,
      isReal: false
    },
    { 
      texto: 'O papel da tecnologia na preservação ambiental',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Saúde mental dos jovens na era digital',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Desigualdade social e acesso à educação no Brasil',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Fake news e seus impactos na democracia brasileira',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Valorização da cultura e identidade brasileira',
      ano: null,
      isReal: false
    },
    { 
      texto: 'Combate ao trabalho infantil no Brasil',
      ano: null,
      isReal: false
    }
  ]

  useEffect(() => {
    const carregarRedacoes = async () => {
      if (!user) return

      try {
        const q = query(
          collection(db, 'redacoes'),
          where('userId', '==', user.uid)
        )

        const querySnapshot = await getDocs(q)
        const redacoesData: Redacao[] = []

        querySnapshot.forEach((doc) => {
          redacoesData.push({ id: doc.id, ...doc.data() } as Redacao)
        })

        redacoesData.sort((a, b) => 
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
        )

        setRedacoes(redacoesData)
        console.log('✅ Redações carregadas:', redacoesData.length)
      } catch (error) {
        console.error('❌ Erro ao carregar redações:', error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarRedacoes()
  }, [user])

  const handleCorrigir = async () => {
    if (!texto.trim() || !tema.trim() || !user) {
      alert('Preencha o tema e escreva sua redação')
      return
    }

    if (texto.trim().split(/\s+/).length < 200) {
      alert('A redação deve ter pelo menos 200 palavras')
      return
    }

    setIsCorrigindo(true)

    try {
      console.log('📝 Enviando redação para correção...')
      console.log('📋 Tema:', tema)
      console.log('📄 Palavras:', texto.trim().split(/\s+/).length)

      const payload = { 
        tema: tema.trim(),
        redacao: texto.trim() 
      }

      const response = await fetch('/api/mentor/redacao-personalizado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📡 Status da resposta:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Erro da API:', errorData)
        throw new Error(errorData.detalhes || errorData.erro || 'Erro ao corrigir redação')
      }

      const resultado = await response.json()
      console.log('✅ Correção recebida:', resultado)

      if (typeof resultado.notaFinal !== 'number' || !Array.isArray(resultado.competencias)) {
        console.error('❌ Resultado inválido:', {
          notaFinal: resultado.notaFinal,
          tipoNotaFinal: typeof resultado.notaFinal,
          competencias: Array.isArray(resultado.competencias)
        })
        throw new Error('Resposta da API está incompleta')
      }

      if (resultado.competencias.length !== 5) {
        console.error('❌ Número incorreto de competências:', resultado.competencias.length)
        throw new Error('Correção incompleta - tente novamente')
      }

      const competenciasValidas = resultado.competencias.map((comp: any) => ({
        numero: comp.numero || 0,
        titulo: comp.titulo || 'Competência',
        nota: typeof comp.nota === 'number' ? comp.nota : 0,
        feedback: comp.feedback || 'Feedback não disponível'
      }))

      const pontosFortesValidos = Array.isArray(resultado.pontosFortesGerais) 
        ? resultado.pontosFortesGerais 
        : ['Análise em andamento']

      const pontosAMelhorarValidos = Array.isArray(resultado.pontosAMelhorarGerais)
        ? resultado.pontosAMelhorarGerais
        : ['Análise em andamento']

      const sugestoesValidas = typeof resultado.sugestoesGerais === 'string'
        ? resultado.sugestoesGerais
        : 'Continue praticando!'

      const novaRedacao: Omit<Redacao, 'id'> = {
        userId: user.uid,
        tema,
        texto,
        notaFinal: resultado.notaFinal,
        competencias: competenciasValidas,
        pontosFortesGerais: pontosFortesValidos,
        pontosAMelhorarGerais: pontosAMelhorarValidos,
        sugestoesGerais: sugestoesValidas,
        status: 'corrigida',
        dataCriacao: new Date().toISOString(),
        dataCorrecao: new Date().toISOString()
      }

      console.log('💾 Salvando no Firebase:', {
        notaFinal: novaRedacao.notaFinal,
        competencias: novaRedacao.competencias.length,
        pontosFortesGerais: novaRedacao.pontosFortesGerais.length,
        pontosAMelhorarGerais: novaRedacao.pontosAMelhorarGerais.length
      })

      const docRef = await addDoc(collection(db, 'redacoes'), novaRedacao)

      const redacaoComId = { id: docRef.id, ...novaRedacao }
      setRedacaoAtual(redacaoComId)
      setMostrarCorrecao(true)

      if (userProfile) {
        const novosStats = {
          ...userProfile.stats,
          totalRedacoes: userProfile.stats.totalRedacoes + 1,
          xpTotal: userProfile.stats.xpTotal + (resultado.notaFinal >= 700 ? 150 : 100),
          nivel: Math.floor((userProfile.stats.xpTotal + 100) / 500) + 1,
          mediaGeral: Math.round(
            ((userProfile.stats.mediaGeral * (userProfile.stats.totalRedacoes + userProfile.stats.totalSimulados)) + resultado.notaFinal) / 
            (userProfile.stats.totalRedacoes + userProfile.stats.totalSimulados + 1)
          )
        }

        await atualizarStats(novosStats)
      }

      const q = query(collection(db, 'redacoes'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const redacoesData: Redacao[] = []
      querySnapshot.forEach((doc) => {
        redacoesData.push({ id: doc.id, ...doc.data() } as Redacao)
      })
      
      redacoesData.sort((a, b) => 
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      )
      
      setRedacoes(redacoesData)

      console.log('✅ Redação salva e stats atualizados')
    } catch (error: any) {
      console.error('❌ Erro ao corrigir redação:', error)
      alert('Erro ao corrigir redação: ' + error.message)
    } finally {
      setIsCorrigindo(false)
    }
  }

  const handleNovaRedacao = () => {
    setTexto('')
    setTema('')
    setRedacaoAtual(null)
    setMostrarCorrecao(false)
  }

  const handleVisualizarRedacao = (redacao: Redacao) => {
    setRedacaoAtual(redacao)
    setMostrarCorrecao(true)
    setTexto(redacao.texto)
    setTema(redacao.tema)
  }

  const getCorNota = (nota: number) => {
    if (nota >= 160) return 'bg-green-600'
    if (nota >= 120) return 'bg-blue-600'
    if (nota >= 80) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (mostrarCorrecao && redacaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Correção da Redação</h1>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-600 text-lg px-4 py-2">
                  <Award className="h-5 w-5 mr-2" />
                  {redacaoAtual.notaFinal}/1000
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNovaRedacao}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avaliação por Competências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {redacaoAtual.competencias.map((comp) => (
                <div key={comp.numero} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Competência {comp.numero}</Badge>
                      <span className="text-sm font-medium">{comp.titulo}</span>
                    </div>
                    <Badge className={getCorNota(comp.nota)}>
                      {comp.nota}/200
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{comp.feedback}</p>
                  <Progress value={(comp.nota / 200) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {redacaoAtual.pontosFortesGerais.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {redacaoAtual.pontosFortesGerais.map((ponto, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-sm">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {redacaoAtual.pontosAMelhorarGerais.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Pontos a Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {redacaoAtual.pontosAMelhorarGerais.map((ponto, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">⚠</span>
                      <span className="text-sm">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Sparkles className="h-5 w-5" />
                Sugestões de Melhoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{redacaoAtual.sugestoesGerais}</p>
            </CardContent>
          </Card>

          <Button onClick={handleNovaRedacao} className="w-full h-12 text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Escrever Nova Redação
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Redação IA</h1>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.stats.totalRedacoes || 0} redações corrigidas
                  </p>
                </div>
              </div>
            </div>
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
        <Tabs defaultValue="nova" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="nova">
              <FileText className="h-4 w-4 mr-2" />
              Nova Redação
            </TabsTrigger>
            <TabsTrigger value="historico">
              <Clock className="h-4 w-4 mr-2" />
              Histórico ({redacoes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nova" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Escrever Redação</CardTitle>
                <CardDescription>
                  Escolha um tema e escreva sua redação no modelo ENEM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Escolha um Tema</Label>
                    <Badge variant="outline" className="text-xs">
                      {temasDisponiveis.filter(t => t.isReal).length} temas reais do ENEM
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {temasDisponiveis.map((temaItem, index) => (
                      <Button
                        key={index}
                        variant={tema === temaItem.texto ? 'default' : 'outline'}
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => setTema(temaItem.texto)}
                      >
                        <div className="flex items-start gap-2 w-full">
                          {/* 🆕 BADGE PARA TEMAS REAIS DO ENEM */}
                          {temaItem.isReal && (
                            <Badge 
                              variant="secondary" 
                              className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                            >
                              ENEM {temaItem.ano}
                            </Badge>
                          )}
                          <span className="flex-1">{temaItem.texto}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {tema && (
                  <div className="space-y-2">
                    <Label>Sua Redação</Label>
                    <Textarea
                      placeholder="Escreva sua redação aqui... (mínimo 200 palavras)"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      className="min-h-[400px] font-serif text-base leading-relaxed"
                    />
                    <p className="text-sm text-muted-foreground">
                      {texto.trim().split(/\s+/).filter(Boolean).length} palavras
                    </p>
                  </div>
                )}

                {tema && texto.trim().split(/\s+/).length >= 200 && (
                  <Button
                    onClick={handleCorrigir}
                    disabled={isCorrigindo}
                    className="w-full h-14 text-lg"
                  >
                    {isCorrigindo ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Corrigindo Redação...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Corrigir com IA
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            {redacoes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Você ainda não escreveu nenhuma redação</p>
                </CardContent>
              </Card>
            ) : (
              redacoes.map((redacao) => (
                <Card
                  key={redacao.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleVisualizarRedacao(redacao)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{redacao.tema}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(redacao.dataCriacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {redacao.texto.substring(0, 150)}...
                        </p>
                      </div>
                      {redacao.status === 'corrigida' && (
                        <Badge className={getCorNota(redacao.notaFinal)}>
                          <Award className="h-3 w-3 mr-1" />
                          {redacao.notaFinal}/1000
                        </Badge>
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

export default function RedacaoPage() {
  return (
    <ProtectedRoute>
      <RedacaoContent />
    </ProtectedRoute>
  )
}
