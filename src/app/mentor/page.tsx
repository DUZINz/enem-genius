'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  ArrowLeft,
  Bot,
  PenTool,
  BarChart3,
  Star,
  Award,
  FileText,
  TrendingUp,
  Target,
  Trophy
} from 'lucide-react'
import Link from 'next/link'
import { useMentor } from '@/hooks/useMentor'
import { CorretorRedacao } from '@/components/mentor/CorretorRedacao'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function MentorPage() {
  const { corrigirRedacao, isLoading, erro } = useMentor()
  const [activeTab, setActiveTab] = useState('corretor')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Dados mock para estatísticas (você pode substituir depois)
  const stats = {
    mediaGeral: 720,
    totalRedacoes: 5,
    notaMelhorCompetencia: 180,
    melhorCompetencia: 'C1',
    nivel: 'intermediário'
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

        {/* Erro */}
        {erro && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Tabs Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="corretor" className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Corretor de Redação</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Meu Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Recursos Extras</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Corretor de Redação */}
          <TabsContent value="corretor">
            <CorretorRedacao 
              onCorrigir={corrigirRedacao}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Tab: Perfil do Aluno */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>📊 Seu Perfil de Evolução</CardTitle>
                <CardDescription>
                  Acompanhe seu progresso e veja áreas de melhoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Funcionalidade em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Em breve você poderá acompanhar sua evolução com gráficos detalhados!
                  </p>
                  <Button onClick={() => setActiveTab('corretor')}>
                    <PenTool className="h-4 w-4 mr-2" />
                    Corrigir Redação Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Funcionalidades Extras */}
          <TabsContent value="extras">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Recursos Extras</CardTitle>
                <CardDescription>
                  Ferramentas adicionais para turbinar seus estudos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2">
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Desafios Diários</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Pratique com temas diários e ganhe pontos
                      </p>
                      <Button variant="outline" className="w-full">
                        Em Breve
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Banco de Temas</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Acesse centenas de temas para praticar
                      </p>
                      <Button variant="outline" className="w-full">
                        Em Breve
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6 text-center">
                      <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Metas Personalizadas</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Defina objetivos e acompanhe seu progresso
                      </p>
                      <Button variant="outline" className="w-full">
                        Em Breve
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6 text-center">
                      <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Ranking Mensal</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Compare seu desempenho com outros estudantes
                      </p>
                      <Button variant="outline" className="w-full">
                        Em Breve
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🚀 Recursos do Mentor IA</CardTitle>
            <CardDescription>
              Sistema inteligente de correção de redações ENEM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <PenTool className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Correção Inteligente</h4>
                <p className="text-sm text-gray-600">
                  Análise completa das 5 competências com IA
                </p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Feedback Detalhado</h4>
                <p className="text-sm text-gray-600">
                  Comentários específicos sobre cada aspecto
                </p>
              </div>
              <div className="text-center">
                <Bot className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">Disponível 24/7</h4>
                <p className="text-sm text-gray-600">
                  Corrija suas redações a qualquer hora
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}