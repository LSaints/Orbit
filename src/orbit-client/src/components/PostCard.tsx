import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { perfilService } from '@/api/perfil'
import type { PostagemResponse } from '@/types'

const API_BASE = 'http://localhost:5033'

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

export function PostCard({ post }: { post: PostagemResponse }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const firstMedia = post.medias[0]

  useEffect(() => {
    perfilService.getById(post.usuarioId).then((p) => {
      if (p.urlImagemPerfil) setAvatarUrl(p.urlImagemPerfil)
    }).catch(() => {})
  }, [post.usuarioId])

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Link to={`/perfil/${post.usuarioId}`} className="flex items-center gap-2">
          {avatarUrl ? (
            <img src={`${API_BASE}/${avatarUrl}`} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-bold text-zinc-400">
              {post.usuario.nome?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-zinc-100 hover:underline">{post.usuario.nome}</span>
        </Link>
        <span className="text-xs text-zinc-500">{timeAgo(post.dataCriacao)}</span>
      </div>

      {post.descricao && (
        <p className="mb-3 whitespace-pre-wrap text-sm text-zinc-300">{post.descricao}</p>
      )}

      {firstMedia && (
        <Link to={`/postagens/${post.id}`} className="block overflow-hidden rounded-lg">
          {firstMedia.tipo === 'video' ? (
            <video src={`${API_BASE}/${firstMedia.url}`} className="w-full rounded-lg" controls />
          ) : (
            <img
              src={`${API_BASE}/${firstMedia.url}`}
              alt={post.descricao ?? ''}
              className="w-full rounded-lg object-cover"
              loading="lazy"
            />
          )}
        </Link>
      )}

      {post.categorias.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.categorias.map((cat) => (
            <span key={cat.id} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {cat.descricao}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
