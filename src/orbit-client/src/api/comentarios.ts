import api from './client'
import type { ComentarioResponse, CriarComentarioRequest, CriarRespostaRequest } from '@/types'

export const comentariosService = {
  async getByPostagem(postagemId: string): Promise<ComentarioResponse[]> {
    const res = await api.get<ComentarioResponse[]>(`/postagens/${postagemId}/comentarios`)
    return res.data
  },

  async criar(postagemId: string, data: CriarComentarioRequest): Promise<ComentarioResponse> {
    const res = await api.post<ComentarioResponse>(`/postagens/${postagemId}/comentarios`, data)
    return res.data
  },

  async responder(
    postagemId: string,
    comentarioPaiId: string,
    data: CriarRespostaRequest,
  ): Promise<ComentarioResponse> {
    const res = await api.post<ComentarioResponse>(
      `/postagens/${postagemId}/comentarios/${comentarioPaiId}/respostas`,
      data,
    )
    return res.data
  },
}
