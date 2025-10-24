'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { mockUser } from '@/lib/mock-data'

interface Message {
  id: string
  type: 'user' | 'mentor'
  content: string
  timestamp: Date
  category?: 'redacao' | 'simulado' | 'geral' | 'duvida'
}

// Data fixa para evitar problemas de hidratação
const FIXED_INITIAL_DATE = new Date('2024-01-20T10:30:00')

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'mentor',
      content: `Olá, ${mockUser.name}! 👋 Sou seu mentor de IA especializado em ENEM. Estou aqui para ajudar você com:

📝 **Redação**: Correção, dicas de estrutura, repertório sociocultural
📊 **Simulados**: Explicação de questões, estratégias de resolução
📚 **Estudos**: Planos personalizados, técnicas de memorização
❓ **Dúvidas**: Qualquer matéria do ENEM

Como posso te ajudar hoje?`,
      timestamp: FIXED_INITIAL_DATE,
      category: 'geral'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const generateMentorResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('redação') || lowerMessage.includes('redacao')) {
      return `Ótima pergunta sobre redação! 📝

Para melhorar sua redação no ENEM, foque nestes pontos:

**1. Estrutura Clara:**
• Introdução: Contextualize o tema e apresente sua tese
• Desenvolvimento: 2 parágrafos com argumentos distintos
• Conclusão: Retome a tese e apresente proposta de intervenção

**2. Repertório Sociocultural:**
• Use dados estatísticos, exemplos históricos, referências culturais
• Conecte sempre com o tema proposto
• Diversifique suas fontes (livros, filmes, notícias, estudos)

**3. Competências ENEM:**
• C1: Domine a norma culta
• C2: Compreenda bem o tema
• C3: Organize informações logicamente
• C4: Use conectivos adequados
• C5: Elabore proposta detalhada

**Dica prática:** Pratique 1 redação por semana e peça feedback. Quer que eu analise alguma redação sua?`
    }
    
    if (lowerMessage.includes('simulado') || lowerMessage.includes('questão') || lowerMessage.includes('questao')) {
      return `Excelente! Vamos falar sobre estratégias para simulados! 📊

**Estratégias por Área:**

**📚 Linguagens (90 questões):**
• Comece pela literatura e gramática (mais rápidas)
• Deixe interpretação de texto por último
• Tempo médio: 3 minutos por questão

**🔢 Matemática (45 questões):**
• Identifique questões fáceis primeiro
• Use eliminação nas alternativas
• Tempo médio: 4 minutos por questão

**🌍 Humanas (45 questões):**
• Foque em História e Geografia do Brasil
• Atenção aos gráficos e mapas
• Tempo médio: 4 minutos por questão

**🧪 Natureza (45 questões):**
• Priorize Biologia e Química
• Física: foque em fórmulas básicas
• Tempo médio: 4 minutos por questão

**Dica de ouro:** Faça simulados cronometrados semanalmente para treinar o tempo!`
    }
    
    if (lowerMessage.includes('repertório') || lowerMessage.includes('repertorio') || lowerMessage.includes('cultura')) {
      return `Vamos construir seu repertório sociocultural! 🎭

**Fontes Essenciais:**

**📚 Literatura:**
• Machado de Assis, Clarice Lispector
• "1984" de Orwell, "O Cortiço" de Aluísio Azevedo

**🎬 Cinema/Séries:**
• "Cidade de Deus", "Central do Brasil"
• "Black Mirror", "3%" (Netflix)

**📊 Dados e Estudos:**
• IBGE, IPEA, ONU, OMS
• Relatórios sobre educação, saúde, meio ambiente

**🏛️ História/Filosofia:**
• Conceitos: democracia, cidadania, direitos humanos
• Pensadores: Aristóteles, John Rawls, Hannah Arendt

**📱 Atualidades:**
• Acompanhe jornais: Folha, Estadão, G1
• Revistas: Veja, Época, Superinteressante

**Como usar:**
1. Conecte sempre com o tema
2. Cite de forma natural, não forçada
3. Explique brevemente a referência
4. Use para fundamentar seus argumentos

Quer sugestões específicas para algum tema?`
    }
    
    if (lowerMessage.includes('tempo') || lowerMessage.includes('cronometr') || lowerMessage.includes('pressa')) {
      return `Gestão de tempo é fundamental! ⏰

**Cronograma Ideal ENEM:**

**Domingo (Linguagens + Redação):**
• 1h30: Redação (prioridade máxima!)
• 3h30: 90 questões de Linguagens
• Sobra: Revisão e transferência do gabarito

**Sábado (Exatas + Humanas + Natureza):**
• 1h15: Matemática (45 questões)
• 1h15: Humanas (45 questões)
• 1h15: Natureza (45 questões)
• 15min: Revisão e gabarito

**Dicas Práticas:**

✅ **Faça primeiro:** Redação (energia mental máxima)
✅ **Questões fáceis:** Ganhe confiança e tempo
✅ **Marque no caderno:** Transfira gabarito no final
✅ **Não trave:** Máximo 5min por questão difícil
✅ **Use eliminação:** Descarte alternativas absurdas

**Treino em casa:**
• Simulados cronometrados
• Redações em 1h30 máximo
• Pratique transferir gabarito rapidamente

Lembre-se: é melhor fazer 80% bem feito que 100% correndo!`
    }
    
    // Resposta genérica encorajadora
    return `Entendi sua dúvida! 🤔

Sou seu mentor especializado em ENEM e estou aqui para te ajudar com qualquer questão. Posso te auxiliar com:

📝 **Redação:** Estrutura, argumentação, repertório, competências
📊 **Simulados:** Estratégias, resolução de questões, gestão de tempo
📚 **Conteúdos:** Todas as matérias do ENEM
🎯 **Planejamento:** Cronogramas de estudo, metas, motivação

Pode ser mais específico sobre o que você gostaria de saber? Por exemplo:
• "Como melhorar na competência 5 da redação?"
• "Qual a melhor ordem para resolver questões de matemática?"
• "Como memorizar fórmulas de física?"

Estou aqui para te ajudar a alcançar seus objetivos! 💪`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      category: 'duvida'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simular delay de resposta da IA
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'mentor',
        content: generateMentorResponse(inputMessage),
        timestamp: new Date(),
        category: 'geral'
      }
      
      setMessages(prev => [...prev, mentorResponse])
      setIsTyping(false)
    }, 1500)
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

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'redacao': return 'bg-blue-100 text-blue-800'
      case 'simulado': return 'bg-green-100 text-green-800'
      case 'geral': return 'bg-purple-100 text-purple-800'
      case 'duvida': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                  Mentor IA
                </h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <Star className="h-4 w-4 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>

          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>Chat com Mentor IA</span>
                </CardTitle>
                <CardDescription>
                  Especialista em ENEM • Disponível 24/7 • Multimodal
                </CardDescription>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === 'mentor' ? (
                          <Bot className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="text-xs text-gray-500">
                          {message.type === 'mentor' ? 'Mentor IA' : 'Você'}
                        </span>
                        {message.category && (
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(message.category)}`}>
                            {message.category}
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
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
                      placeholder="Digite sua pergunta sobre ENEM, redação, simulados..."
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

        {/* Features Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recursos do Mentor IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <PenTool className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Correção de Redação</h4>
                <p className="text-sm text-gray-600">Cole sua redação e receba feedback detalhado</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Explicação de Questões</h4>
                <p className="text-sm text-gray-600">Envie questões e receba explicações passo-a-passo</p>
              </div>
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">Planos de Estudo</h4>
                <p className="text-sm text-gray-600">Receba cronogramas personalizados</p>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold">Suporte Multimodal</h4>
                <p className="text-sm text-gray-600">Texto, imagem e voz (em breve)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}