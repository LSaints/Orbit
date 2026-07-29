import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link to="/feed" className="text-lg font-bold text-white">
          Orbit
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/feed"
            className={`text-sm transition-colors ${
              isActive('/feed') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Feed
          </Link>
          <Link
            to="/postagens/criar"
            className={`text-sm transition-colors ${
              isActive('/postagens/criar') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Criar
          </Link>
          {usuario && (
            <Link
              to={`/perfil/${usuario.id}`}
              className={`text-sm transition-colors ${
                location.pathname.startsWith('/perfil') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Perfil
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 transition-colors hover:text-red-400"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
