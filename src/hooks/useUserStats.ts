import { useState, useEffect, useCallback } from 'react'

export interface UserStats {
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

const STATS_KEY = 'userStats'

const getInitialStats = (): UserStats => ({
  mediaGeral: 0,
  totalRedacoes: 0,
  totalSimulados: 0,
  horasEstudadas: 0,
  streak: 0,
  nivel: 1,
  xpTotal: 0,
  atividadesConcluidas: 0,
  porcentagemGeral: 0
})

export function useUserStats() {
  const [stats, setStatsState] = useState<UserStats>(getInitialStats())
  const [isLoading, setIsLoading] = useState(true)

  // Carregar stats do localStorage
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    setIsLoading(true)
    try {
      const cached = localStorage.getItem(STATS_KEY)
      if (cached) {
        setStatsState(JSON.parse(cached))
      } else {
        const initial = getInitialStats()
        localStorage.setItem(STATS_KEY, JSON.stringify(initial))
        setStatsState(initial)
      }
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Salvar stats
  const setStats = useCallback((newStats: UserStats | ((prev: UserStats) => UserStats)) => {
    setStatsState(prev => {
      const updated = typeof newStats === 'function' ? newStats(prev) : newStats
      localStorage.setItem(STATS_KEY, JSON.stringify(updated))
      
      // Disparar evento customizado para sincronizar entre abas/páginas
      window.dispatchEvent(new CustomEvent('statsUpdated', { detail: updated }))
      
      return updated
    })
  }, [])

  // 🎯 Atualizar quando completar simulado
  const registrarSimulado = useCallback((nota: number, tempoMinutos: number) => {
    setStats(prev => {
      const novoTotal = prev.totalSimulados + 1
      const novaMediaGeral = prev.totalSimulados === 0 
        ? nota 
        : Math.round((prev.mediaGeral * prev.totalSimulados + nota) / novoTotal)
      
      const xpGanho = Math.round(nota / 10) // 1 XP por 10 pontos
      const novoXP = prev.xpTotal + xpGanho
      const novoNivel = Math.floor(novoXP / 500) + 1
      const horasGastas = tempoMinutos / 60

      return {
        ...prev,
        totalSimulados: novoTotal,
        mediaGeral: novaMediaGeral,
        xpTotal: novoXP,
        nivel: novoNivel,
        horasEstudadas: Math.round((prev.horasEstudadas + horasGastas) * 10) / 10
      }
    })

    return { xpGanho: Math.round(nota / 10) }
  }, [setStats])

  // 📝 Atualizar quando completar redação
  const registrarRedacao = useCallback((nota: number, tempoMinutos: number) => {
    setStats(prev => {
      const xpGanho = Math.round(nota * 0.5) // 0.5 XP por ponto da redação
      const novoXP = prev.xpTotal + xpGanho
      const novoNivel = Math.floor(novoXP / 500) + 1
      const horasGastas = tempoMinutos / 60

      return {
        ...prev,
        totalRedacoes: prev.totalRedacoes + 1,
        xpTotal: novoXP,
        nivel: novoNivel,
        horasEstudadas: Math.round((prev.horasEstudadas + horasGastas) * 10) / 10
      }
    })

    return { xpGanho: Math.round(nota * 0.5) }
  }, [setStats])

  // ✅ Atualizar quando completar atividade
  const registrarAtividade = useCallback((tempoMinutos: number, xpGanho: number) => {
    setStats(prev => {
      const novoXP = prev.xpTotal + xpGanho
      const novoNivel = Math.floor(novoXP / 500) + 1
      const horasGastas = tempoMinutos / 60

      // Verificar streak
      const ultimoEstudo = localStorage.getItem('ultimoEstudo')
      const hoje = new Date().toDateString()
      let novoStreak = prev.streak

      if (ultimoEstudo !== hoje) {
        const ontem = new Date()
        ontem.setDate(ontem.getDate() - 1)
        
        if (ultimoEstudo === ontem.toDateString()) {
          novoStreak += 1
        } else {
          novoStreak = 1
        }
        
        localStorage.setItem('ultimoEstudo', hoje)
      }

      return {
        ...prev,
        atividadesConcluidas: prev.atividadesConcluidas + 1,
        xpTotal: novoXP,
        nivel: novoNivel,
        streak: novoStreak,
        horasEstudadas: Math.round((prev.horasEstudadas + horasGastas) * 10) / 10,
        porcentagemGeral: Math.min(100, prev.porcentagemGeral + 2)
      }
    })

    return { nivelAnterior: stats.nivel }
  }, [setStats, stats.nivel])

  // 🔄 Recarregar stats
  const reloadStats = useCallback(() => {
    loadStats()
  }, [])

  // Escutar mudanças de outras abas/componentes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STATS_KEY && e.newValue) {
        setStatsState(JSON.parse(e.newValue))
      }
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<UserStats>
      setStatsState(customEvent.detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('statsUpdated', handleCustomEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('statsUpdated', handleCustomEvent)
    }
  }, [])

  return {
    stats,
    setStats,
    registrarSimulado,
    registrarRedacao,
    registrarAtividade,
    reloadStats,
    isLoading
  }
}