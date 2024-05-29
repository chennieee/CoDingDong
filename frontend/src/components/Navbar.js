import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { user } = useAuthContext();

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
              <ul>
                <li><Link to="/">Home</Link></li>
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
