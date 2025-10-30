'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DadosEvolucao {
  data: string
  nota_total: number
  competencias: {
    [key: string]: number
  }
}

interface GraficoEvolucaoProps {
  dados: DadosEvolucao[]
}

export function GraficoEvolucao({ dados }: GraficoEvolucaoProps) {
  const getNotaColor = (nota: number) => {
    if (nota >= 160) return 'text-green-600 bg-green-50'
    if (nota >= 120) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getTendencia = () => {
    if (dados.length < 2) return null
    
    const ultimaNota = dados[dados.length - 1].nota_total
    const penultimaNota = dados[dados.length - 2].nota_total
    const diferenca = ultimaNota - penultimaNota
    
    if (diferenca > 0) return { tipo: 'subiu', valor: diferenca, cor: 'text-green-600' }
    if (diferenca < 0) return { tipo: 'desceu', valor: Math.abs(diferenca), cor: 'text-red-600' }
    return { tipo: 'manteve', valor: 0, cor: 'text-gray-600' }
  }

  const tendencia = getTendencia()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📈 Evolução das Notas</span>
          {tendencia && (
            <Badge variant="outline" className={tendencia.cor}>
              {tendencia.tipo === 'subiu' && `↗ +${tendencia.valor} pts`}
              {tendencia.tipo === 'desceu' && `↘ -${tendencia.valor} pts`}
              {tendencia.tipo === 'manteve' && '→ Manteve'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma redação corrigida ainda.</p>
            <p className="text-sm">Envie sua primeira redação para ver sua evolução!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dados.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className={`font-bold text-lg ${getNotaColor(item.nota_total)}`}>
                    {item.nota_total}/1000
                  </div>
                </div>
                <div className="flex space-x-2">
                  {Object.entries(item.competencias).map(([comp, nota]) => (
                    <div key={comp} className="text-center">
                      <div className="text-xs text-gray-500">{comp}</div>
                      <div className={`text-sm font-semibold ${getNotaColor(nota)}`}>
                        {nota}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}