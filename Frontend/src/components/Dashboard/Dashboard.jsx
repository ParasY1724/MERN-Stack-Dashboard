import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ScoreTracker from '../Profile/ScoreTracker';

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
    try {
      // In a real application, you would make an API call here
      // const response = await fetch(`/api/users/${user.id}/stats`);
      // const data = await response.json();
      // setUserStats(data);

      // For now, we'll use mock data
      setUserStats({
        postsCount: 5,
        commentsCount: 10,
        score: 100,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      // In a real application, you would make an API call here
      // const response = await fetch('/api/posts/recent');
      // const data = await response.json();
      // setRecentPosts(data);

      // For now, we'll use mock data
      setRecentPosts([
        { id: 1, title: 'First post', author: 'User1' },
        { id: 2, title: 'Second post', author: 'User2' },
        { id: 3, title: 'Third post', author: 'User3' },
      ]);
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
            <ul>
              {recentPosts.map(post => (
                <li key={post.id} className="mb-2">
                  <Link to={`/forum/post/${post.id}`} className="text-orange-500">{post.title}</Link> by {post.author}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent posts.</p>
          )}
          <Link to="/forum" className="block text-orange-500 mt-4">View All Posts</Link>
        </section>
      </div>
      
      <div className="md:w-1/3">
        <section className="user-stats bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Your Activity</h2>
          {userStats ? (
            <div>
              <p>Posts: {userStats.postsCount}</p>
              <p>Comments: {userStats.commentsCount}</p>
              <ScoreTracker score={userStats.score} />
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
  