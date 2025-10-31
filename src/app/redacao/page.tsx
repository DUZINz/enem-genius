'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Send, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Copy,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { useMentor } from '@/hooks/useMentor'
import { CorrecaoRedacao as CorrecaoRedacaoType } from '@/lib/types/mentor'

export default function RedacaoPage() {
  const [activeTab, setActiveTab] = useState('escrever')
  const [tema, setTema] = useState('')
  const [redacao, setRedacao] = useState('')
  const [correcaoAtual, setCorrecaoAtual] = useState<CorrecaoRedacaoType | null>(null)
  const [mostrarTextoCorrigido, setMostrarTextoCorrigido] = useState(false)
  
  const { corrigirRedacao, isLoading, erro } = useMentor()

  const handleCorrigir = async () => {
    if (!redacao.trim()) return
    
    const resultado = await corrigirRedacao(redacao)
    if (resultado) {
      setCorrecaoAtual(resultado)
      setActiveTab('resultado')
    }
  }

  const handleNovaRedacao = () => {
    setRedacao('')
    setTema('')
    setCorrecaoAtual(null)
    setMostrarTextoCorrigido(false)
    setActiveTab('escrever')
  }

  const copiarTextoCorrigido = () => {
    if (correcaoAtual?.texto_corrigido) {
      navigator.clipboard.writeText(correcaoAtual.texto_corrigido)
    }
  }

  const getNotaColor = (nota: number) => {
    if (nota >= 160) return 'text-green-600'
    if (nota >= 120) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getNotaStatus = (nota: number) => {
    if (nota >= 160) return { icon: CheckCircle, color: 'text-green-600', label: 'Boa' }
    if (nota >= 120) return { icon: AlertCircle, color: 'text-yellow-600', label: 'Regular' }
    return { icon: AlertCircle, color: 'text-red-600', label: 'Precisa melhorar' }
  }

  const palavras = redacao.split(' ').filter(word => word.length > 0).length
  const caracteres = redacao.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
                <FileText className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Editor de Redação
                </h1>
              </div>
            </div>
            <Button 
              onClick={handleCorrigir}
              disabled={!redacao.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Corrigindo...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Correção por IA
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Erro */}
        {erro && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="escrever" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Escrever</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload/OCR</span>
            </TabsTrigger>
            <TabsTrigger value="resultado" className="flex items-center space-x-2" disabled={!correcaoAtual}>
              <BarChart3 className="h-4 w-4" />
              <span>Resultado</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Escrever */}
          <TabsContent value="escrever">
            <Card>
              <CardHeader>
                <CardTitle>Nova Redação</CardTitle>
                <CardDescription>
                  Escreva sua redação seguindo o modelo dissertativo-argumentativo do ENEM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tema da Redação
                  </label>
                  <Input
                    placeholder="Ex: A democratização do acesso ao cinema no Brasil"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sua Redação
                  </label>
                  <Textarea
                    placeholder="Comece escrevendo sua redação aqui...

Dica: Uma boa redação ENEM tem:
• Introdução com contextualização e tese
• Desenvolvimento com argumentos e repertório
• Conclusão com proposta de intervenção completa
• Entre 200-300 palavras
• Linguagem formal"
                    value={redacao}
                    onChange={(e) => setRedacao(e.target.value)}
                    className="min-h-[400px] resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    {caracteres} caracteres • {palavras} palavras
                  </div>
                  <div className="flex items-center space-x-2">
                    {palavras < 200 && (
                      <Badge variant="outline" className="text-red-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Mínimo: 200 palavras
                      </Badge>
                    )}
                    {palavras >= 200 && palavras <= 300 && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tamanho ideal
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleCorrigir}
                  disabled={!redacao.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Corrigindo com IA...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Corrigir Redação
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Upload/OCR */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload/OCR</CardTitle>
                <CardDescription>
                  Envie uma foto da sua redação para extrair o texto automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Funcionalidade em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Em breve você poderá enviar fotos das suas redações!
                  </p>
                  <Button onClick={() => setActiveTab('escrever')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Escrever Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Resultado */}
          <TabsContent value="resultado">
            {correcaoAtual && (
              <div className="space-y-6">
                {/* Notas por Competência */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <span>Resultado da Correção</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {correcaoAtual.nota_total}
                          <span className="text-sm text-gray-500">/1000</span>
                        </div>
                        <p className="text-sm text-gray-600">Nota Total</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Object.entries(correcaoAtual.notas_competencias).map(([comp, nota]) => {
                        const { icon: StatusIcon, color, label } = getNotaStatus(nota)
                        const porcentagem = (nota / 200) * 100
                        
                        return (
                          <div key={comp} className="text-center space-y-2">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="font-bold text-lg">{comp}</span>
                              <StatusIcon className={`h-4 w-4 ${color}`} />
                            </div>
                            <div className={`text-2xl font-bold ${getNotaColor(nota)}`}>
                              {nota}
                            </div>
                            <Progress value={porcentagem} className="h-2" />
                            <p className="text-xs text-gray-600">{label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Comentários */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <span>Feedback Detalhado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {correcaoAtual.comentarios.map((comentario, index) => {
                      const isError = comentario.includes('🔴')
                      const isWarning = comentario.includes('🟡')
                      const isSuccess = comentario.includes('🟢')
                      
                      let bgColor = 'bg-blue-50 border-blue-200'
                      if (isError) bgColor = 'bg-red-50 border-red-200'
                      else if (isWarning) bgColor = 'bg-yellow-50 border-yellow-200'
                      else if (isSuccess) bgColor = 'bg-green-50 border-green-200'
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg border ${bgColor}`}>
                          <p className="text-sm">{comentario}</p>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Erros Detectados */}
                {correcaoAtual.erros_detectados.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">🔍 Erros Identificados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {correcaoAtual.erros_detectados.map((erro, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {erro}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Dicas Personalizadas */}
                {correcaoAtual.dicas_personalizadas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">💡 Dicas Personalizadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {correcaoAtual.dicas_personalizadas.map((dica, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{dica}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Texto Corrigido */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>📝 Versão Corrigida</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setMostrarTextoCorrigido(!mostrarTextoCorrigido)}
                        >
                          {mostrarTextoCorrigido ? 'Ocultar' : 'Mostrar'}
                        </Button>
                        {mostrarTextoCorrigido && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={copiarTextoCorrigido}
                            className="flex items-center space-x-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copiar</span>
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  {mostrarTextoCorrigido && (
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {correcaoAtual.texto_corrigido}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Botão Nova Redação */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleNovaRedacao}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Escrever Nova Redação
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}