import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postagensService } from '@/api/postagens'
import { useAuth } from '@/contexts/AuthContext'
import type { PostagemResponse } from '@/types'

const API_BASE = 'http://localhost:5033'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostagemResponse | null>(null)
  const [loading, setLoading] = useState(true)

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

      {post.descricao && (
        <p className="whitespace-pre-wrap text-sm text-zinc-300">{post.descricao}</p>
      )}

      <div className="space-y-3">
        {post.medias.map((media) =>
          media.tipo === 'video' ? (
            <video
              key={media.id}
              src={`${API_BASE}/${media.url}`}
              className="w-full rounded-lg"
              controls
            />
          ) : (
            <img
              key={media.id}
              src={`${API_BASE}/${media.url}`}
              alt=""
              className="w-full rounded-lg object-cover"
            />
          ),
        )}
      </div>

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
