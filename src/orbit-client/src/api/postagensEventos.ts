import api from './client'
import type { PostagemEventoResponse } from '@/types'

export const postagensEventosService = {
  async curtir(postagemId: string): Promise<PostagemEventoResponse> {
    const res = await api.post<PostagemEventoResponse>('/postagens/curtir', null, {
      params: { postagemId },
    })
    return res.data
  },

  async descutir(postagemId: string): Promise<PostagemEventoResponse> {
    const res = await api.post<PostagemEventoResponse>('/postagens/descurtir', null, {
      params: { postagemId },
    })
    return res.data
  },

  async getEventos(postagemId: string): Promise<PostagemEventoResponse[]> {
    const res = await api.get<PostagemEventoResponse[]>('/postagens/eventos', {
      params: { postagemId },
    })
    return res.data
  },

  async getMeuEvento(postagemId: string): Promise<PostagemEventoResponse | null> {
    try {
      const res = await api.get<PostagemEventoResponse>('/postagens/eventos/meu-evento', {
        params: { postagemId },
      })
      return res.data
    } catch {
      return null
    }
  },
}
