import api from './client'
import type { UsuarioResponse } from '@/types'

export const usuariosService = {
  async getAll(): Promise<UsuarioResponse[]> {
    const res = await api.get<UsuarioResponse[]>('/usuarios/')
    return res.data
  },

  async getById(id: string): Promise<UsuarioResponse> {
    const res = await api.get<UsuarioResponse>(`/usuarios/${id}`)
    return res.data
  },
}
