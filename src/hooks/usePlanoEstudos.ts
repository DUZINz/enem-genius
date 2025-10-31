import { useState } from 'react'
import type { PlanoEstudos, PerfilAluno } from '@/lib/types/plano-estudos'

export function usePlanoEstudos() {
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState('')

  const gerarPlano = async (perfil: PerfilAluno): Promise<PlanoEstudos | null> => {
    setIsLoading(true)
    setErro('')

    try {
      const response = await fetch('/api/plano-estudos/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil)
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar plano')
      }

      const plano = await response.json()
      return plano

    } catch (error: any) {
      setErro(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const atualizarProgresso = async (
    planoId: string,
    atividadeId: string,
    concluida: boolean,
    notaObtida?: number
  ) => {
    setIsLoading(true)
    setErro('')

    try {
      const response = await fetch('/api/plano-estudos/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planoId, atividadeId, concluida, notaObtida })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar progresso')
      }

      const resultado = await response.json()
      return resultado

    } catch (error: any) {
      setErro(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    gerarPlano,
    atualizarProgresso,
    isLoading,
    erro
  }
}