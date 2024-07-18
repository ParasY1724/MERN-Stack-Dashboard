import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(URL+'/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.userId);
        navigate('/');
        location.reload();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center m-5">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <img 
        className="mx-auto h-24 w-auto" src="https://cdn-icons-png.flaticon.com/512/10840/10840187.png" alt="CodeForumLogo" />
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">LOGIN</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-700 transition duration-300"
        >
          Log In
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Login;