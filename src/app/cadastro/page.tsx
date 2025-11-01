'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erroLocal, setErroLocal] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
  const { cadastrar, isLoading, erro } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErroLocal('')

    // Validações locais
    if (nome.length < 3) {
      setErroLocal('Nome deve ter pelo menos 3 caracteres')
      return
    }

    if (!email.includes('@')) {
      setErroLocal('Email inválido')
      return
    }

    if (senha.length < 6) {
      setErroLocal('Senha deve ter pelo menos 6 caracteres')
      return
    }

    if (senha !== confirmarSenha) {
      setErroLocal('As senhas não coincidem')
      return
    }

    console.log('🚀 Tentando cadastrar:', { nome, email })
    const resultado = await cadastrar(email, senha, nome)
    
    if (!resultado.success) {
      console.error('❌ Erro no cadastro:', resultado.erro)
    } else {
      console.log('✅ Cadastro realizado com sucesso!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ENEM Genius
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie sua conta gratuitamente
          </p>
        </div>

        {/* Card de Cadastro */}
        <Card>
          <CardHeader>
            <CardTitle>Criar nova conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Senha com Visualizador */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-gray-700 transition-colors"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {senha.length > 0 && senha.length < 6 && (
                  <p className="text-xs text-red-500">
                    Senha muito curta ({senha.length}/6 caracteres)
                  </p>
                )}
              </div>

              {/* Confirmar Senha com Visualizador */}
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-gray-700 transition-colors"
                  >
                    {mostrarConfirmarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmarSenha.length > 0 && senha !== confirmarSenha && (
                  <p className="text-xs text-red-500">
                    As senhas não coincidem
                  </p>
                )}
                {confirmarSenha.length > 0 && senha === confirmarSenha && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Senhas coincidem
                  </p>
                )}
              </div>

              {/* Mensagem de Erro */}
              {(erro || erroLocal) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro || erroLocal}</AlertDescription>
                </Alert>
              )}

              {/* Benefícios */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-blue-900 mb-2">Ao criar sua conta, você ganha:</p>
                <div className="space-y-1">
                  {[
                    'Simulados ilimitados com IA',
                    'Correção de redações personalizada',
                    'Mentor IA 24/7',
                    'Acompanhamento de progresso',
                    'Gamificação com XP e níveis'
                  ].map((beneficio, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-blue-700">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                      <span>{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Cadastro */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading || senha !== confirmarSenha || senha.length < 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta grátis'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Ao criar sua conta, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  )
}