export interface LoginRequest {
  email: string
  senha: string
}

export interface CriarUsuarioRequest {
  nome: string
  email: string
  senha: string
  senhaConfirmacao: string
}

export interface AtualizarPerfilRequest {
  urlImagemPerfil: string
}

export interface CriarPostagemRequest {
  descricao: string | null
  categorias: string[] | null
}

export interface AtualizarPostagemRequest {
  descricao: string | null
  categorias: string[] | null
}

export interface LoginTokenResponse {
  token: string
}

export interface UsuarioResponse {
  id: string
  nome: string
  email: string
}

export interface PerfilResponse {
  id: string
  usuarioId: string
  urlImagemPerfil: string
  usuario: UsuarioResponse
}

export interface PostagemMediaResponse {
  id: string
  url: string
  tipo: 'imagem' | 'video'
}

export interface PostagemCategoriaResponse {
  id: string
  descricao: string
}

export interface PostagemResponse {
  id: string
  usuarioId: string
  descricao: string | null
  medias: PostagemMediaResponse[]
  categorias: PostagemCategoriaResponse[]
  usuario: UsuarioResponse
  dataCriacao: string
  dataAtualizacao: string
}
