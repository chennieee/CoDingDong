import React from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>CoDingDong</h1>
        </Link>
        <nav>
          {user ? (
            <div>
              <span>{user.username}</span>
              <button onClick={handleClick}>Log out</button>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/lesson">Lesson</Link></li>
                <li><Link to="/leaderboards">Leaderboards</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
