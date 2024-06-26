import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(username, password);
  };
  console.log(username); // debugging
  console.log(password); // debugging

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
      {error && <div className="error" dangerouslySetInnerHTML={{ __html: error }} />}
    </form>
  );
};

export default Signup;

// original line 34: {error && <div className="error">{error}</div>}
// keeping this here jic this new one doesnt work 