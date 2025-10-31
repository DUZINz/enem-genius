import { useState } from 'react'
import type { SimuladoGerado, RespostaAluno, CorrecaoSimulado } from '@/lib/types/simulado'

export function useSimulado() {
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState('')

  const gerarSimulado = async (areas?: string[], quantidade?: number): Promise<SimuladoGerado | null> => {
    setIsLoading(true)
    setErro('')

    try {
      const response = await fetch('/api/simulado/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areas, quantidade })
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar simulado')
      }

      const simulado = await response.json()
      return simulado

    } catch (error: any) {
      setErro(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const corrigirSimulado = async (
    questoes: any[],
    respostas: RespostaAluno[]
  ): Promise<CorrecaoSimulado | null> => {
    setIsLoading(true)
    setErro('')

    try {
      const response = await fetch('/api/simulado/corrigir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questoes, respostas })
      })

      if (!response.ok) {
        throw new Error('Erro ao corrigir simulado')
      }

      const correcao = await response.json()
      return correcao

    } catch (error: any) {
      setErro(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    gerarSimulado,
    corrigirSimulado,
    isLoading,
    erro
  }
}