import { useState, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { postagensService } from '@/api/postagens'

interface MediaItem {
  file: File
  preview: string
}

export function CreatePostPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [descricao, setDescricao] = useState('')
  const [categoriasInput, setCategoriasInput] = useState('')
  const [medias, setMedias] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    const newMedias = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setMedias((prev) => [...prev, ...newMedias])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeMedia = (index: number) => {
    setMedias((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
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

      if (medias.length > 0) {
        try {
          await postagensService.uploadMedias(
            post.id,
            medias.map((m) => m.file),
          )
        } catch {
          for (const m of medias) {
            await postagensService.uploadMedia(post.id, m.file)
          }
        }
      }

      medias.forEach((m) => URL.revokeObjectURL(m.preview))
      navigate(`/postagens/${post.id}`)
    } catch {
      setError('Erro ao criar postagem')
    } finally {
      setLoading(false)
    }
  }

  const isVideo = (file: File) => file.type.startsWith('video/')

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
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg"
            multiple
            onChange={handleFiles}
            className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-zinc-300 hover:file:bg-zinc-700"
          />
        </div>

        {medias.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {medias.map((m, i) => (
              <div key={i} className="group relative">
                {isVideo(m.file) ? (
                  <video src={m.preview} className="h-32 w-full rounded-lg object-cover" />
                ) : (
                  <img src={m.preview} alt="" className="h-32 w-full rounded-lg object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || medias.length === 0}
          className="w-full rounded-lg bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}
