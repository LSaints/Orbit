import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postagensService } from '@/api/postagens'
import { postagensEventosService } from '@/api/postagensEventos'
import { useAuth } from '@/contexts/AuthContext'
import type { PostagemResponse } from '@/types'
import { MediaCarousel } from '@/components/MediaCarousel'
import { Comentarios } from '@/components/Comentarios'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostagemResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [curtidas, setCurtidas] = useState(0)
  const [descurtidas, setDescurtidas] = useState(0)
  const [comentarios, setComentarios] = useState(0)
  const [meuEvento, setMeuEvento] = useState<'Curtir' | 'Descutir' | 'Comentar' | null>(null)
  const [loadingEvento, setLoadingEvento] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      postagensService.getById(id),
      postagensEventosService.getEventos(id),
      postagensEventosService.getMeuEvento(id),
    ]).then(([postData, eventos, meu]) => {
      setPost(postData)
      setCurtidas(eventos.filter((e) => e.tipoEventoPostagem === 'Curtir').length)
      setDescurtidas(eventos.filter((e) => e.tipoEventoPostagem === 'Descutir').length)
      setComentarios(eventos.filter((e) => e.tipoEventoPostagem === 'Comentar').length)
      setMeuEvento(meu?.tipoEventoPostagem ?? null)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!id || !confirm('Excluir esta postagem?')) return
    await postagensService.remove(id)
    navigate('/feed')
  }

  const handleToggle = async () => {
    if (!id || loadingEvento) return
    setLoadingEvento(true)
    try {
      if (meuEvento === 'Curtir') {
        await postagensEventosService.descutir(id)
        setDescurtidas((c) => c + 1)
        setMeuEvento('Descutir')
      } else if (meuEvento === 'Descutir') {
        await postagensEventosService.curtir(id)
        setCurtidas((c) => c + 1)
        setMeuEvento('Curtir')
      } else {
        await postagensEventosService.curtir(id)
        setCurtidas((c) => c + 1)
        setMeuEvento('Curtir')
      }
    } catch { }
    setLoadingEvento(false)
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Carregando...</p>
  }

  if (!post) {
    return <p className="py-12 text-center text-sm text-zinc-500">Postagem não encontrada</p>
  }

  const isOwner = usuario?.id === post.usuarioId

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to={`/perfil/${post.usuarioId}`} className="text-sm font-medium text-zinc-100 hover:underline">
          {post.usuario.nome}
        </Link>
        <span className="text-xs text-zinc-500">
          {new Date(post.dataCriacao).toLocaleDateString('pt-BR')}
        </span>
        {isOwner && (
          <div className="ml-auto flex gap-2">
            <Link
              to={`/postagens/${post.id}/editar`}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Editar
            </Link>
            <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">
              Excluir
            </button>
          </div>
        )}
      </div>

      {post.medias.length > 0 && <MediaCarousel medias={post.medias} />}

      {post.descricao && (
        <div className="overflow-hidden">
          <p
            className={`whitespace-pre-wrap break-words text-sm text-zinc-300 ${
              !expanded ? 'line-clamp-3' : ''
            }`}
          >
            {post.descricao}
          </p>
          {post.descricao.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs text-zinc-500 hover:text-zinc-300"
            >
              {expanded ? 'ver menos' : 'ver mais'}
            </button>
          )}
        </div>
      )}

      {post.categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.categorias.map((cat) => (
            <span key={cat.id} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {cat.descricao}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-3">
        <button
          onClick={handleToggle}
          disabled={loadingEvento}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            meuEvento === 'Curtir' ? 'text-emerald-400' : 'text-zinc-500 hover:text-emerald-400'
          }`}
        >
          <svg className="h-5 w-5" fill={meuEvento === 'Curtir' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          </svg>
          <span>{curtidas - descurtidas}</span>
        </button>
        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{comentarios}</span>
        </span>
      </div>

      <Comentarios postagemId={post.id} totalComentarios={comentarios} onComentarioAdicionado={() => setComentarios((c) => c + 1)} />
    </div>
  )
}
