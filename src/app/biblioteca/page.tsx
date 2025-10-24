'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Search, 
  Star, 
  Eye, 
  ArrowLeft,
  Award,
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { mockRedacoesNota1000, mockCompetencias } from '@/lib/mock-data'
import { formatScore } from '@/lib/utils'

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('todos')
  const [selectedRedacao, setSelectedRedacao] = useState<any>(null)

  // Expandir dados mock para mais redações
  const redacoesNota1000 = [
    ...mockRedacoesNota1000,
    {
      id: '2',
      titulo: 'O estigma associado às doenças mentais no Brasil',
      tema: 'O estigma associado às doenças mentais no Brasil',
      ano: 2020,
      texto: 'A saúde mental, por muito tempo negligenciada na sociedade brasileira, enfrenta hoje um dos seus maiores desafios: o estigma social...',
      analise: {
        estrutura: 'Excelente organização com introdução contextualizada, desenvolvimento coeso e conclusão propositiva.',
        argumentacao: 'Argumentação fundamentada em dados da OMS, exemplos contemporâneos e repertório sociocultural relevante.',
        repertorio: ['Dados da OMS sobre saúde mental', 'Campanha Janeiro Branco', 'Conceito de estigma social de Goffman'],
        pontosFortesEstrutura: ['Contextualização histórica', 'Argumentos bem articulados', 'Proposta detalhada e viável'],
        tecnicasUtilizadas: ['Dados estatísticos', 'Exemplificação contemporânea', 'Analogia', 'Citação de especialista'],
        competencias: mockCompetencias
      },
      tags: ['saude-mental', 'estigma', 'sociedade', 'nota-1000']
    },
    {
      id: '3',
      titulo: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
      tema: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
      ano: 2018,
      texto: 'A era digital trouxe consigo inúmeras facilidades para a vida cotidiana, mas também novos desafios relacionados à privacidade e manipulação de dados...',
      analise: {
        estrutura: 'Estrutura impecável com progressão lógica e coerência entre os parágrafos.',
        argumentacao: 'Argumentação sólida baseada em casos reais, legislação e teorias sociológicas.',
        repertorio: ['Lei Geral de Proteção de Dados', 'Caso Cambridge Analytica', 'Teoria da Sociedade do Espetáculo'],
        pontosFortesEstrutura: ['Tese bem delimitada', 'Desenvolvimento equilibrado', 'Intervenção específica e detalhada'],
        tecnicasUtilizadas: ['Exemplificação factual', 'Comparação internacional', 'Causa e consequência', 'Proposta legislativa'],
        competencias: mockCompetencias
      },
      tags: ['tecnologia', 'privacidade', 'dados', 'nota-1000']
    },
    {
      id: '4',
      titulo: 'Desafios para a formação educacional de surdos no Brasil',
      tema: 'Desafios para a formação educacional de surdos no Brasil',
      ano: 2017,
      texto: 'A inclusão educacional de pessoas surdas no Brasil representa um desafio complexo que envolve aspectos linguísticos, pedagógicos e sociais...',
      analise: {
        estrutura: 'Organização textual exemplar com introdução problematizadora e desenvolvimento bem articulado.',
        argumentacao: 'Argumentação consistente com base em legislação, dados educacionais e teorias inclusivas.',
        repertorio: ['Lei Brasileira de Inclusão', 'LIBRAS como segunda língua oficial', 'Pedagogia inclusiva de Mantoan'],
        pontosFortesEstrutura: ['Problematização eficaz', 'Argumentos complementares', 'Proposta abrangente'],
        tecnicasUtilizadas: ['Contextualização legal', 'Dados educacionais', 'Exemplificação prática', 'Proposta multi-setorial'],
        competencias: mockCompetencias
      },
      tags: ['educacao', 'inclusao', 'surdos', 'nota-1000']
    }
  ]

  const filteredRedacoes = redacoesNota1000.filter(redacao => {
    const matchesSearch = redacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         redacao.tema.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === 'todos' || redacao.ano.toString() === selectedYear
    return matchesSearch && matchesYear
  })

  const years = ['todos', ...Array.from(new Set(redacoesNota1000.map(r => r.ano.toString()))).sort().reverse()]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
                <BookOpen className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Biblioteca Nota 1000
                </h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Award className="h-4 w-4 mr-1" />
              {redacoesNota1000.length} Redações Exemplares
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Redações Nota 1000 📚
          </h2>
          <p className="text-gray-600 text-lg">
            Estude redações que alcançaram a nota máxima no ENEM. Analise estruturas, argumentos e técnicas que levaram ao sucesso.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por tema ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year === 'todos' ? 'Todos os anos' : year}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRedacoes.map((redacao) => (
            <Card key={redacao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {redacao.ano}
                  </Badge>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">1000</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {redacao.titulo}
                </CardTitle>
                <CardDescription>
                  {redacao.tema}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {redacao.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedRedacao(redacao)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Analisar Estrutura
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span>{redacao.titulo}</span>
                        </DialogTitle>
                        <DialogDescription>
                          ENEM {redacao.ano} • Nota: 1000/1000
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="texto" className="mt-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="texto">Texto</TabsTrigger>
                          <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
                          <TabsTrigger value="competencias">Competências</TabsTrigger>
                          <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="texto" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Texto Completo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {redacao.texto}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="estrutura" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                <span>Análise Estrutural</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-green-700 mb-2">Organização Textual</h4>
                                <p className="text-gray-700">{redacao.analise.estrutura}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-blue-700 mb-2">Qualidade da Argumentação</h4>
                                <p className="text-gray-700">{redacao.analise.argumentacao}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-purple-700 mb-2">Pontos Fortes da Estrutura</h4>
                                <ul className="space-y-1">
                                  {redacao.analise.pontosFortesEstrutura.map((ponto, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-gray-700">{ponto}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="competencias" className="space-y-4">
                          <div className="grid gap-4">
                            {redacao.analise.competencias.map((comp) => (
                              <Card key={comp.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm">Competência {comp.id}</h4>
                                    <Badge className="bg-green-100 text-green-800">
                                      {formatScore(comp.nota)}/200
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{comp.nome}</p>
                                  <p className="text-sm text-gray-700">{comp.feedback}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="tecnicas" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Lightbulb className="h-5 w-5 text-yellow-600" />
                                <span>Técnicas e Repertório</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-blue-700 mb-2">Técnicas Utilizadas</h4>
                                <div className="flex flex-wrap gap-2">
                                  {redacao.analise.tecnicasUtilizadas.map((tecnica, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                      {tecnica}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-purple-700 mb-2">Repertório Sociocultural</h4>
                                <ul className="space-y-2">
                                  {redacao.analise.repertorio.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4 text-purple-500" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRedacoes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma redação encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca para encontrar redações.
            </p>
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Como usar a Biblioteca</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">📖 Estude a Estrutura</h4>
                <p className="text-gray-700 text-sm">
                  Analise como cada redação está organizada: introdução, desenvolvimento e conclusão. 
                  Observe a progressão dos argumentos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-2">🎯 Foque no Repertório</h4>
                <p className="text-gray-700 text-sm">
                  Veja quais referências culturais, dados e exemplos foram utilizados. 
                  Crie seu próprio banco de repertório.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-700 mb-2">✍️ Pratique as Técnicas</h4>
                <p className="text-gray-700 text-sm">
                  Identifique as técnicas argumentativas usadas e pratique aplicá-las 
                  em suas próprias redações.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">🔍 Compare Competências</h4>
                <p className="text-gray-700 text-sm">
                  Veja como cada competência foi desenvolvida e compare com suas redações 
                  para identificar pontos de melhoria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}