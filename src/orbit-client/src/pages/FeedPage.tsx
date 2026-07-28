import { useState, useEffect, useCallback } from 'react'
import { postagensService } from '@/api/postagens'
import type { PostagemResponse } from '@/types'
import { PostCard } from '@/components/PostCard'

export function FeedPage() {
  const [posts, setPosts] = useState<PostagemResponse[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    const data = await postagensService.getFeed(p, 20)
    setPosts((prev) => (p === 1 ? data : [...prev, ...data]))
    setHasMore(data.length === 20)
    setLoading(false)
  }, [])

  useEffect(() => {
    load(page)
  }, [page, load])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Feed</h2>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {!loading && posts.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500">Nenhuma postagem ainda</p>
      )}

      {hasMore && posts.length > 0 && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="w-full rounded-lg border border-zinc-700 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  )
}
