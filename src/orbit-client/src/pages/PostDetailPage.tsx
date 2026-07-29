import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postagensService } from '@/api/postagens'
import { useAuth } from '@/contexts/AuthContext'
import type { PostagemResponse } from '@/types'
import { MediaCarousel } from '@/components/MediaCarousel'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostagemResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!id) return
    postagensService.getById(id).then((data) => {
      setPost(data)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!id || !confirm('Excluir esta postagem?')) return
    await postagensService.remove(id)
    navigate('/feed')
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
    </div>
  )
}
