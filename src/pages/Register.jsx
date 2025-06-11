import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Revisa tu correo para confirmar el registro')
    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrarse</button>
      <p>{message}</p>
    </div>
  )
}

export default Register
