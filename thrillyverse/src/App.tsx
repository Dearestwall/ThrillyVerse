import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminGuard } from './components/admin/AdminGuard'
import { ADMIN_LOGIN_PATH } from './lib/config'
import { HomePage } from './pages/HomePage'
import { MaterialsPage } from './pages/MaterialsPage'
import { MoviesPage } from './pages/MoviesPage'
import { BlogsPage } from './pages/BlogsPage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminProjects } from './pages/admin/AdminProjects'
import { AdminMaterials } from './pages/admin/AdminMaterials'
import { AdminMovies } from './pages/admin/AdminMovies'
import { AdminBlogs } from './pages/admin/AdminBlogs'
import { AdminContacts } from './pages/admin/AdminContacts'
import { AdminHomepage } from './pages/admin/AdminHomepage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path={ADMIN_LOGIN_PATH} element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminGuard>
              <AdminProjects />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <AdminGuard>
              <AdminMaterials />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <AdminGuard>
              <AdminMovies />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <AdminGuard>
              <AdminBlogs />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <AdminGuard>
              <AdminContacts />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/homepage"
          element={
            <AdminGuard>
              <AdminHomepage />
            </AdminGuard>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}