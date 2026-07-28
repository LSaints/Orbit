import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { postagensService } from '@/api/postagens'

export function CreatePostPage() {
  const navigate = useNavigate()
  const [descricao, setDescricao] = useState('')
  const [categoriasInput, setCategoriasInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const categorias = categoriasInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)

      const post = await postagensService.create({
        descricao: descricao || null,
        categorias: categorias.length > 0 ? categorias : null,
      })

      for (const file of files) {
        await postagensService.uploadMedia(post.id, file)
      }

      navigate(`/postagens/${post.id}`)
    } catch {
      setError('Erro ao criar postagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-white">Nova postagem</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="O que está pensando?"
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

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Mídia</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg"
            multiple
            onChange={handleFiles}
            className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-zinc-300 hover:file:bg-zinc-700"
          />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="rounded-lg object-cover" />
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}
