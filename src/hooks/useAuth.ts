import { useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface UserProfile {
  uid: string
  email: string
  nome: string
  dataCriacao: string
  stats: {
    mediaGeral: number
    totalRedacoes: number
    totalSimulados: number
    horasEstudadas: number
    streak: number
    nivel: number
    xpTotal: number
    atividadesConcluidas: number
    porcentagemGeral: number
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState('')
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 Iniciando listener de autenticação...')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Estado de autenticação mudou:', user?.email || 'Não logado')
      setUser(user)
      
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid))
          if (profileDoc.exists()) {
            console.log('✅ Perfil encontrado no Firestore')
            setUserProfile(profileDoc.data() as UserProfile)
          } else {
            console.log('⚠️ Perfil não encontrado no Firestore')
          }
        } catch (error) {
          console.error('❌ Erro ao buscar perfil:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const cadastrar = async (email: string, senha: string, nome: string) => {
    console.log('🚀 Iniciando cadastro...')
    setIsLoading(true)
    setErro('')

    try {
      // Passo 1: Criar usuário no Firebase Auth
      console.log('📝 Criando usuário no Firebase Auth...')
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user
      console.log('✅ Usuário criado no Auth:', user.uid)

      // Passo 2: Criar perfil ZERADO no Firestore
      console.log('💾 Salvando perfil ZERADO no Firestore...')
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        nome,
        dataCriacao: new Date().toISOString(),
        stats: {
          mediaGeral: 0,
          totalRedacoes: 0,
          totalSimulados: 0,
          horasEstudadas: 0,
          streak: 0,
          nivel: 1,
          xpTotal: 0,
          atividadesConcluidas: 0,
          porcentagemGeral: 0
        }
      }

      await setDoc(doc(db, 'users', user.uid), userProfile)
      console.log('✅ Perfil ZERADO salvo no Firestore')
      
      setUserProfile(userProfile)

      // ❌ REMOVIDO: Não migrar dados antigos do localStorage
      // O usuário sempre começa do zero!

      console.log('🎉 Cadastro concluído com sucesso! Dados zerados.')
      router.push('/')
      return { success: true }

    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error)
      console.error('Código do erro:', error.code)
      console.error('Mensagem:', error.message)
      
      let mensagemErro = 'Erro ao cadastrar'
      
      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = 'Este email já está cadastrado'
      } else if (error.code === 'auth/weak-password') {
        mensagemErro = 'Senha muito fraca. Use pelo menos 6 caracteres'
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = 'Email inválido'
      } else if (error.code === 'permission-denied') {
        mensagemErro = 'Permissão negada. Verifique as regras do Firestore'
      } else {
        mensagemErro = `Erro: ${error.message}`
      }

      setErro(mensagemErro)
      return { success: false, erro: mensagemErro }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, senha: string) => {
    console.log('🔑 Tentando fazer login...')
    setIsLoading(true)
    setErro('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user
      console.log('✅ Login bem-sucedido:', user.email)

      // Buscar perfil salvo no Firebase
      const profileDoc = await getDoc(doc(db, 'users', user.uid))
      if (profileDoc.exists()) {
        const profile = profileDoc.data() as UserProfile
        setUserProfile(profile)
        console.log('✅ Perfil carregado do Firebase:', profile.stats)
      } else {
        console.log('⚠️ Perfil não encontrado. Criando perfil zerado...')
        // Se não encontrar perfil, criar um zerado
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          nome: user.email!.split('@')[0],
          dataCriacao: new Date().toISOString(),
          stats: {
            mediaGeral: 0,
            totalRedacoes: 0,
            totalSimulados: 0,
            horasEstudadas: 0,
            streak: 0,
            nivel: 1,
            xpTotal: 0,
            atividadesConcluidas: 0,
            porcentagemGeral: 0
          }
        }
        await setDoc(doc(db, 'users', user.uid), newProfile)
        setUserProfile(newProfile)
      }

      router.push('/')
      return { success: true }

    } catch (error: any) {
      console.error('❌ Erro no login:', error.code)
      
      let mensagemErro = 'Erro ao fazer login'
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensagemErro = 'Email ou senha incorretos'
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = 'Email inválido'
      }

      setErro(mensagemErro)
      return { success: false, erro: mensagemErro }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
      router.push('/login')
      console.log('👋 Logout realizado')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const atualizarStats = async (novoStats: UserProfile['stats']) => {
    if (!user) return

    try {
      const updatedProfile = { ...userProfile, stats: novoStats }
      
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true })

      setUserProfile(prev => prev ? { ...prev, stats: novoStats } : null)
      console.log('✅ Stats atualizados no Firebase:', novoStats)
    } catch (error) {
      console.error('❌ Erro ao atualizar stats:', error)
    }
  }

  return {
    user,
    userProfile,
    isLoading,
    erro,
    cadastrar,
    login,
    logout,
    atualizarStats,
    isAuthenticated: !!user
  }
}