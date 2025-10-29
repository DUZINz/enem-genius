import { useState, useEffect, useCallback } from 'react'
import { PerfilEscrita, MensagemChat, CorrecaoRedacao } from '@/lib/types/mentor'

interface UseMentorReturn {
  perfil: PerfilEscrita | null
  mensagens: MensagemChat[]
  isLoading: boolean
  isTyping: boolean
  corrigirRedacao: (texto: string) => Promise<CorrecaoRedacao | null>
  enviarMensagem: (conteudo: string, categoria?: string) => Promise<void>
  carregarHistorico: () => Promise<void>
  limparChat: () => void
}

export function useMentor(alunoId: string): UseMentorReturn {
  const [perfil, setPerfil] = useState<PerfilEscrita | null>(null)
  const [mensagens, setMensagens] = useState<MensagemChat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Carregar perfil do aluno
  useEffect(() => {
    carregarPerfil()
  }, [alunoId])

  const carregarPerfil = async () => {
    try {
      // Simular carregamento do perfil do localStorage ou API
      const perfilSalvo = localStorage.getItem(`perfil_${alunoId}`)
      if (perfilSalvo) {
        setPerfil(JSON.parse(perfilSalvo))
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const salvarPerfil = (novoPerfil: PerfilEscrita) => {
    try {
      localStorage.setItem(`perfil_${novoPerfil.aluno_id}`, JSON.stringify(novoPerfil))
      setPerfil(novoPerfil)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    }
  }

  const corrigirRedacao = useCallback(async (texto: string): Promise<CorrecaoRedacao | null> => {
    if (!texto.trim()) return null

    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/mentor/redacao-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aluno_id: alunoId,
          texto: texto,
          perfil_atual: perfil
        })
      })

      if (!response.ok) {
        throw new Error('Erro na correção da redação')
      }

      const resultado = await response.json()
      
      // Atualizar perfil
      salvarPerfil(resultado.perfil_atualizado)

      // Criar objeto de correção
      const correcao: CorrecaoRedacao = {
        id: Date.now().toString(),
        aluno_id: alunoId,
        texto_original: texto,
        texto_corrigido: resultado.texto_corrigido,
        notas_competencias: resultado.notas_competencias,
        nota_total: resultado.nota_total,
        comentarios: resultado.comentarios,
        erros_detectados: resultado.erros_detectados,
        dicas_personalizadas: resultado.dicas_personalizadas,
        data_correcao: new Date().toISOString(),
        tempo_correcao: 0
      }

      // Salvar correção no histórico
      const historicoKey = `historico_${alunoId}`
      const historicoAtual = JSON.parse(localStorage.getItem(historicoKey) || '[]')
      historicoAtual.push(correcao)
      localStorage.setItem(historicoKey, JSON.stringify(historicoAtual))

      // Adicionar mensagens do mentor ao chat
      const mensagemCorrecao: MensagemChat = {
        id: Date.now().toString(),
        tipo: 'mentor',
        conteudo: formatarFeedbackCorrecao(resultado),
        timestamp: new Date(),
        categoria: 'correcao',
        correcao_id: correcao.id
      }

      setMensagens(prev => [...prev, mensagemCorrecao])

      return correcao

    } catch (error) {
      console.error('Erro ao corrigir redação:', error)
      
      const mensagemErro: MensagemChat = {
        id: Date.now().toString(),
        tipo: 'mentor',
        conteudo: 'Desculpe, ocorreu um erro ao corrigir sua redação. Tente novamente em alguns instantes.',
        timestamp: new Date(),
        categoria: 'geral'
      }
      
      setMensagens(prev => [...prev, mensagemErro])
      return null
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [alunoId, perfil])

  const enviarMensagem = useCallback(async (conteudo: string, categoria = 'geral') => {
    if (!conteudo.trim()) return

    // Adicionar mensagem do usuário
    const mensagemUsuario: MensagemChat = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: conteudo,
      timestamp: new Date(),
      categoria: categoria as any
    }

    setMensagens(prev => [...prev, mensagemUsuario])
    setIsTyping(true)

    // Verificar se é uma redação para correção
    if (conteudo.length > 100 && (conteudo.includes('redação') || conteudo.includes('tema') || categoria === 'redacao')) {
      await corrigirRedacao(conteudo)
      return
    }

    // Simular resposta do mentor
    setTimeout(() => {
      const respostaMentor = gerarRespostaMentor(conteudo, perfil)
      const mensagemMentor: MensagemChat = {
        id: (Date.now() + 1).toString(),
        tipo: 'mentor',
        conteudo: respostaMentor,
        timestamp: new Date(),
        categoria: categoria as any
      }

      setMensagens(prev => [...prev, mensagemMentor])
      setIsTyping(false)
    }, 1500)
  }, [perfil, corrigirRedacao])

  const carregarHistorico = useCallback(async () => {
    try {
      const historicoKey = `chat_${alunoId}`
      const chatSalvo = localStorage.getItem(historicoKey)
      if (chatSalvo) {
        const mensagensSalvas = JSON.parse(chatSalvo)
        setMensagens(mensagensSalvas.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }, [alunoId])

  const limparChat = useCallback(() => {
    setMensagens([])
    localStorage.removeItem(`chat_${alunoId}`)
  }, [alunoId])

  // Salvar mensagens no localStorage
  useEffect(() => {
    if (mensagens.length > 0) {
      const chatKey = `chat_${alunoId}`
      localStorage.setItem(chatKey, JSON.stringify(mensagens))
    }
  }, [mensagens, alunoId])

  return {
    perfil,
    mensagens,
    isLoading,
    isTyping,
    corrigirRedacao,
    enviarMensagem,
    carregarHistorico,
    limparChat
  }
}

// Função auxiliar para formatar feedback de correção
function formatarFeedbackCorrecao(resultado: any): string {
  const { notas_competencias, nota_total, comentarios, mensagem_motivacional } = resultado

  let feedback = `## 📝 Correção Completa da sua Redação\n\n`
  
  feedback += `### 🎯 **Nota Total: ${nota_total}/1000**\n\n`
  
  feedback += `### 📊 **Notas por Competência:**\n`
  feedback += `• **C1** (Norma Culta): ${notas_competencias.C1}/200\n`
  feedback += `• **C2** (Tema): ${notas_competencias.C2}/200\n`
  feedback += `• **C3** (Organização): ${notas_competencias.C3}/200\n`
  feedback += `• **C4** (Coesão): ${notas_competencias.C4}/200\n`
  feedback += `• **C5** (Proposta): ${notas_competencias.C5}/200\n\n`
  
  if (comentarios.length > 0) {
    feedback += `### 💡 **Feedback Detalhado:**\n`
    comentarios.forEach((comentario: string) => {
      feedback += `${comentario}\n`
    })
    feedback += `\n`
  }
  
  feedback += `### 🌟 **Mensagem do Mentor:**\n${mensagem_motivacional}\n\n`
  
  feedback += `---\n*Correção realizada em ${new Date().toLocaleString('pt-BR')}*`
  
  return feedback
}

// Função auxiliar para gerar respostas do mentor
function gerarRespostaMentor(mensagem: string, perfil: PerfilEscrita | null): string {
  const lowerMessage = mensagem.toLowerCase()
  
  // Respostas personalizadas baseadas no perfil
  if (perfil) {
    if (perfil.nivel_escrita === 'iniciante' && lowerMessage.includes('difícil')) {
      return `Entendo que pode parecer difícil no início, ${perfil.nivel_escrita === 'iniciante' ? 'mas você está no caminho certo' : ''}! 💪\n\nCom base no seu perfil, vejo que você já tem ${perfil.historico_redacoes} redação(ões) corrigida(s). Isso mostra dedicação!\n\n**Dicas personalizadas para você:**\n${perfil.recomendacoes_personalizadas.map(rec => `• ${rec}`).join('\n')}\n\nLembre-se: cada redação é uma oportunidade de crescer. Continue praticando! 🌟`
    }
  }
  
  // Respostas padrão baseadas em palavras-chave
  if (lowerMessage.includes('nota') || lowerMessage.includes('pontuação')) {
    return `📊 **Sobre as notas do ENEM:**\n\nCada competência vale até 200 pontos:\n• **C1**: Norma culta da língua\n• **C2**: Compreensão do tema\n• **C3**: Organização das informações\n• **C4**: Coesão e coerência\n• **C5**: Proposta de intervenção\n\n**Meta ideal:** 800+ pontos (média 160 por competência)\n**Nota 1000:** Excelência em todas as competências\n\nQuer que eu analise uma redação sua para ver como está seu desempenho? 🎯`
  }
  
  if (lowerMessage.includes('medo') || lowerMessage.includes('ansiedade') || lowerMessage.includes('nervoso')) {
    return `🤗 **É normal sentir ansiedade!**\n\nTodos os estudantes passam por isso. Aqui estão algumas estratégias:\n\n**Para reduzir a ansiedade:**\n• Pratique redações regularmente\n• Simule condições de prova\n• Respire fundo antes de começar\n• Lembre-se: você se preparou para isso!\n\n**Técnica de relaxamento:**\n1. Inspire por 4 segundos\n2. Segure por 4 segundos\n3. Expire por 4 segundos\n4. Repita 3 vezes\n\nVocê é capaz! Sua preparação fará a diferença. 💙`
  }
  
  // Resposta padrão encorajadora
  return `Obrigado por compartilhar isso comigo! 😊\n\nEstou aqui para te ajudar em todos os aspectos do ENEM. Posso te auxiliar com:\n\n📝 **Redação**: Correção, estrutura, repertório\n📚 **Conteúdos**: Todas as matérias\n🎯 **Estratégias**: Técnicas de estudo e prova\n💪 **Motivação**: Apoio emocional e metas\n\nO que você gostaria de trabalhar hoje? Pode me enviar uma redação, fazer uma pergunta específica ou apenas conversar sobre seus estudos!\n\nEstamos juntos nessa jornada! 🌟`
}