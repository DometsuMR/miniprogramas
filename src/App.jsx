import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Tareas from './pages/Tareas'
import Login from './pages/Login'
import Register from './pages/Register'
import Post from './pages/post'

function App() {
  // Inicializa isAuthenticated leyendo localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  // Guarda el estado de autenticación en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated)
  }, [isAuthenticated])

  // Para redirigir después del logout
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    navigate('/')  // Redirige a inicio
  }

  return (
    <>
      <nav>
        <Link to="/">Inicio</Link> |{' '}
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Bienvenido a mi sitio</h1>
              {/* Mostrar enlace a tareas solo si está autenticado */}
              {isAuthenticated && (
                <nav
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                  <Link to="/tareas" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
                    Ir a Tareas
                  </Link>
                  <Link to="/post" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
                    Ir a post
                  </Link>
                </nav>
              )}
            </>
          }
        />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/post" element={<Post />} />

        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default function AppWrapper() {
  // useNavigate solo funciona dentro del Router, por eso envolvemos App aquí
  return (
    <Router>
      <App />
    </Router>
  )
}
