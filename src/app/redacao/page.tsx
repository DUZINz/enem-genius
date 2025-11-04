'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, FileText, BookOpen, Trophy, Home, Target, BookMarked, Brain } from 'lucide-react'
import Link from 'next/link'

export default function RedacaoPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [tema, setTema] = useState('')
  const [redacao, setRedacao] = useState('')
  const [carregandoTema, setCarregandoTema] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleGerarTema = async () => {
    setCarregandoTema(true)
    setResultado(null)

    try {
      const response = await fetch('/api/redacao/gerar-tema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('Erro ao gerar tema')

      const data = await response.json()
      setTema(data.tema)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar tema. Tente novamente.')
    } finally {
      setCarregandoTema(false)
    }
  }

  const handleEnviar = async () => {
    if (!tema || !redacao) {
      alert('Gere um tema e escreva sua redação primeiro!')
      return
    }

    if (redacao.length < 200) {
      alert('Sua redação deve ter pelo menos 200 caracteres.')
      return
    }

    setEnviando(true)

    try {
      const response = await fetch('/api/redacao/corrigir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema,
          texto: redacao,
          userId: user.uid
        })
      })

      if (!response.ok) throw new Error('Erro ao corrigir')

      const data = await response.json()
      setResultado(data.correcao)
      
      setTimeout(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao corrigir redação. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header com Menu */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/biblioteca" className="text-white hover:text-purple-300 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            
            <h1 className="text-2xl font-bold text-white">📝 Correção de Redação</h1>
            
            <div className="flex gap-2">
              <Link href="/simulado">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Target className="h-4 w-4 mr-2" />
                  Simulados
                </Button>
              </Link>
              <Link href="/mentor">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Brain className="h-4 w-4 mr-2" />
                  Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-white/80 text-lg">
            Pratique redação do ENEM com correção inteligente por IA
          </p>
        </div>

        {/* Gerar Tema */}
        <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5" />
              Tema da Redação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGerarTema}
              disabled={carregandoTema}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              size="lg"
            >
              {carregandoTema ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando tema...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Novo Tema
                </>
              )}
            </Button>

            {tema && (
              <div className="p-4 bg-white/10 backdrop-blur rounded-lg border border-white/20">
                <p className="font-semibold text-lg text-white">{tema}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Escrever Redação */}
        {tema && (
          <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Sua Redação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={redacao}
                onChange={(e) => setRedacao(e.target.value)}
                placeholder="Escreva sua redação aqui (mínimo 200 caracteres)..."
                className="min-h-[400px] font-mono bg-white/5 text-white border-white/20 focus:border-purple-400"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  {redacao.length} caracteres
                </span>

                <Button
                  onClick={handleEnviar}
                  disabled={enviando || !redacao || redacao.length < 200}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  size="lg"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Corrigindo...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar para Correção
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultado */}
        {resultado && (
          <Card id="resultado" className="border-2 border-yellow-400 bg-white/10 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Resultado da Correção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nota Final */}
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                <div className="text-sm text-white/70 mb-2">Nota Final</div>
                <div className="text-5xl font-bold text-yellow-400">{resultado.notaFinal}</div>
                <div className="text-sm text-white/70 mt-2">/1000</div>
              </div>

              {/* Competências */}
              <div>
                <h3 className="font-semibold mb-3 text-white">📊 Competências</h3>
                <div className="space-y-3">
                  {resultado.competencias.map((comp: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">Competência {idx + 1}</span>
                        <span className="font-bold text-yellow-400">{comp.nota}/200</span>
                      </div>
                      <p className="text-sm text-white/70">{comp.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pontos Fortes */}
              <div>
                <h3 className="font-semibold mb-3 text-green-400">✅ Pontos Fortes</h3>
                <ul className="space-y-2">
                  {resultado.pontosFortes.map((ponto: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <span className="text-green-400">•</span>
                      <span className="text-sm">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pontos a Melhorar */}
              <div>
                <h3 className="font-semibold mb-3 text-orange-400">⚠️ Pontos a Melhorar</h3>
                <ul className="space-y-2">
                  {resultado.pontosAMelhorar.map((ponto: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <span className="text-orange-400">•</span>
                      <span className="text-sm">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sugestões */}
              <div>
                <h3 className="font-semibold mb-3 text-blue-400">💡 Sugestões de Melhoria</h3>
                <ul className="space-y-2">
                  {resultado.sugestoes.map((sugestao: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <span>•</span>
                      <span className="text-sm">{sugestao}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nova Redação */}
              <Button
                onClick={() => {
                  setTema('')
                  setRedacao('')
                  setResultado(null)
                }}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Fazer Nova Redação
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Biblioteca de Redações */}
        <div className="mt-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookMarked className="h-5 w-5" />
                Biblioteca de Redações Nota 1000
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {['Meio Ambiente', 'Tecnologia', 'Educação', 'Saúde Pública', 'Desigualdade Social', 'Mobilidade Urbana'].map((tema, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-white mb-2">{tema}</h4>
                    <p className="text-sm text-white/70">Exemplo de redação nota 1000</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
