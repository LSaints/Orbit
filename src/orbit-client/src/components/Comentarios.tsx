import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { comentariosService } from '@/api/comentarios'
import type { ComentarioResponse } from '@/types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

export function Comentarios({
  postagemId,
  collapsible = false,
  totalComentarios,
  onComentarioAdicionado,
}: {
  postagemId: string
  collapsible?: boolean
  totalComentarios?: number
  onComentarioAdicionado?: () => void
}) {
  const [comentarios, setComentarios] = useState<ComentarioResponse[]>([])
  const [aberto, setAberto] = useState(!collapsible)
  const [carregado, setCarregado] = useState(!collapsible)
  const [conteudo, setConteudo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [respondendo, setRespondendo] = useState<{ id: string; conteudo: string } | null>(null)

  const load = useCallback(() => {
    comentariosService.getByPostagem(postagemId).then(setComentarios).catch(() => {})
  }, [postagemId])

  useEffect(() => {
    if (carregado) load()
  }, [carregado, load])

  const handleToggle = () => {
    if (!carregado) {
      setCarregado(true)
      load()
    }
    setAberto((a) => !a)
  }

  const handleEnviar = async () => {
    if (!conteudo.trim() || enviando) return
    setEnviando(true)
    setErro(null)
    try {
      await comentariosService.criar(postagemId, { conteudo: conteudo.trim() })
      setConteudo('')
      if (!carregado) {
        setCarregado(true)
        setAberto(true)
      }
      load()
      onComentarioAdicionado?.()
    } catch {
      setErro('Não foi possível publicar o comentário')
    }
    setEnviando(false)
  }

  const handleEnviarResposta = async () => {
    if (!respondendo || !respondendo.conteudo.trim() || enviando) return
    setEnviando(true)
    setErro(null)
    try {
      await comentariosService.responder(postagemId, respondendo.id, {
        conteudo: respondendo.conteudo.trim(),
      })
      setRespondendo(null)
      load()
      onComentarioAdicionado?.()
    } catch {
      setErro('Não foi possível publicar a resposta')
    }
    setEnviando(false)
  }

  return (
    <section className="border-t border-zinc-800 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">Comentários</h3>
        {collapsible && (
          <button
            onClick={handleToggle}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {aberto ? 'Ocultar comentários' : `Ver comentários (${totalComentarios ?? comentarios.length})`}
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Escreva um comentário..."
          rows={2}
          className="flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={handleEnviar}
          disabled={!conteudo.trim() || enviando}
          className="h-fit rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          Comentar
        </button>
      </div>

      {erro && <p className="mb-3 text-xs text-red-400">{erro}</p>}

      {aberto && (comentarios.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">Nenhum comentário ainda</p>
      ) : (
        <ul className="max-h-80 space-y-4 overflow-y-auto pr-1">
          {comentarios.map((comentario) => (
            <CommentItem
              key={comentario.id}
              comentario={comentario}
              respondendoId={respondendo?.id ?? null}
              respondendoConteudo={respondendo?.conteudo ?? ''}
              enviando={enviando}
              onToggleResponder={(id) =>
                setRespondendo(respondendo?.id === id ? null : { id, conteudo: '' })
              }
              onConteudoResposta={(conteudo) =>
                setRespondendo((r) => (r ? { ...r, conteudo } : r))
              }
              onEnviarResposta={handleEnviarResposta}
            />
          ))}
        </ul>
      ))}
    </section>
  )
}

interface CommentItemProps {
  comentario: ComentarioResponse
  respondendoId: string | null
  respondendoConteudo: string
  enviando: boolean
  onToggleResponder: (id: string) => void
  onConteudoResposta: (conteudo: string) => void
  onEnviarResposta: () => void
}

function CommentItem({
  comentario,
  respondendoId,
  respondendoConteudo,
  enviando,
  onToggleResponder,
  onConteudoResposta,
  onEnviarResposta,
}: CommentItemProps) {
  const respondendo = respondendoId === comentario.id

  return (
    <li>
      <div className="flex items-center gap-2">
        <Link
          to={`/perfil/${comentario.usuarioId}`}
          className="text-xs font-medium text-zinc-200 hover:underline"
        >
          {comentario.usuario.nome}
        </Link>
        <span className="text-[11px] text-zinc-500">{timeAgo(comentario.dataCriacao)}</span>
      </div>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-300">{comentario.conteudo}</p>

      <button
        onClick={() => onToggleResponder(comentario.id)}
        className="mt-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
      >
        Responder
      </button>

      {respondendo && (
        <div className="mt-2 flex gap-2">
          <input
            value={respondendoConteudo}
            onChange={(e) => onConteudoResposta(e.target.value)}
            placeholder="Escreva uma resposta..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={onEnviarResposta}
            disabled={!respondendoConteudo.trim() || enviando}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      )}

      {comentario.respostas.length > 0 && (
        <ul className="ml-5 mt-3 space-y-3 border-l border-zinc-800 pl-3">
          {comentario.respostas.map((resposta) => (
            <CommentItem
              key={resposta.id}
              comentario={resposta}
              respondendoId={respondendoId}
              respondendoConteudo={respondendoConteudo}
              enviando={enviando}
              onToggleResponder={onToggleResponder}
              onConteudoResposta={onConteudoResposta}
              onEnviarResposta={onEnviarResposta}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
