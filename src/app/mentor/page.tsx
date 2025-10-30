'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Send, 
  ArrowLeft,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  PenTool,
  BarChart3,
  Star,
  Image,
  Mic,
  Paperclip,
  Sparkles,
  FileText,
  TrendingUp,
  Award,
  Target,
  Calendar,
  RefreshCw,
  Trophy,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { mockUser } from '@/lib/mock-data'
import { useMentor } from '@/hooks/useMentor'
import { PerfilAluno } from '@/components/mentor/PerfilAluno'
import { CorretorRedacao } from '@/components/mentor/CorretorRedacao'
import { FuncionalidadesExtras } from '@/components/mentor/FuncionalidadesExtras'

interface Message {
  id: string
  type: 'user' | 'mentor'
  content: string
  timestamp: Date
  category?: 'redacao' | 'simulado' | 'geral' | 'duvida' | 'correcao'
}

export default function MentorPage() {
  const {
    perfil,
    mensagens,
    isLoading,
    isTyping,
    corrigirRedacao,
    enviarMensagem,
    carregarHistorico,
    limparChat
  } = useMentor(mockUser.id)

  const [inputMessage, setInputMessage] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  useEffect(() => {
    carregarHistorico()
  }, [carregarHistorico])

  const quickQuestions = [
    {
      icon: PenTool,
      text: "Como melhorar minha argumentação na redação?",
      category: 'redacao' as const
    },
    {
      icon: BarChart3,
      text: "Qual a melhor estratégia para simulados?",
      category: 'simulado' as const
    },
    {
      icon: BookOpen,
      text: "Como criar um repertório sociocultural?",
      category: 'redacao' as const
    },
    {
      icon: Lightbulb,
      text: "Dicas para gerenciar o tempo na prova",
      category: 'geral' as const
    }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    await enviarMensagem(inputMessage)
    setInputMessage('')
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = (texto: string) => {
    setInputMessage(prev => prev + ' ' + texto)
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'redacao': return 'bg-blue-100 text-blue-800'
      case 'simulado': return 'bg-green-100 text-green-800'
      case 'geral': return 'bg-purple-100 text-purple-800'
      case 'duvida': return 'bg-orange-100 text-orange-800'
      case 'correcao': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstatisticasRapidas = () => {
    if (!perfil) return null

    const mediaGeral = Object.values(perfil.media_notas).reduce((a, b) => a + b, 0) / 5
    const melhorCompetencia = Object.entries(perfil.media_notas)
      .sort(([,a], [,b]) => b - a)[0]
    
    return {
      mediaGeral: Math.round(mediaGeral),
      totalRedacoes: perfil.historico_redacoes,
      melhorCompetencia: melhorCompetencia[0],
      notaMelhorCompetencia: melhorCompetencia[1],
      nivel: perfil.nivel_escrita
    }
  }

  const stats = getEstatisticasRapidas()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // ou um skeleton/placeholder
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Mentor IA Personalizado
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {stats && (
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-purple-600">{stats.mediaGeral}</p>
                    <p className="text-gray-500">Média</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{stats.totalRedacoes}</p>
                    <p className="text-gray-500">Redações</p>
                  </div>
                </div>
              )}
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Star className="h-4 w-4 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Rápidas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{stats.mediaGeral}</p>
                <p className="text-sm text-gray-600">Média Geral</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats.totalRedacoes}</p>
                <p className="text-sm text-gray-600">Redações Corrigidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{stats.notaMelhorCompetencia}</p>
                <p className="text-sm text-gray-600">Melhor: {stats.melhorCompetencia}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-600 capitalize">{stats.nivel}</p>
                <p className="text-sm text-gray-600">Nível Atual</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="corretor" className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Corretor</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Extras</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Chat com Mentor */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar com perguntas rápidas */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Perguntas Rápidas</CardTitle>
                    <CardDescription>Clique para enviar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleQuickQuestion(question.text)}
                      >
                        <question.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs">{question.text}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Dicas do Mentor */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span>Dica do Dia</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">
                      💡 <strong>Repertório Sociocultural:</strong> Leia pelo menos uma notícia por dia e pense como ela poderia ser usada em uma redação. Crie conexões!
                    </p>
                  </CardContent>
                </Card>

                {/* Ações Rápidas */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setActiveTab('corretor')}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Corrigir Redação
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setActiveTab('perfil')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Evolução
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setActiveTab('extras')}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Desafios
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={limparChat}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Principal */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <span>Chat com Mentor IA Personalizado</span>
                    </CardTitle>
                    <CardDescription>
                      Especialista em ENEM • Personalizado para você • Disponível 24/7
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Messages Area */}
                  <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                    {mensagens.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Olá, {mockUser.name}! 👋</h3>
                        <p className="text-gray-600 mb-4">
                          Sou seu mentor de IA especializado e personalizado para o ENEM. 
                          {perfil && ` Vejo que você já tem ${perfil.historico_redacoes} redação(ões) corrigida(s)!`}
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveTab('corretor')}
                          >
                            📝 Corrigir Redação
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickQuestion('Como melhorar minha argumentação na redação?')}
                          >
                            💡 Dicas de Redação
                          </Button>
                        </div>
                      </div>
                    )}

                    {mensagens.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.tipo === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {message.tipo === 'mentor' ? (
                              <Bot className="h-4 w-4 text-blue-600" />
                            ) : (
                              <User className="h-4 w-4 text-gray-600" />
                            )}
                            <span className="text-xs text-gray-500">
                              {message.tipo === 'mentor' ? 'Mentor IA' : 'Você'}
                            </span>
                            {message.categoria && (
                              <Badge variant="secondary" className={`text-xs ${getCategoryColor(message.categoria)}`}>
                                {message.categoria}
                              </Badge>
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-lg ${
                              message.tipo === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{message.conteudo}</p>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%]">
                          <div className="flex items-center space-x-2 mb-1">
                            <Bot className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-gray-500">Mentor IA</span>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </CardContent>
                  
                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Digite sua pergunta sobre ENEM, redação, simulados... ou cole sua redação para correção!"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="min-h-[60px] pr-20 resize-none"
                          rows={2}
                        />
                        <div className="absolute right-2 bottom-2 flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Image className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Mic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Pressione Enter para enviar • Shift+Enter para nova linha
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Corretor de Redação */}
          <TabsContent value="corretor">
            <CorretorRedacao 
              onCorrigir={corrigirRedacao}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Tab: Perfil do Aluno */}
          <TabsContent value="perfil">
            {perfil ? (
              <PerfilAluno perfil={perfil} />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum perfil encontrado</h3>
                  <p className="text-gray-600 mb-4">
                    Corrija sua primeira redação para criar seu perfil personalizado!
                  </p>
                  <Button onClick={() => setActiveTab('corretor')}>
                    <PenTool className="h-4 w-4 mr-2" />
                    Corrigir Primeira Redação
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Funcionalidades Extras */}
          <TabsContent value="extras">
            <FuncionalidadesExtras onVoiceInput={handleVoiceInput} />
          </TabsContent>
        </Tabs>

        {/* Features Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🚀 Recursos do Mentor IA Personalizado</CardTitle>
            <CardDescription>
              Sistema inteligente que aprende com seu estilo de escrita e evolui junto com você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <PenTool className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Correção Inteligente</h4>
                <p className="text-sm text-gray-600">
                  Análise completa das 5 competências com feedback personalizado baseado no seu histórico
                </p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Acompanhamento de Evolução</h4>
                <p className="text-sm text-gray-600">
                  Gráficos e relatórios que mostram seu progresso ao longo do tempo
                </p>
              </div>
              <div className="text-center">
                <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">Dicas Personalizadas</h4>
                <p className="text-sm text-gray-600">
                  Recomendações específicas baseadas nos seus pontos fortes e fracos
                </p>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold">Aprendizado Contínuo</h4>
                <p className="text-sm text-gray-600">
                  O mentor aprende seu estilo e adapta os feedbacks para maximizar seu aprendizado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}