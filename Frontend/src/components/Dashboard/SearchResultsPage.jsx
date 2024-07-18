import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SearchResultsPage() {
  const location = useLocation();
  const { searchResults, query } = location.state || { searchResults: { users: [], posts: [] }, query: '' };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {searchResults.users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.users.map(user => (
              <Link
                key={user._id}
                to={`/profile/${user.username}`}
                className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        {searchResults.posts.length > 0 ? (
          <div className="space-y-4">
            {searchResults.posts.map(post => (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg">{post.title}</h3>
                <p className="text-sm text-gray-500">By @{post.creator.username}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;