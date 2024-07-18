import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/feed/recent_post`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent posts');
      }

      const data = await response.json();
      setRecentPosts(data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

 

  return (
    <div className="dashboard bg-gray-50 flex flex-col md:flex-row gap-4 p-4">
      <div className="md:w-2/3">
        <section className="recent-posts rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Forum Posts</h2>
          {recentPosts.length > 0 ? (
            <div className='space-y-6'>
              {recentPosts.map(post => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p>No recent posts.</p>
          )}
          <Link to="/posts" className="block text-blue-500 mt-4">View All Posts</Link>
        </section>
      </div>
      
      <div className="md:w-1/3">
        <section className="quick-actions bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <Link to="/forum/" className="block mb-2 text-blue-500">Create New Post</Link>
          <Link to="/profile" className="block text-blue-500">View Profile</Link>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;