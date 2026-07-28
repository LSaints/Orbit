import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { UsuarioResponse } from '@/types'
import { authService } from '@/api/auth'

interface AuthState {
  token: string | null
  usuario: UsuarioResponse | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string, senhaConfirmacao: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeBase64Url(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}

function parseJwtPayload(token: string) {
  const part = token.split('.')[1]
  if (!part) return null
  return JSON.parse(decodeBase64Url(part))
}

function parseJwt(token: string) {
  try {
    const payload = parseJwtPayload(token)
    if (!payload) return null
    return {
      id: payload.sub ?? payload.NameIdentifier,
      nome: payload.unique_name ?? payload.Name,
      email: payload.email ?? payload.Email,
    } as UsuarioResponse
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('orbit_token')
    const usuario = token ? parseJwt(token) : null
    return { token, usuario, loading: false }
  })

  useEffect(() => {
    if (!state.token) return
    try {
      const payload = parseJwtPayload(state.token)
      if (!payload) return
      const exp = payload.exp * 1000
      if (Date.now() >= exp) {
        localStorage.removeItem('orbit_token')
        setState({ token: null, usuario: null, loading: false })
      }
    } catch {
      localStorage.removeItem('orbit_token')
      setState({ token: null, usuario: null, loading: false })
    }
  }, [state.token])

  const login = useCallback(async (email: string, senha: string) => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const { token } = await authService.login({ email, senha })
      const usuario = parseJwt(token)
      localStorage.setItem('orbit_token', token)
      setState({ token, usuario, loading: false })
    } catch (err) {
      setState((s) => ({ ...s, loading: false }))
      throw err
    }
  }, [])

  const register = useCallback(async (nome: string, email: string, senha: string, senhaConfirmacao: string) => {
    setState((s) => ({ ...s, loading: true }))
    try {
      await authService.register({ nome, email, senha, senhaConfirmacao })
      const { token } = await authService.login({ email, senha })
      const usuario = parseJwt(token)
      localStorage.setItem('orbit_token', token)
      setState({ token, usuario, loading: false })
    } catch (err) {
      setState((s) => ({ ...s, loading: false }))
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('orbit_token')
    setState({ token: null, usuario: null, loading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
