import api from './client'
import type { CriarPostagemRequest, AtualizarPostagemRequest, PostagemResponse } from '@/types'

export const postagensService = {
  async getFeed(page = 1, pageSize = 20): Promise<PostagemResponse[]> {
    const res = await api.get<PostagemResponse[]>('/postagens/feed', {
      params: { page, pageSize },
    })
    return res.data
  },

  async getMine(): Promise<PostagemResponse[]> {
    const res = await api.get<PostagemResponse[]>('/postagens/')
    return res.data
  },

  async getById(id: string): Promise<PostagemResponse> {
    const res = await api.get<PostagemResponse>(`/postagens/${id}`)
    return res.data
  },

  async create(data: CriarPostagemRequest): Promise<PostagemResponse> {
    const res = await api.post<PostagemResponse>('/postagens/', data)
    return res.data
  },

  async update(id: string, data: AtualizarPostagemRequest): Promise<PostagemResponse> {
    const res = await api.put<PostagemResponse>(`/postagens/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/postagens/${id}`)
  },

  async uploadMedia(postagemId: string, file: File): Promise<PostagemResponse> {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post<PostagemResponse>(`/postagens/${postagemId}/media`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async removeMedia(postagemId: string, mediaId: string): Promise<void> {
    await api.delete(`/postagens/${postagemId}/media/${mediaId}`)
  },
}
