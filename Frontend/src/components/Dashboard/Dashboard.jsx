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
    <div className="dashboard">
      <h1>Welcome, {user.username}!</h1>
      
      <section className="user-stats">
        <h2>Your Activity</h2>
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

      <section className="recent-posts">
        <h2>Recent Forum Posts</h2>
        {recentPosts.length > 0 ? (
          <ul>
            {recentPosts.map(post => (
              <li key={post.id}>
                <Link to={`/forum/post/${post.id}`}>{post.title}</Link> by {post.author}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent posts.</p>
        )}
        <Link to="/forum">View All Posts</Link>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <Link to="/forum/new">Create New Post</Link>
        <Link to="/profile">View Profile</Link>
      </section>
    </div>
  );
}

export default Dashboard;