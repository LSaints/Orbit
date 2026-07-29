import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { perfilService } from '@/api/perfil'

const API_BASE = 'http://localhost:9000'

export function EditProfilePage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    perfilService.get().then((data) => {
      if (data.urlImagemPerfil) {
        setPreview(`${API_BASE}/${data.urlImagemPerfil}`)
      }
      setLoading(false)
    })
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!usuario) return

    if (!file) {
      navigate(`/perfil/${usuario.id}`)
      return
    }

    setSaving(true)
    await perfilService.uploadImage(file)
    setSaving(false)
    navigate(`/perfil/${usuario.id}`)
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Carregando...</p>
  }

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-white">Editar perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          {preview ? (
            <img src={preview} alt="Perfil" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-3xl font-bold text-zinc-500">
              {usuario?.nome.slice(0, 2).toUpperCase()}
            </div>
          )}

          <label className="cursor-pointer text-sm text-zinc-400 hover:text-white">
            Alterar foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Nome</label>
          <input
            type="text"
            value={usuario?.nome ?? ''}
            disabled
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Email</label>
          <input
            type="email"
            value={usuario?.email ?? ''}
            disabled
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-500"
          />
        </div>

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
