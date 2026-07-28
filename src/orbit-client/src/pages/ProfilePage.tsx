import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { postagensService } from '@/api/postagens'
import { perfilService } from '@/api/perfil'
import { useAuth } from '@/contexts/AuthContext'
import type { PostagemResponse, PerfilResponse } from '@/types'
import { PostCard } from '@/components/PostCard'

const API_BASE = 'http://localhost:9000'

export function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { usuario } = useAuth()
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null)
  const [posts, setPosts] = useState<PostagemResponse[]>([])
  const [loading, setLoading] = useState(true)

  const isOwnProfile = usuario?.id === id

  useEffect(() => {
    if (!id) return
    setLoading(true)

    Promise.all([
      isOwnProfile ? perfilService.get().catch(() => null) : Promise.resolve(null),
      postagensService.getMine(),
    ]).then(([perfilData, postsData]) => {
      setPerfil(perfilData)
      setPosts(postsData.filter((p) => p.usuarioId === id))
      setLoading(false)
    })
  }, [id, isOwnProfile])

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Carregando...</p>
  }
  console.log(perfil)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {perfil?.urlImagemPerfil ? (
          <img
            src={`${API_BASE}/${perfil.urlImagemPerfil}`}
            alt="Perfil"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-2xl font-bold text-zinc-500">
            {id?.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-white">{id?.slice(0, 8)}</h2>
          <p className="text-sm text-zinc-500">{posts.length} postagens</p>
        </div>

        {isOwnProfile && (
          <Link
            to="/perfil/editar"
            className="ml-auto rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Editar perfil
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {!loading && posts.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500">Nenhuma postagem</p>
      )}
    </div>
  )
}
