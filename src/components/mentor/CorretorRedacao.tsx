'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { CorrecaoRedacao } from '@/lib/types/mentor'
import {
  FileText,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react'

interface CorretorRedacaoProps {
  onCorrigir: (texto: string) => Promise<CorrecaoRedacao | null>
  isLoading: boolean
}

export function CorretorRedacao({ onCorrigir, isLoading }: CorretorRedacaoProps) {
  const [texto, setTexto] = useState('')
  const [correcaoAtual, setCorrecaoAtual] = useState<CorrecaoRedacao | null>(null)
  const [mostrarTextoCorrigido, setMostrarTextoCorrigido] = useState(false)

  const handleCorrigir = async () => {
    if (!texto.trim()) return
    
    const resultado = await onCorrigir(texto)
    if (resultado) {
      setCorrecaoAtual(resultado)
    }
  }

  const handleNovaRedacao = () => {
    setTexto('')
    setCorrecaoAtual(null)
    setMostrarTextoCorrigido(false)
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

  return (
    <div className="space-y-6">
      {/* Área de Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Envie sua Redação para Correção</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Cole aqui o texto da sua redação...

Dica: Escreva pelo menos 200 palavras para uma análise completa. O mentor analisará:
• Estrutura e organização
• Gramática e ortografia
• Argumentação e coerência
• Proposta de intervenção
• Repertório sociocultural`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {texto.length} caracteres • {texto.split(' ').filter(word => word.length > 0).length} palavras
            </div>
            
            <div className="flex space-x-2">
              {correcaoAtual && (
                <Button 
                  variant="outline" 
                  onClick={handleNovaRedacao}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Nova Redação</span>
                </Button>
              )}
              
              <Button 
                onClick={handleCorrigir}
                disabled={!texto.trim() || isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Corrigindo...' : 'Corrigir Redação'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Correção */}
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

          {/* Comentários e Dicas */}
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
        </div>
      )}
    </div>
  )
}