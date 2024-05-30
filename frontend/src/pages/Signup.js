import { useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useSignup()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(username, password)

    navigate('/dashboard');
    // NOT SURE IF THIS WORKS EH but if line 14 throws error this line wldnt run so i think it wld work (?)
  }
  console.log(username); // do we need these console.logs? or r they j for debugging?
  console.log(password);

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Username:</label>
      <input
        type="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup