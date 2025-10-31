'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle2, Lightbulb, FileText, Loader2, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMentor } from '@/hooks/useMentor'
import type { CorrecaoRedacao as CorrecaoRedacaoType } from '@/lib/types/mentor'

export default function RedacaoPage() {
  const [activeTab, setActiveTab] = useState('escrever')
  const [tema, setTema] = useState('')
  const [redacao, setRedacao] = useState('')
  const [correcaoAtual, setCorrecaoAtual] = useState<CorrecaoRedacaoType | null>(null)
  const [mostrarTextoCorrigido, setMostrarTextoCorrigido] = useState(false)
  
  const { corrigirRedacao, isLoading, erro } = useMentor()

  const handleCorrigir = async () => {
    if (!redacao.trim() || redacao.length < 50) {
      alert('Escreva pelo menos 50 caracteres para a redação ser corrigida.')
      return
    }

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

  const getCorCompetencia = (nota: number) => {
    if (nota >= 160) return 'text-green-600'
    if (nota >= 120) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getNivelCompetencia = (nota: number) => {
    if (nota === 200) return 'Excelente'
    if (nota >= 160) return 'Bom'
    if (nota >= 120) return 'Regular'
    if (nota >= 80) return 'Fraco'
    return 'Muito Fraco'
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Corretor de Redação ENEM</h1>
        <p className="text-muted-foreground">
          Receba feedback detalhado baseado nas 5 competências do ENEM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="escrever">
            <FileText className="w-4 h-4 mr-2" />
            Escrever
          </TabsTrigger>
          <TabsTrigger value="upload" disabled>
            <AlertCircle className="w-4 h-4 mr-2" />
            Upload/OCR
          </TabsTrigger>
          <TabsTrigger value="resultado" disabled={!correcaoAtual}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Resultado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="escrever" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Digite sua Redação</CardTitle>
              <CardDescription>
                Escreva uma redação dissertativa-argumentativa seguindo o tema proposto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tema">Tema (opcional)</Label>
                <Input
                  id="tema"
                  placeholder="Ex: Desafios da educação no Brasil"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redacao">Sua Redação</Label>
                <Textarea
                  id="redacao"
                  placeholder="Digite sua redação aqui..."
                  className="min-h-[400px] font-mono text-sm"
                  value={redacao}
                  onChange={(e) => setRedacao(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {redacao.length} caracteres
                </p>
              </div>

              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleCorrigir} 
                disabled={isLoading || redacao.length < 50}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Corrigindo...
                  </>
                ) : (
                  'Corrigir Redação'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultado" className="space-y-6">
          {correcaoAtual && (
            <>
              {/* Nota Total */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                      Resultado da Correção
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-purple-600">
                        {correcaoAtual.nota_total}
                        <span className="text-lg text-muted-foreground">/1000</span>
                      </p>
                      <p className="text-sm text-muted-foreground">Nota Total</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(correcaoAtual.notas_competencias).map(([comp, nota]) => (
                      <div key={comp} className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-sm font-medium text-muted-foreground">{comp}</p>
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </div>
                        <p className={`text-3xl font-bold ${getCorCompetencia(nota)}`}>
                          {nota}
                        </p>
                        <Progress value={(nota / 200) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {getNivelCompetencia(nota)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Detalhado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Feedback Detalhado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {correcaoAtual.comentarios.map((comentario, index) => (
                    <Alert
                      key={index}
                      variant={
                        comentario.includes('🟢') ? 'default' :
                        comentario.includes('🟡') ? 'default' : 'destructive'
                      }
                      className={
                        comentario.includes('🟢') ? 'bg-green-50 border-green-200' :
                        comentario.includes('🟡') ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }
                    >
                      <AlertDescription className="text-sm">
                        {comentario}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>

              {/* Erros Identificados - MELHORADO */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Erros Identificados
                  </CardTitle>
                  <CardDescription>
                    Pontos que precisam de atenção especial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {correcaoAtual.erros_detectados.map((erro, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-red-900 leading-relaxed">
                            {erro}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {correcaoAtual.erros_detectados.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p>Nenhum erro crítico identificado! 🎉</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dicas Personalizadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Dicas Personalizadas
                  </CardTitle>
                  <CardDescription>
                    Sugestões para melhorar sua redação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {correcaoAtual.dicas_personalizadas.map((dica, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {dica}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Versão Corrigida */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Versão Corrigida
                      </CardTitle>
                      <CardDescription>
                        Sugestão de melhoria da sua redação
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMostrarTextoCorrigido(!mostrarTextoCorrigido)}
                    >
                      {mostrarTextoCorrigido ? 'Ocultar' : 'Mostrar'}
                    </Button>
                  </div>
                </CardHeader>
                {mostrarTextoCorrigido && (
                  <CardContent>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">
                        {correcaoAtual.texto_corrigido}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Button onClick={handleNovaRedacao} className="w-full" size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Escrever Nova Redação
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}