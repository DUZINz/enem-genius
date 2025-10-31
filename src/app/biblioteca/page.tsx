'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowLeft,
  ChevronRight,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { redacoesNota1000, type RedacaoNota1000 } from '@/lib/redacoes-nota-1000'

export default function BibliotecaPage() {
  const [redacaoSelecionada, setRedacaoSelecionada] = useState<RedacaoNota1000>(redacoesNota1000[0])
  const [abaAtiva, setAbaAtiva] = useState('texto')

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
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
                <Award className="h-8 w-8 text-yellow-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Biblioteca Nota 1000
                </h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Star className="h-4 w-4 mr-1" />
              {redacoesNota1000.length} Redações
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Lista de Redações */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-semibold text-lg mb-4">Redações por Ano</h2>
            {redacoesNota1000.map((redacao) => (
              <Card
                key={redacao.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  redacaoSelecionada.id === redacao.id
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200'
                }`}
                onClick={() => {
                  setRedacaoSelecionada(redacao)
                  setAbaAtiva('texto')
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="mb-2">
                      ENEM {redacao.ano}
                    </Badge>
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-sm font-medium line-clamp-2 mb-2">
                    {redacao.tema}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-600 text-white">
                      {redacao.nota} pts
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conteúdo da Redação */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-yellow-600" />
                      <Badge variant="outline">ENEM {redacaoSelecionada.ano}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {redacaoSelecionada.tema}
                    </CardTitle>
                    <CardDescription>
                      Redação oficial nota {redacaoSelecionada.nota} • Todas as competências com pontuação máxima
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-yellow-600">
                      {redacaoSelecionada.nota}
                    </p>
                    <p className="text-xs text-muted-foreground">Nota Final</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="texto">
                  <FileText className="h-4 w-4 mr-2" />
                  Texto
                </TabsTrigger>
                <TabsTrigger value="estrutura">
                  <Target className="h-4 w-4 mr-2" />
                  Estrutura
                </TabsTrigger>
                <TabsTrigger value="competencias">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Competências
                </TabsTrigger>
                <TabsTrigger value="tecnicas">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Técnicas
                </TabsTrigger>
              </TabsList>

              {/* ABA TEXTO */}
              <TabsContent value="texto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Texto Completo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {redacaoSelecionada.texto.split('\n\n').map((paragrafo, index) => (
                        <p key={index} className="text-justify leading-relaxed mb-4 text-gray-800">
                          {paragrafo}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA ESTRUTURA */}
              <TabsContent value="estrutura">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Análise Estrutural
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Organização Textual
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {redacaoSelecionada.estrutura.organizacao}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Qualidade da Argumentação
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {redacaoSelecionada.estrutura.argumentacao}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          Pontos Fortes da Estrutura
                        </h3>
                        <ul className="space-y-2">
                          {redacaoSelecionada.estrutura.pontosFortes.map((ponto, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{ponto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ABA COMPETÊNCIAS */}
              <TabsContent value="competencias">
                <div className="space-y-4">
                  {Object.entries(redacaoSelecionada.competencias).map(([key, comp]) => {
                    const numero = key.replace('competencia', '')
                    const titulos: Record<string, string> = {
                      '1': 'Demonstrar domínio da modalidade escrita formal da língua portuguesa',
                      '2': 'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento',
                      '3': 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos',
                      '4': 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
                      '5': 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos'
                    }

                    return (
                      <Card key={key}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">
                                Competência {numero}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {titulos[numero]}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-green-600">
                                {comp.nota}
                                <span className="text-sm text-muted-foreground">/200</span>
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Progress value={100} className="h-2 mb-3" />
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {comp.feedback}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* ABA TÉCNICAS */}
              <TabsContent value="tecnicas">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Técnicas e Repertório
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-blue-600 mb-3">
                          📝 Técnicas Utilizadas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {redacaoSelecionada.tecnicas.utilizadas.map((tecnica, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tecnica}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-purple-600 mb-3">
                          🎯 Repertório Sociocultural
                        </h3>
                        <ul className="space-y-2">
                          {redacaoSelecionada.tecnicas.repertorioSociocultural.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <BookOpen className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-purple-900">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-base">
                        💡 Por que essa redação tirou nota 1000?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Repertório legitimado:</strong> Usa dados oficiais, leis e pesquisas confiáveis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Argumentação sólida:</strong> Cada parágrafo desenvolve um argumento completo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Coesão perfeita:</strong> Uso variado e adequado de conectivos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Proposta completa:</strong> Apresenta os 5 elementos exigidos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Zero desvios:</strong> Domínio total da norma culta</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}