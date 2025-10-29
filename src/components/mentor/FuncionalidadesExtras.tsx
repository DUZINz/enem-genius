import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Mic, 
  MicOff, 
  Trophy, 
  Users, 
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  BookOpen,
  PenTool
} from 'lucide-react'

interface FuncionalidadesExtrasProps {
  onVoiceInput?: (texto: string) => void
}

export function FuncionalidadesExtras({ onVoiceInput }: FuncionalidadesExtrasProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  // Inicializar reconhecimento de voz
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'pt-BR'
      
      recognition.onresult = (event) => {
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        
        if (finalTranscript && onVoiceInput) {
          onVoiceInput(finalTranscript)
        }
      }
      
      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error)
        setIsRecording(false)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognition)
    }
  }

  const toggleRecording = () => {
    if (!recognition) {
      initSpeechRecognition()
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  // Dados simulados para desafios
  const desafioAtual = {
    id: 1,
    titulo: 'Desafio da Semana: Sustentabilidade',
    tema: 'Os desafios da sustentabilidade no Brasil contemporâneo',
    participantes: 1247,
    tempoRestante: '3 dias',
    premio: 'Badge Eco-Warrior + Feedback Premium',
    status: 'ativo' as const
  }

  const ranking = [
    { posicao: 1, nome: 'Ana Silva', pontos: 950, avatar: '👩‍🎓' },
    { posicao: 2, nome: 'Carlos Santos', pontos: 920, avatar: '👨‍🎓' },
    { posicao: 3, nome: 'Maria Oliveira', pontos: 890, avatar: '👩‍💼' },
    { posicao: 4, nome: 'Você', pontos: 850, avatar: '🎯' },
    { posicao: 5, nome: 'João Costa', pontos: 830, avatar: '👨‍💻' }
  ]

  const badges = [
    { nome: 'Primeira Redação', icone: '🎯', conquistado: true },
    { nome: 'Nota 800+', icone: '⭐', conquistado: true },
    { nome: 'Sequência 7 dias', icone: '🔥', conquistado: false },
    { nome: 'Mentor Expert', icone: '🧠', conquistado: false },
    { nome: 'Nota 1000', icone: '👑', conquistado: false }
  ]

  return (
    <div className="space-y-6">
      {/* Entrada por Voz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-blue-600" />
            <span>Entrada por Voz</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              {isRecording ? 'Gravando... Clique para parar' : 'Clique para ditar sua redação'}
            </p>
          </div>
          
          {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Seu navegador não suporta reconhecimento de voz. 
                Recomendamos usar Chrome ou Edge para esta funcionalidade.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desafio Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Desafio Semanal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-yellow-800">{desafioAtual.titulo}</h3>
              <Badge className="bg-yellow-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {desafioAtual.tempoRestante}
              </Badge>
            </div>
            
            <p className="text-sm text-yellow-700 mb-3">
              <strong>Tema:</strong> {desafioAtual.tema}
            </p>
            
            <div className="flex items-center justify-between text-sm text-yellow-600 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{desafioAtual.participantes} participantes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>{desafioAtual.premio}</span>
              </div>
            </div>
            
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <PenTool className="h-4 w-4 mr-2" />
              Participar do Desafio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            <span>Ranking Semanal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ranking.map((usuario) => (
              <div 
                key={usuario.posicao}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  usuario.nome === 'Você' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    usuario.posicao === 1 ? 'bg-yellow-500 text-white' :
                    usuario.posicao === 2 ? 'bg-gray-400 text-white' :
                    usuario.posicao === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {usuario.posicao}
                  </div>
                  <span className="text-2xl">{usuario.avatar}</span>
                  <span className={`font-medium ${
                    usuario.nome === 'Você' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {usuario.nome}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-purple-600">{usuario.pontos}</span>
                  <span className="text-sm text-gray-500"> pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <span>Suas Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg text-center ${
                  badge.conquistado 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icone}</div>
                <p className={`text-xs font-medium ${
                  badge.conquistado ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {badge.nome}
                </p>
                {badge.conquistado && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                      Conquistado
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Progresso para próxima badge</span>
              <span className="text-sm text-blue-600">5/7 dias</span>
            </div>
            <Progress value={71} className="h-2" />
            <p className="text-xs text-blue-600 mt-1">
              Pratique por mais 2 dias consecutivos para conquistar "Sequência 7 dias" 🔥
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Gamificadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span>Estatísticas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-orange-700">Sequência atual</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.5h</div>
              <div className="text-sm text-purple-700">Tempo esta semana</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-700">Taxa de melhoria</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Redações este mês</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}