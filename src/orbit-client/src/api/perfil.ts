import api from './client'
import type { PerfilResponse } from '@/types'

export const perfilService = {
  async get(): Promise<PerfilResponse> {
    const res = await api.get<PerfilResponse>('/perfil/')
    return res.data
  },

  async uploadImage(file: File): Promise<PerfilResponse> {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post<PerfilResponse>('/perfil/imagem', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}
