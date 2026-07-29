import api from './client'
import type { PostagemEventoResponse } from '@/types'

export const postagensEventosService = {
  async curtir(postagemId: string): Promise<PostagemEventoResponse> {
    const res = await api.post<PostagemEventoResponse>(`/postagens/${postagemId}/curtir`)
    return res.data
  },

  async descutir(postagemId: string): Promise<PostagemEventoResponse> {
    const res = await api.post<PostagemEventoResponse>(`/postagens/${postagemId}/descurtir`)
    return res.data
  },

  async getEventos(postagemId: string): Promise<PostagemEventoResponse[]> {
    const res = await api.get<PostagemEventoResponse[]>(`/postagens/${postagemId}/eventos`)
    return res.data
  },

  async getMeuEvento(postagemId: string): Promise<PostagemEventoResponse | null> {
    try {
      const res = await api.get<PostagemEventoResponse>(`/postagens/${postagemId}/eventos/meu-evento`)
      return res.data
    } catch {
      return null
    }
  },
}
