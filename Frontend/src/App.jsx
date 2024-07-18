// App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import CreatePost from './components/Forum/CreatePost';
import PostDetail from './components/Forum/PostDetail';
import ForumList from './components/Forum/ForumList';
import FollowList from './components/Profile/FolllowList';
import SearchResultsPage from './components/Dashboard/SearchResultsPage';


function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="md:pl-72 pt-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/forum" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/posts" element={<ForumList />} />
            <Route path="/posts/:username" element={<ForumList isLikedPosts = {false}/>} />
            <Route path="/LikedPosts" element={<ForumList isLikedPosts = {true}/>} />
            <Route path="/forum/post/:postId" element={<PostDetail />} />
            <Route path="/:type" element={<PrivateRoute><FollowList /></PrivateRoute>} /> 
          </Routes>
        </div>
      </Router>
    </AuthProvider> 
  );
}

export default App;