import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import CreatePost from './CreatePost';

function ForumList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from API
  }, []);

  return (
    <div>
      <h1>Community Forum</h1>
      <CreatePost />
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default ForumList;