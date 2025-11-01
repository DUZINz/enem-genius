'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Star,
  Brain,
  FileText,
  Clock,
  Target,
  Award
} from 'lucide-react'
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Redacao {
  id: string
  userId: string
  tema: string
  texto: string
  nota?: number
  feedback?: {
    competencia1: { nota: number; comentario: string }
    competencia2: { nota: number; comentario: string }
    competencia3: { nota: number; comentario: string }
    competencia4: { nota: number; comentario: string }
    competencia5: { nota: number; comentario: string }
    pontosFortes: string[]
    pontosMelhoria: string[]
    sugestoes: string[]
  }
  status: 'rascunho' | 'corrigindo' | 'corrigida'
  dataCriacao: string
  dataCorrecao?: string
}

function RedacaoContent() {
  const { user, userProfile, atualizarStats } = useAuth()
  const [redacoes, setRedacoes] = useState<Redacao[]>([])
  const [redacaoAtual, setRedacaoAtual] = useState<Redacao | null>(null)
  const [texto, setTexto] = useState('')
  const [tema, setTema] = useState('')
  const [isCorrigindo, setIsCorrigindo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState('')

  const temasSugeridos = [
    'A importância da educação financeira nas escolas',
    'Desafios da mobilidade urbana nas grandes cidades',
    'O impacto das redes sociais na saúde mental dos jovens',
    'A democratização do acesso à internet no Brasil',
    'Combate à violência contra a mulher',
    'Sustentabilidade e consumo consciente',
    'O papel da tecnologia na educação pós-pandemia'
  ]

  // Carregar redações do Firebase
  useEffect(() => {
    const carregarRedacoes = async () => {
      if (!user) return

      try {
        // ✅ VOLTAR A USAR orderBy (índice criado)
        const q = query(
          collection(db, 'redacoes'),
          where('userId', '==', user.uid),
          orderBy('dataCriacao', 'desc') // ✅ Pode usar agora
        )

        const querySnapshot = await getDocs(q)
        const redacoesData: Redacao[] = []

        querySnapshot.forEach((doc) => {
          redacoesData.push({ id: doc.id, ...doc.data() } as Redacao)
        })

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

  const handleSalvarRascunho = async () => {
    if (!user || !texto || !tema) {
      setErro('Preencha o tema e o texto da redação')
      return
    }

    try {
      const novaRedacao: Omit<Redacao, 'id'> = {
        userId: user.uid,
        tema,
        texto,
        status: 'rascunho',
        dataCriacao: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'redacoes'), novaRedacao)
      
      const redacaoSalva = { id: docRef.id, ...novaRedacao }
      setRedacoes([redacaoSalva, ...redacoes])
      
      alert('✅ Rascunho salvo com sucesso!')
      console.log('💾 Redação salva:', docRef.id)
    } catch (error) {
      console.error('❌ Erro ao salvar rascunho:', error)
      setErro('Erro ao salvar rascunho')
    }
  }

  const handleCorrigir = async () => {
    if (!user || !texto || !tema) {
      setErro('Preencha o tema e o texto da redação')
      return
    }

    const palavrasCount = texto.split(/\s+/).filter(p => p.length > 0).length
    if (palavrasCount < 200) {
      setErro('A redação deve ter pelo menos 200 palavras')
      return
    }

    setIsCorrigindo(true)
    setErro('')

    try {
      console.log('📝 Iniciando correção...')
      console.log('Tema:', tema)
      console.log('Texto:', texto.substring(0, 100) + '...')

      // Chamar API de correção
      const response = await fetch('/api/mentor/redacao-personalizado', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tema: tema.trim(), 
          redacao: texto.trim() 
        })
      })

      console.log('Status da resposta:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API:', errorData)
        throw new Error(errorData.erro || 'Erro ao corrigir redação')
      }

      const data = await response.json()
      console.log('✅ Resposta recebida:', data)

      // Salvar redação no Firebase
      const novaRedacao: Omit<Redacao, 'id'> = {
        userId: user.uid,
        tema,
        texto,
        status: 'corrigida',
        nota: data.notaFinal,
        feedback: data.feedback,
        dataCriacao: new Date().toISOString(),
        dataCorrecao: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'redacoes'), novaRedacao)
      console.log('💾 Redação salva no Firebase:', docRef.id)

      const redacaoCorrigida = { id: docRef.id, ...novaRedacao }
      setRedacoes([redacaoCorrigida, ...redacoes])
      setRedacaoAtual(redacaoCorrigida)

      // Atualizar stats do usuário
      if (userProfile) {
        const novosStats = {
          ...userProfile.stats,
          totalRedacoes: userProfile.stats.totalRedacoes + 1,
          xpTotal: userProfile.stats.xpTotal + 100,
          nivel: Math.floor((userProfile.stats.xpTotal + 100) / 500) + 1,
          mediaGeral: Math.round(
            ((userProfile.stats.mediaGeral * userProfile.stats.totalRedacoes) + data.notaFinal) / 
            (userProfile.stats.totalRedacoes + 1)
          )
        }

        await atualizarStats(novosStats)
      }

      // Limpar campos
      setTexto('')
      setTema('')

      alert(`🎉 Redação corrigida!\n\n📊 Nota: ${data.notaFinal}/1000\n✨ +100 XP`)

    } catch (error: any) {
      console.error('❌ Erro ao corrigir:', error)
      setErro(error.message || 'Erro ao corrigir redação. Tente novamente.')
    } finally {
      setIsCorrigindo(false)
    }
  }

  const palavrasCount = texto.split(/\s+/).filter(p => p.length > 0).length
  const progresso = Math.min((palavrasCount / 300) * 100, 100)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Corretor de Redação IA</h1>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.stats.totalRedacoes || 0} redações corrigidas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Média: {userProfile?.stats.mediaGeral || 0}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="escrever" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="escrever">
              <FileText className="h-4 w-4 mr-2" />
              Escrever
            </TabsTrigger>
            <TabsTrigger value="historico">
              <Clock className="h-4 w-4 mr-2" />
              Histórico ({redacoes.length})
            </TabsTrigger>
          </TabsList>

          {/* Aba: Escrever */}
          <TabsContent value="escrever" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Nova Redação</CardTitle>
                    <CardDescription>
                      Escreva sua redação seguindo o modelo ENEM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tema */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tema</label>
                      <Textarea
                        placeholder="Digite ou escolha um tema ao lado"
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        rows={2}
                      />
                    </div>

                    {/* Texto */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Texto da Redação</label>
                        <span className="text-xs text-muted-foreground">
                          {palavrasCount} palavras
                        </span>
                      </div>
                      <Textarea
                        placeholder="Digite sua redação aqui..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        rows={20}
                        className="font-mono"
                      />
                      <Progress value={progresso} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {palavrasCount < 200 && '⚠️ Mínimo: 200 palavras'}
                        {palavrasCount >= 200 && palavrasCount < 300 && '👍 Continue escrevendo...'}
                        {palavrasCount >= 300 && '✅ Quantidade adequada!'}
                      </p>
                    </div>

                    {erro && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{erro}</AlertDescription>
                      </Alert>
                    )}

                    {/* Botões */}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSalvarRascunho}
                        variant="outline"
                        disabled={!texto || !tema}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Salvar Rascunho
                      </Button>
                      <Button
                        onClick={handleCorrigir}
                        disabled={isCorrigindo || palavrasCount < 200 || !tema}
                        className="flex-1"
                      >
                        {isCorrigindo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Corrigindo...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Corrigir com IA (+ 100 XP)
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Temas Sugeridos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Temas Sugeridos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {temasSugeridos.map((temaSugerido, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setTema(temaSugerido)}
                      >
                        <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="text-xs">{temaSugerido}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Dicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Dicas ENEM
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Use conectivos variados</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Apresente proposta de intervenção</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Respeite os direitos humanos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Evite clichês e senso comum</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba: Histórico */}
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
                <Card key={redacao.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{redacao.tema}</CardTitle>
                        <CardDescription>
                          {new Date(redacao.dataCriacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {redacao.status === 'rascunho' && (
                          <Badge variant="outline">Rascunho</Badge>
                        )}
                        {redacao.status === 'corrigindo' && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Corrigindo
                          </Badge>
                        )}
                        {redacao.status === 'corrigida' && redacao.nota && (
                          <Badge className="bg-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            {redacao.nota}/1000
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {redacao.texto}
                    </p>
                    {redacao.status === 'corrigida' && redacao.feedback && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setRedacaoAtual(redacao)}
                      >
                        Ver Correção Completa
                      </Button>
                    )}
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