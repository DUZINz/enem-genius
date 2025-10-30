import { useState } from 'react'
import { CorrecaoRedacao } from '@/lib/types/mentor'

export function useMentor() {
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const corrigirRedacao = async (texto: string): Promise<CorrecaoRedacao | null> => {
    setIsLoading(true)
    setErro(null)
    
    try {
      const response = await fetch('/api/mentor/redacao-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na correção')
      }

      const correcao = await response.json()
      return correcao
    } catch (error) {
      console.error('Erro ao corrigir redação:', error)
      setErro(error instanceof Error ? error.message : 'Erro desconhecido')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    corrigirRedacao,
    isLoading,
    erro
  }
}