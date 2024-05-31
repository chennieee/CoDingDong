// NAVBAR APPEARS ON ALL PAGES OF THE APP 

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>CoDingDong</h1>
        </Link>
        <nav>
          {user ? (
            <div className="user-info">
              <span>{user.username}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          ) : (
            <div className="auth-links">
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
