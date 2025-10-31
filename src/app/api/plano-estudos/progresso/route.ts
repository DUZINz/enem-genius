import { NextResponse } from 'next/server'
import type { PlanoEstudos, Badge } from '@/lib/types/plano-estudos'

export async function POST(request: Request) {
  try {
    const { planoId, atividadeId, concluida, notaObtida } = await request.json()

    // Aqui você buscaria o plano do banco de dados
    // Por ora, vamos simular
    
    // Calcular XP baseado na atividade
    const xpGanho = calcularXP(concluida, notaObtida)
    
    // Verificar badges conquistados
    const novosBadges = verificarBadges({
      atividadesConcluidas: 10, // Exemplo
      streak: 7,
      horasEstudadas: 50
    })

    const progressoAtualizado = {
      xpGanho,
      novosBadges,
      nivelAtual: calcularNivel(1000), // XP total do usuário
      mensagem: concluida 
        ? `🎉 Atividade concluída! +${xpGanho} XP` 
        : '⏸️ Atividade pausada'
    }

    return NextResponse.json(progressoAtualizado)

  } catch (error: any) {
    console.error('💥 ERRO:', error?.message)
    return NextResponse.json(
      { error: 'Erro ao atualizar progresso' },
      { status: 500 }
    )
  }
}

function calcularXP(concluida: boolean, nota?: number): number {
  if (!concluida) return 0
  
  let xp = 50 // XP base
  
  if (nota) {
    if (nota >= 90) xp += 50
    else if (nota >= 70) xp += 30
    else if (nota >= 50) xp += 10
  }
  
  return xp
}

function calcularNivel(xpTotal: number): number {
  // Nível 1: 0-100 XP
  // Nível 2: 100-300 XP
  // Nível 3: 300-600 XP
  // etc...
  const niveis = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500]
  
  for (let i = niveis.length - 1; i >= 0; i--) {
    if (xpTotal >= niveis[i]) {
      return i + 1
    }
  }
  
  return 1
}

function verificarBadges(stats: any): Badge[] {
  const badges: Badge[] = []
  
  if (stats.streak >= 7) {
    badges.push({
      id: 'streak-7',
      nome: '🔥 Semana de Fogo',
      descricao: '7 dias consecutivos estudando',
      icone: '🔥',
      dataConquista: new Date(),
      xp: 100
    })
  }
  
  if (stats.atividadesConcluidas >= 50) {
    badges.push({
      id: 'atividades-50',
      nome: '🎯 Persistente',
      descricao: '50 atividades concluídas',
      icone: '🎯',
      dataConquista: new Date(),
      xp: 150
    })
  }
  
  if (stats.horasEstudadas >= 100) {
    badges.push({
      id: 'horas-100',
      nome: '⏰ Dedicação Total',
      descricao: '100 horas de estudo',
      icone: '⏰',
      dataConquista: new Date(),
      xp: 200
    })
  }
  
  return badges
}