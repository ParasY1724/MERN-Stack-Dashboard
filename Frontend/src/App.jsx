import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import ForumList from './components/Forum/ForumList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="md:pl-72 pt-24"> {/* Padding to avoid overlap */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum" element={<ForumList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
