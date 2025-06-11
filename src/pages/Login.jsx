import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Sesión iniciada correctamente')
      onLoginSuccess()      // <-- Le avisas a App que se autenticó
      navigate('/')    // <-- Rediriges a inicio
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
      <p>{message}</p>
    </div>
  )
}

export default Login
