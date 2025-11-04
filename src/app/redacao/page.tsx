'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, FileText, BookOpen, Trophy } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📝 Correção de Redação</h1>
        <p className="text-muted-foreground">
          Pratique redação do ENEM com correção inteligente por IA
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tema da Redação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGerarTema}
            disabled={carregandoTema}
            className="w-full"
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
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-lg">{tema}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {tema && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sua Redação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={redacao}
              onChange={(e) => setRedacao(e.target.value)}
              placeholder="Escreva sua redação aqui (mínimo 200 caracteres)..."
              className="min-h-[400px] font-mono"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {redacao.length} caracteres
              </span>

              <Button
                onClick={handleEnviar}
                disabled={enviando || !redacao || redacao.length < 200}
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

      {resultado && (
        <Card id="resultado" className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Resultado da Correção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Nota Final</div>
              <div className="text-5xl font-bold">{resultado.notaFinal}</div>
              <div className="text-sm text-muted-foreground mt-2">/1000</div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">📊 Competências</h3>
              <div className="space-y-3">
                {resultado.competencias.map((comp: any, idx: number) => (
                  <div key={idx} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Competência {idx + 1}</span>
                      <span className="font-bold">{comp.nota}/200</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comp.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-green-600">✅ Pontos Fortes</h3>
              <ul className="space-y-2">
                {resultado.pontosFortes.map((ponto: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span className="text-sm">{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-orange-600">⚠️ Pontos a Melhorar</h3>
              <ul className="space-y-2">
                {resultado.pontosAMelhorar.map((ponto: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span className="text-sm">{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">💡 Sugestões de Melhoria</h3>
              <ul className="space-y-2">
                {resultado.sugestoes.map((sugestao: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span className="text-sm">{sugestao}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                setTema('')
                setRedacao('')
                setResultado(null)
              }}
              variant="outline"
              className="w-full"
            >
              Fazer Nova Redação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
