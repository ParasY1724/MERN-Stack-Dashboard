import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import PostItem from '../Forum/PostItem';

const API_URL = 'http://localhost:8080'; // Replace with your actual API URL

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [recentPosts, setRecentPosts] = useState([]);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchRecentPosts();
    }
  }, [user]);

  const fetchUserData = async () => {
    // try {
    //   const token = localStorage.getItem('token');
    //   const response = await fetch(`${API_URL}/api/users/stats`, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch user stats');
    //   }
    //   const data = await response.json();
    //   setUserStats(data);
    // } catch (error) {
    //   console.error('Error fetching user data:', error);
    // }
  };

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

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="dashboard flex flex-col md:flex-row gap-4 p-4">
      <div className="md:w-2/3">
        <section className="recent-posts bg-white shadow-md rounded-lg p-4">
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
          <Link to="/posts" className="block text-orange-500 mt-4">View All Posts</Link>
        </section>
      </div>
      
      <div className="md:w-1/3">
        <section className="user-stats bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Your Activity</h2>
          {userStats ? (
            <div>
              <p>Posts: 0</p>
              <p>Comments: 0</p>
            </div>
          ) : (
            <p>Loading user stats...</p>
          )}
        </section>

        <section className="quick-actions bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <Link to="/forum/new" className="block mb-2 text-orange-500">Create New Post</Link>
          <Link to="/profile" className="block text-orange-500">View Profile</Link>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;