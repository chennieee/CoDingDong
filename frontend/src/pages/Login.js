import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading } = useLogin()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(username, password)

    navigate('/dashboard');
    // NOT SURE IF THIS WORKS EH but if line 14 throws error this line wldnt run so i think it wld work (?)
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>

      <label>Username:</label>
      <input
        type="username" // can be type="text" 
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <label>Password:</label>
      <input
        type="password" // masks characters as they are typed
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Login;