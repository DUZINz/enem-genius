import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PerfilEscrita } from '@/lib/types/mentor'
import { GraficoEvolucao } from './GraficoEvolucao'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BookOpen,
  PenTool,
  Target,
  Award,
  Calendar,
  BarChart3,
  User,
  Lightbulb
} from 'lucide-react'

interface PerfilAlunoProps {
  perfil: PerfilEscrita
}

export function PerfilAluno({ perfil }: PerfilAlunoProps) {
  const mediaGeral = Object.values(perfil.media_notas).reduce((a, b) => a + b, 0) / 5
  
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'iniciante': return 'bg-blue-100 text-blue-800'
      case 'intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'avançado': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompetenciaStatus = (nota: number) => {
    if (nota >= 160) return { icon: TrendingUp, color: 'text-green-600', status: 'Boa' }
    if (nota >= 120) return { icon: Minus, color: 'text-yellow-600', status: 'Regular' }
    return { icon: TrendingDown, color: 'text-red-600', status: 'Precisa melhorar' }
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-600" />
            <span>Perfil de Escrita Personalizado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nível Atual</p>
              <Badge className={getNivelColor(perfil.nivel_escrita)}>
                {perfil.nivel_escrita.charAt(0).toUpperCase() + perfil.nivel_escrita.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Média Geral</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(mediaGeral)}<span className="text-sm text-gray-500">/200</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>{perfil.historico_redacoes} redações</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span>Ativo desde {new Date(perfil.ultima_atualizacao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Estilo de Escrita */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1">✍️ Seu Estilo de Escrita</h4>
            <p className="text-sm text-gray-600">{perfil.estilo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para organizar informações */}
      <Tabs defaultValue="competencias" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competencias">Competências</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
        </TabsList>

        {/* Tab: Competências */}
        <TabsContent value="competencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Desempenho por Competência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(perfil.media_notas).map(([competencia, nota]) => {
                const { icon: StatusIcon, color, status } = getCompetenciaStatus(nota)
                const porcentagem = (nota / 200) * 100
                
                return (
                  <div key={competencia} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{competencia}</span>
                        <StatusIcon className={`h-4 w-4 ${color}`} />
                        <Badge variant="outline" className={`text-xs ${color}`}>
                          {status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{nota}</span>
                        <span className="text-sm text-gray-500">/200</span>
                      </div>
                    </div>
                    <Progress value={porcentagem} className="h-2" />
                    <p className="text-xs text-gray-600">{getCompetenciaDescricao(competencia)}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Pontos Fortes e Áreas de Melhoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-700">✅ Pontos Fortes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {perfil.pontos_fortes.map((ponto, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-700">⚠️ Áreas de Melhoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {perfil.erros_mais_frequentes.map((erro, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-sm">{erro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Evolução */}
        <TabsContent value="evolucao">
          <GraficoEvolucao perfil={perfil} />
        </TabsContent>

        {/* Tab: Recomendações */}
        <TabsContent value="recomendacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <span>Recomendações Personalizadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {perfil.recomendacoes_personalizadas.map((recomendacao, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <PenTool className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-800">{recomendacao}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plano de Estudos Personalizado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Plano de Estudos Personalizado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📅 Esta Semana</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Praticar 2 redações focando na competência mais fraca</li>
                    <li>• Ler 3 artigos sobre temas atuais</li>
                    <li>• Revisar conectivos e elementos coesivos</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Próximo Mês</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Alcançar média de 160 pontos em todas as competências</li>
                    <li>• Ampliar repertório sociocultural</li>
                    <li>• Dominar estrutura de proposta de intervenção</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">🏆 Meta Final</h4>
                  <p className="text-sm text-purple-700">
                    Conquistar nota 1000 na redação do ENEM através de prática consistente e feedback personalizado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getCompetenciaDescricao(competencia: string): string {
  const descricoes = {
    C1: 'Demonstrar domínio da modalidade escrita formal da língua portuguesa',
    C2: 'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento',
    C3: 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos',
    C4: 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
    C5: 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos'
  }
  
  return descricoes[competencia as keyof typeof descricoes] || ''
}