'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  ArrowLeft,
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  FileQuestion,
  Lightbulb,
  PenTool
} from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Componente para renderizar markdown/texto formatado
const MessageContent = ({ content }: { content: string }) => {
  const processContent = (text: string) => {
    let processed = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/##\s*(.*?)(\n|$)/g, '<h3 class="text-base font-bold mt-3 mb-2">$1</h3>')
      .replace(/###\s*(.*?)(\n|$)/g, '<h4 class="text-sm font-semibold mt-2 mb-1">$1</h4>')
    
    processed = processed.replace(/^(\d+)\.\s+(.*)$/gm, '<li class="ml-4 mb-1">$2</li>')
    processed = processed.replace(/^[•\-]\s+(.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
    
    if (processed.includes('<li')) {
      // CORRIGIDO: Separar as flags g e s
      processed = processed.replace(/(<li.*?<\/li>)/g, '<ul class="list-disc ml-4 my-2 space-y-1">$1</ul>')
    }
    
    processed = processed.replace(/\n\n/g, '</p><p class="mb-2">')
    processed = `<p class="mb-2">${processed}</p>`
    
    return processed
  }

  return (
    <div 
      className="prose prose-sm max-w-none text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  )
}

export default function MentorPage() {
  const [activeTab, setActiveTab] = useState('chat')
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMounted(true)
    setMessages([{
      role: 'assistant',
      content: `Olá! 👋 Sou seu Mentor IA especializado em redações ENEM!

Como posso te ajudar hoje?

## Posso te auxiliar com:

• Estrutura de redações dissertativo-argumentativas
• Análise das 5 competências do ENEM
• Dicas de argumentação e repertório sociocultural
• Conectivos e coesão textual
• Proposta de intervenção completa
• Correção de textos e exemplos
• Temas atuais e como desenvolvê-los

## Exemplos de perguntas:

- "Como fazer uma boa introdução?"
- "O que é repertório sociocultural?"
- "Me explique a competência 5"
- "Como usar conectivos corretamente?"
- "Analise este parágrafo que escrevi"

**Pode perguntar à vontade!** 🚀`,
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setErro('')

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyClf_8zgww87jixJw-XlAwvaM4Oy4BTl2w'

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Você é um MENTOR IA especializado em redações do ENEM. Seja amigável, didático e objetivo.

CONTEXTO DA CONVERSA:
${messages.slice(-4).map(m => `${m.role === 'user' ? 'Aluno' : 'Mentor'}: ${m.content}`).join('\n')}

PERGUNTA DO ALUNO:
${input}

INSTRUÇÕES:
- Seja específico e prático nas respostas
- Use exemplos quando possível
- Se for sobre redação ENEM, mencione as competências relevantes
- Use emojis para deixar mais amigável
- Seja breve mas completo (máximo 400 palavras)
- Se o aluno pedir análise de texto, seja detalhado
- Se for dúvida sobre ENEM geral, responda com base no edital oficial
- Use formatação markdown quando necessário (## para títulos, - para listas, ** para negrito)
- Separe parágrafos com linha em branco
- Para listas, use hífen (-) ou números (1., 2., etc)

RESPONDA DE FORMA CLARA E AMIGÁVEL:`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao conectar com a IA')
      }

      const data = await response.json()
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiResponse) {
        throw new Error('Resposta vazia da IA')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      setErro('Ops! Tive um problema ao processar sua mensagem. Tente novamente.')
      
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Desculpe, tive um problema técnico. Por favor, tente reformular sua pergunta ou tente novamente em alguns instantes.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const sugestoesPergunta = [
    "Como fazer uma boa introdução?",
    "O que é repertório sociocultural?",
    "Explique a competência 5",
    "Como usar conectivos corretamente?",
    "Dicas para argumentação forte"
  ]

  const handleSugestao = (sugestao: string) => {
    setInput(sugestao)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
                <Bot className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Mentor IA - Chat
                </h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Sparkles className="h-4 w-4 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat com IA
            </TabsTrigger>
            <TabsTrigger value="info">
              <BookOpen className="h-4 w-4 mr-2" />
              Como Usar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <Card className="border-0 shadow-lg">
              <div className="flex flex-col h-[calc(100vh-16rem)]">
                {/* Área de mensagens com scroll próprio */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[85%] ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Bot className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </p>
                            ) : (
                              <MessageContent content={message.content} />
                            )}
                          </div>
                          <p
                            className={`text-xs px-2 ${
                              message.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Elemento invisível para scroll automático */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Sugestões rápidas */}
                {messages.length <= 1 && (
                  <div className="px-4 py-3 border-t bg-gray-50">
                    <p className="text-xs font-medium text-gray-600 mb-2">💡 Sugestões de perguntas:</p>
                    <div className="flex flex-wrap gap-2">
                      {sugestoesPergunta.map((sugestao, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs hover:bg-purple-50 hover:border-purple-300"
                          onClick={() => handleSugestao(sugestao)}
                        >
                          {sugestao}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Erro */}
                {erro && (
                  <Alert variant="destructive" className="mx-4 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{erro}</AlertDescription>
                  </Alert>
                )}

                {/* Input fixo no bottom */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta sobre redação, ENEM ou peça ajuda..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Como usar o Mentor IA
                  </CardTitle>
                  <CardDescription>
                    Seu tutor virtual especializado em redações ENEM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <FileQuestion className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Tire dúvidas sobre redação</h4>
                        <p className="text-sm text-gray-600">
                          Pergunte sobre estrutura, argumentação, conectivos, competências do ENEM, etc.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <PenTool className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Peça análise de trechos</h4>
                        <p className="text-sm text-gray-600">
                          Cole um parágrafo ou introdução e peça feedback específico
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Aprenda sobre temas</h4>
                        <p className="text-sm text-gray-600">
                          Peça sugestões de repertório, exemplos de argumentação, dados estatísticos
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Geração de exemplos</h4>
                        <p className="text-sm text-gray-600">
                          Peça exemplos de introduções, conclusões, argumentos, propostas de intervenção
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle>💡 Exemplos de perguntas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"Como fazer uma introdução que chame atenção?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"O que é repertório sociocultural e como usar?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"Analise esta introdução: [seu texto]"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"Quais conectivos usar para argumentação?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"Me dê 3 argumentos sobre educação digital"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>"Como fazer uma proposta de intervenção completa?"</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}