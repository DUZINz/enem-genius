'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [etapa, setEtapa] = useState<'form' | 'verificando' | 'criando'>('form')

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    // Validações
    if (!email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)
    setEtapa('verificando')

    try {
      console.log('🔍 Verificando comprador:', email)

      // ETAPA 1: Verificar se o email está na lista de compradores
      const responseVerificar = await fetch('/api/verificar-comprador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const dataVerificar = await responseVerificar.json()
      console.log('📊 Resposta verificação:', dataVerificar)

      if (!responseVerificar.ok || !dataVerificar.autorizado) {
        setErro(dataVerificar.mensagem || 'Email não encontrado na base de compradores.')
        setEtapa('form')
        setLoading(false)
        return
      }

      // Verificar se já criou conta
      if (dataVerificar.contaCriada) {
        setErro('Você já criou sua conta! Use a página de Login.')
        setEtapa('form')
        setLoading(false)
        return
      }

      setEtapa('criando')
      console.log('✅ Comprador autorizado! Criando conta...')

      // ETAPA 2: Criar conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user
      console.log('✅ Conta criada no Auth:', user.uid)

      // ETAPA 3: Criar documento do usuário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        nome: dataVerificar.nomeComprador || 'Novo Aluno',
        plano: 'vitalicio',
        valorPago: dataVerificar.valorPago || 97,
        dataCadastro: serverTimestamp(),
        uid: user.uid,
        xp: 0,
        nivel: 1,
        totalRedacoes: 0,
        totalSimulados: 0,
        totalQuestoes: 0,
      })
      console.log('✅ Documento do usuário criado')

      // ETAPA 4: Marcar como conta criada em compradores_autorizados
      const responseMarcar = await fetch('/api/marcar-conta-criada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (responseMarcar.ok) {
        console.log('✅ Marcado como conta criada')
      } else {
        console.warn('⚠️ Não conseguiu marcar como conta criada, mas seguindo...')
      }

      // Redirecionar para biblioteca
      console.log('✅ Cadastro completo! Redirecionando...')
      router.push('/biblioteca')
      
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error)
      
      let mensagemErro = 'Erro ao criar conta. Tente novamente.'
      
      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = 'Este email já está em uso. Faça login na página de Login.'
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = 'Email inválido.'
      } else if (error.code === 'auth/weak-password') {
        mensagemErro = 'Senha muito fraca. Use no mínimo 6 caracteres.'
      }
      
      setErro(mensagemErro)
      setEtapa('form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-600">
              ENEM Genius - Sua jornada começa aqui! 🚀
            </p>
          </div>

          {/* ALERTAS DE PROGRESSO */}
          {etapa === 'verificando' && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Verificando sua compra...
              </AlertDescription>
            </Alert>
          )}

          {etapa === 'criando' && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Compra verificada! Criando sua conta...
              </AlertDescription>
            </Alert>
          )}

          {/* ERRO */}
          {erro && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email da Compra *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="seu@email.com"
                disabled={loading}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                ℹ️ Use o email que você usou na compra
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
                disabled={loading}
                required
                minLength={6}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••"
                disabled={loading}
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {etapa === 'verificando' ? 'Verificando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          {/* RODAPÉ */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Fazer Login
              </a>
            </p>
          </div>

          {/* INFO ADICIONAL */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 Seus dados estão protegidos. Ao criar sua conta, você terá acesso vitalício à plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}