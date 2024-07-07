import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    // Call logout API and clear user data
    setUser(null);
  };

  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/forum">Forum</Link>
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;