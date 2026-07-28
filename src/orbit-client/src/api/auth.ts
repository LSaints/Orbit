import api from './client'
import type { LoginRequest, CriarUsuarioRequest, LoginTokenResponse, UsuarioResponse } from '@/types'

export const authService = {
  async login(data: LoginRequest): Promise<LoginTokenResponse> {
    const res = await api.post<LoginTokenResponse>('/auth/login', data)
    return res.data
  },

  async register(data: CriarUsuarioRequest): Promise<UsuarioResponse> {
    const res = await api.post<UsuarioResponse>('/auth/register', data)
    return res.data
  },
}
