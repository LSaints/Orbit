import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { FeedPage } from '@/pages/FeedPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PostDetailPage } from '@/pages/PostDetailPage'
import { CreatePostPage } from '@/pages/CreatePostPage'
import { EditPostPage } from '@/pages/EditPostPage'
import { EditProfilePage } from '@/pages/EditProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/perfil/editar" element={<EditProfilePage />} />
            <Route path="/perfil/:id" element={<ProfilePage />} />
            <Route path="/postagens/criar" element={<CreatePostPage />} />
            <Route path="/postagens/:id" element={<PostDetailPage />} />
            <Route path="/postagens/:id/editar" element={<EditPostPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
