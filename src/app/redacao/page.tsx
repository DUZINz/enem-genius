'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  Camera, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  PenTool,
  Brain,
  ArrowLeft,
  Download,
  Eye,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { mockCompetencias, aiPromptTemplates } from '@/lib/mock-data'
import { formatScore, getGradeColor, calculateGrade } from '@/lib/utils'

interface RedacaoResult {
  notaTotal: number
  competencias: typeof mockCompetencias
  textoRevisado: string
  feedback: string
  dicasRepertorio: string[]
  tagEstilo: string
}

export default function RedacaoPage() {
  const [activeTab, setActiveTab] = useState('escrever')
  const [texto, setTexto] = useState('')
  const [tema, setTema] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [result, setResult] = useState<RedacaoResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Simulação de OCR
  const processOCR = async (file: File) => {
    setOcrProcessing(true)
    // Simular processamento OCR
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockOCRText = `A democratização do acesso ao cinema no Brasil

O cinema, considerado a sétima arte, desempenha um papel fundamental na formação cultural e social dos indivíduos. No Brasil, entretanto, o acesso a essa forma de expressão artística ainda enfrenta diversos obstáculos que impedem sua plena democratização. Nesse contexto, é necessário analisar os fatores que limitam o acesso ao cinema no país e propor soluções eficazes para superar essas barreiras.

Em primeiro lugar, a concentração geográfica das salas de cinema constitui um dos principais entraves à democratização do acesso. Segundo dados do Instituto Brasileiro de Geografia e Estatística, a maioria dos cinemas está localizada em grandes centros urbanos e regiões metropolitanas, deixando vastas áreas do interior do país sem acesso a essa forma de entretenimento cultural. Essa desigualdade regional reflete as disparidades socioeconômicas existentes no Brasil e contribui para a perpetuação das diferenças culturais entre as diferentes regiões.

Além disso, o alto custo dos ingressos representa outro obstáculo significativo. Para uma parcela considerável da população brasileira, o preço de um ingresso de cinema equivale a uma porcentagem substancial da renda familiar, tornando essa atividade cultural inacessível. Essa situação é agravada pela falta de políticas públicas efetivas que promovam o acesso democrático ao cinema, especialmente para as camadas mais vulneráveis da sociedade.

Diante desse cenário, é fundamental que o poder público implemente medidas concretas para democratizar o acesso ao cinema no Brasil. Uma proposta viável seria a criação de um programa nacional de cinemas itinerantes, que levaria sessões cinematográficas a municípios que não possuem salas de exibição. Essa iniciativa, coordenada pelo Ministério da Cultura em parceria com prefeituras locais, utilizaria equipamentos móveis para exibir filmes em praças, escolas e centros comunitários, garantindo que populações rurais e de pequenas cidades tenham acesso à produção cinematográfica nacional e internacional.

Portanto, a democratização do acesso ao cinema no Brasil requer ações coordenadas que abordem tanto a questão geográfica quanto a econômica. Somente através de políticas públicas efetivas e do comprometimento de diferentes esferas governamentais será possível garantir que o cinema cumpra seu papel como instrumento de formação cultural e social para todos os brasileiros.`
    
    setTexto(mockOCRText)
    setTema('A democratização do acesso ao cinema no Brasil')
    setOcrProcessing(false)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      processOCR(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  // Simulação de correção por IA
  const corrigirRedacao = async () => {
    if (!texto.trim()) return

    setIsProcessing(true)
    
    // Simular processamento da IA
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    const mockResult: RedacaoResult = {
      notaTotal: calculateGrade(mockCompetencias) * 100,
      competencias: mockCompetencias,
      textoRevisado: texto.replace(
        'entretanto',
        '[SUGESTÃO: contudo] entretanto'
      ).replace(
        'Nesse contexto',
        '[SUGESTÃO: Diante disso] Nesse contexto'
      ),
      feedback: 'Excelente redação! Sua argumentação está bem estruturada e você demonstra domínio das competências avaliadas. Pontos fortes: organização textual clara, uso adequado de conectivos e proposta de intervenção viável. Para melhorar ainda mais, considere diversificar seu repertório sociocultural com mais referências de diferentes áreas do conhecimento.',
      dicasRepertorio: [
        'Cite dados do ANCINE sobre distribuição de cinemas',
        'Mencione o conceito de "desertos culturais"',
        'Referencie a Lei de Incentivo à Cultura (Lei Rouanet)',
        'Inclua exemplos de políticas públicas culturais de outros países'
      ],
      tagEstilo: 'dissertativo-argumentativo'
    }
    
    setResult(mockResult)
    setIsProcessing(false)
    setActiveTab('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
                <PenTool className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Editor de Redação</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Correção por IA</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="escrever">Escrever</TabsTrigger>
            <TabsTrigger value="upload">Upload/OCR</TabsTrigger>
            <TabsTrigger value="resultado" disabled={!result}>Resultado</TabsTrigger>
          </TabsList>

          <TabsContent value="escrever" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Redação</CardTitle>
                <CardDescription>
                  Escreva sua redação seguindo o modelo dissertativo-argumentativo do ENEM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema da Redação</Label>
                  <Input
                    id="tema"
                    placeholder="Ex: A democratização do acesso ao cinema no Brasil"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="texto">Sua Redação</Label>
                  <Textarea
                    id="texto"
                    placeholder="Comece escrevendo sua redação aqui..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    className="min-h-[400px] font-mono text-sm leading-relaxed"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{texto.length} caracteres</span>
                    <span>~{Math.round(texto.split(' ').length)} palavras</span>
                  </div>
                </div>

                <Button 
                  onClick={corrigirRedacao}
                  disabled={!texto.trim() || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Corrigindo com IA...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Corrigir Redação
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Redação Manuscrita</CardTitle>
                <CardDescription>
                  Envie uma foto da sua redação para conversão automática via OCR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {ocrProcessing ? (
                    <div className="space-y-4">
                      <Loader2 className="h-12 w-12 mx-auto text-purple-600 animate-spin" />
                      <div>
                        <p className="text-lg font-medium">Processando imagem...</p>
                        <p className="text-gray-600">Convertendo texto manuscrito</p>
                      </div>
                      <Progress value={66} className="w-full max-w-xs mx-auto" />
                    </div>
                  ) : uploadedImage ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                      <div>
                        <p className="text-lg font-medium text-green-700">Imagem processada!</p>
                        <p className="text-gray-600">Texto extraído com sucesso</p>
                      </div>
                      <img 
                        src={uploadedImage} 
                        alt="Redação enviada" 
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
                        </p>
                        <p className="text-gray-600">PNG, JPG até 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {uploadedImage && !ocrProcessing && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Texto extraído com sucesso! Vá para a aba "Escrever" para revisar e corrigir.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resultado" className="space-y-6">
            {result && (
              <>
                {/* Nota Geral */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl font-bold text-blue-600">
                        {formatScore(result.notaTotal)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-800">Nota Final</p>
                        <Badge className={getGradeColor(result.notaTotal)} variant="secondary">
                          {result.tagEstilo}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Competências */}
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliação por Competências</CardTitle>
                    <CardDescription>
                      Análise detalhada segundo os critérios do ENEM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.competencias.map((comp) => (
                      <div key={comp.id} className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              Competência {comp.id}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {comp.nome}
                            </p>
                          </div>
                          <Badge className={getGradeColor(comp.nota)}>
                            {comp.nota}/200
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm">{comp.feedback}</p>
                          {comp.trechosExemplos.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-700 mb-2">
                                Exemplos identificados:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {comp.trechosExemplos.map((exemplo, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {exemplo}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Feedback Geral */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <span>Feedback Detalhado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">{result.feedback}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Dicas de Repertório Sociocultural</h4>
                      <ul className="space-y-2">
                        {result.dicasRepertorio.map((dica, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{dica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Texto Revisado */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      <span>Versão Revisada</span>
                    </CardTitle>
                    <CardDescription>
                      Seu texto com sugestões de melhorias destacadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                        {result.textoRevisado}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setActiveTab('escrever')}>
                    <PenTool className="h-4 w-4 mr-2" />
                    Escrever Nova Redação
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Relatório
                  </Button>
                  
                  <Link href="/biblioteca">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Redações Nota 1000
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}