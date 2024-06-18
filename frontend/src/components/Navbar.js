// NAVBAR APPEARS ON ALL PAGES OF THE APP 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header>
      <div className="container">
      <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>CoDingDong</h1>
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
