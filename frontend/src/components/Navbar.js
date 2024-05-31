// NAVBAR APPEARS ON ALL PAGES OF THE APP 

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>CoDingDong</h1>
        </Link>
        <nav>
          {user && (
            <div className="user-info">
              <span>{user.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
