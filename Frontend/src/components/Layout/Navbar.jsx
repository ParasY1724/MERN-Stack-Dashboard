import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL; 

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    setIsSearching(true);
    try {
      const response = await fetch(`${API_URL}/auth/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      navigate('/search-results', { state: { searchResults: data, query: searchQuery } });
    } catch (error) {
      console.error('Error searching:', error);
      navigate('/search-results', { state: { searchResults: { users: [], posts: [] }, query: searchQuery } });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderNavLinks = () => (
    <ul className="space-y-2">
      <li><Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">🏠 Home</Link></li>
      <li><Link to="/forum" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">✏️ Create Post</Link></li>
      <li><Link to="/posts" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">📚 All Posts</Link></li>
      {user &&
      <>
        <li><Link to={`/posts/${user.username}`} className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">📝 My Posts</Link></li>
        <li><Link to="/LikedPosts" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">👍 Liked Posts</Link></li>
        <li><Link to="/following" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">👥 My Following</Link></li>
      </>
      }
    </ul>
  );

  return (
    <>
      {/* Left column navbar - visible on larger screens */}
      <nav className="hidden md:block w-64 bg-white h-screen fixed top-0 left-0 overflow-y-auto shadow-lg z-40">
        <div className="p-4 mt-16">
          {renderNavLinks()}
        </div>
      </nav>
    
      <nav>
        <nav className="bg-white border-gray-200 shadow-lg fixed w-full z-50">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://cdn-icons-png.flaticon.com/512/10840/10840187.png" className="h-8 sm:h-10 drop-shadow-md" alt="Logo" />
              <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap text-blue-500 drop-shadow">CodeForum</span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex md:flex-1 md:justify-center md:mx-4 relative">
              <div className="relative w-full max-w-md">
                <input
                  type="search"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button type="submit" className="absolute right-2 top-2 text-blue-500 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </form>

            <div className="flex items-center md:order-2">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button 
                    type="button" 
                    className="flex text-sm bg-orange-500 rounded-full md:me-0 focus:ring-4 focus:ring-orange-300 transition duration-150 ease-in-out transform hover:scale-105"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-1 bg-white" src={user.profilePic} alt="user photo"/>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-500">@{user.username}</p>
                      </div>
                      <Link to={`/profile/${user.username}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Profile</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium transition duration-150 ease-in-out text-sm sm:text-base">Login</Link>
                  <Link to="/register" className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-3 py-1.5 sm:px-5 sm:py-2.5 ml-2 transition duration-150 ease-in-out transform hover:scale-105 shadow-md">Register</Link>
                </div>
              )}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out"
                aria-controls="navbar-user" 
                aria-expanded={isSidebarOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Search Bar and Menu */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 md:hidden`} aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="fixed inset-y-0 left-0 max-w-full flex" ref={sidebarRef}>
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Menu</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 relative flex-1 px-4 sm:px-6">
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <input
                        type="search"
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                      />
                      <button type="submit" className="absolute right-2 top-2 text-orange-500 hover:text-orange-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </form>
                  <nav className="space-y-1">
                    {renderNavLinks()}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;