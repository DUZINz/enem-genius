'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  PenTool, 
  BarChart3, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  Brain,
  FileText,
  Users,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { mockDashboardStats, mockUser, mockRedacoes, mockPlanoEstudos } from '@/lib/mock-data'
import { formatScore, getGradeColor, formatDate } from '@/lib/utils'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const stats = mockDashboardStats
  const user = mockUser
  const recentRedacoes = mockRedacoes.slice(0, 3)
  const plano = mockPlanoEstudos

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ENEM Genius
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user.name}!</span>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Continue sua jornada rumo ao ENEM. Você está indo muito bem!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Média Geral</p>
                  <p className="text-3xl font-bold">{formatScore(stats.mediaNotas)}</p>
                </div>
                <Award className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Redações</p>
                  <p className="text-3xl font-bold">{stats.totalRedacoes}</p>
                </div>
                <PenTool className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Simulados</p>
                  <p className="text-3xl font-bold">{stats.simuladosFeitos}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Horas Estudadas</p>
                  <p className="text-3xl font-bold">{stats.horasEstudadas}h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="redacao">Redação</TabsTrigger>
            <TabsTrigger value="simulados">Simulados</TabsTrigger>
            <TabsTrigger value="plano">Plano de Estudos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Progresso Geral</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Plano de Estudos</span>
                      <span>{stats.progressoPlano}%</span>
                    </div>
                    <Progress value={stats.progressoPlano} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700">Pontos Fortes</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats.pontosFortes.map((ponto, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {ponto}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-700">Áreas para Melhorar</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats.pontosFracos.map((ponto, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                          {ponto}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Continue seus estudos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/redacao">
                    <Button className="w-full justify-start" variant="outline">
                      <PenTool className="h-4 w-4 mr-2" />
                      Escrever Nova Redação
                    </Button>
                  </Link>
                  
                  <Link href="/simulado">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Fazer Simulado
                    </Button>
                  </Link>
                  
                  <Link href="/biblioteca">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Biblioteca Nota 1000
                    </Button>
                  </Link>
                  
                  <Link href="/mentor">
                    <Button className="w-full justify-start" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat com Mentor IA
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRedacoes.map((redacao) => (
                    <div key={redacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{redacao.tema}</p>
                          <p className="text-sm text-gray-500">{formatDate(redacao.createdAt)}</p>
                        </div>
                      </div>
                      <Badge className={getGradeColor(redacao.notaTotal)}>
                        {formatScore(redacao.notaTotal)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redacao">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Redação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatScore(stats.mediaNotas)}
                    </div>
                    <p className="text-gray-600">Média das suas redações</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total de redações</span>
                      <span className="font-semibold">{stats.totalRedacoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Melhor nota</span>
                      <span className="font-semibold text-green-600">
                        {formatScore(Math.max(...recentRedacoes.map(r => r.notaTotal)))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/redacao">
                    <Button className="w-full">
                      <PenTool className="h-4 w-4 mr-2" />
                      Escrever Nova Redação
                    </Button>
                  </Link>
                  
                  <Link href="/biblioteca">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Redações Nota 1000
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulados">
            <Card>
              <CardHeader>
                <CardTitle>Simulados Disponíveis</CardTitle>
                <CardDescription>Pratique com questões preditivas do ENEM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { area: 'Linguagens', icon: BookOpen, color: 'purple' },
                    { area: 'Matemática', icon: Target, color: 'blue' },
                    { area: 'Humanas', icon: Users, color: 'green' },
                    { area: 'Natureza', icon: Brain, color: 'orange' }
                  ].map((item) => (
                    <Link key={item.area} href={`/simulado?area=${item.area.toLowerCase()}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <item.icon className={`h-8 w-8 mx-auto mb-3 text-${item.color}-600`} />
                          <h3 className="font-semibold mb-2">{item.area}</h3>
                          <p className="text-sm text-gray-600">45 questões</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plano">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Seu Plano de Estudos</span>
                </CardTitle>
                <CardDescription>
                  Progresso: {plano.progresso}% - Meta semanal: {plano.metaSemanal}h
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={plano.progresso} className="h-3" />
                
                <div className="space-y-3">
                  {plano.plano.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.concluido ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium">{item.titulo}</p>
                          <p className="text-sm text-gray-500">{item.area} • {item.estimativaHoras}h</p>
                        </div>
                      </div>
                      <Badge variant={item.concluido ? 'default' : 'secondary'}>
                        {item.concluido ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}