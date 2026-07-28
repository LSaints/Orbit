import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postagensService } from '@/api/postagens'
import type { PostagemResponse } from '@/types'

export function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostagemResponse | null>(null)
  const [descricao, setDescricao] = useState('')
  const [categoriasInput, setCategoriasInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    postagensService.getById(id).then((data) => {
      setPost(data)
      setDescricao(data.descricao ?? '')
      setCategoriasInput(data.categorias.map((c) => c.descricao).join(', '))
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)

    const categorias = categoriasInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    await postagensService.update(id, {
      descricao: descricao || null,
      categorias: categorias.length > 0 ? categorias : null,
    })

    navigate(`/postagens/${id}`)
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Carregando...</p>
  }

  if (!post) {
    return <p className="py-12 text-center text-sm text-zinc-500">Postagem não encontrada</p>
  }

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-white">Editar postagem</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />

        <input
          type="text"
          placeholder="Categorias (separadas por vírgula)"
          value={categoriasInput}
          onChange={(e) => setCategoriasInput(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}
