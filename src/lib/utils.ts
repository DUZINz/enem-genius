import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

export function calculateGrade(competencias: { nota: number; peso: number }[]): number {
  const totalPeso = competencias.reduce((sum, c) => sum + c.peso, 0)
  const notaPonderada = competencias.reduce((sum, c) => sum + (c.nota * c.peso), 0)
  return Math.round((notaPonderada / totalPeso) * 10) / 10
}

export function getGradeColor(nota: number): string {
  if (nota >= 900) return "text-green-600"
  if (nota >= 700) return "text-blue-600"
  if (nota >= 500) return "text-yellow-600"
  if (nota >= 300) return "text-orange-600"
  return "text-red-600"
}

export function getGradeBadgeColor(nota: number): string {
  if (nota >= 900) return "bg-green-100 text-green-800 border-green-200"
  if (nota >= 700) return "bg-blue-100 text-blue-800 border-blue-200"
  if (nota >= 500) return "bg-yellow-100 text-yellow-800 border-yellow-200"
  if (nota >= 300) return "bg-orange-100 text-orange-800 border-orange-200"
  return "bg-red-100 text-red-800 border-red-200"
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function calculateStudyProgress(
  completedItems: number,
  totalItems: number
): number {
  if (totalItems === 0) return 0
  return Math.round((completedItems / totalItems) * 100)
}

export function getAreaColor(area: string): string {
  const colors: Record<string, string> = {
    linguagens: 'bg-purple-100 text-purple-800 border-purple-200',
    matematica: 'bg-blue-100 text-blue-800 border-blue-200',
    humanas: 'bg-green-100 text-green-800 border-green-200',
    natureza: 'bg-orange-100 text-orange-800 border-orange-200',
    redacao: 'bg-pink-100 text-pink-800 border-pink-200'
  }
  return colors[area] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function formatScore(score: number): string {
  return score.toFixed(1).replace('.', ',')
}

export function parseScore(scoreString: string): number {
  return parseFloat(scoreString.replace(',', '.'))
}