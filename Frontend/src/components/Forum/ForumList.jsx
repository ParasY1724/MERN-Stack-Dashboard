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
      <CreatePost />
    </div>
  );
}

export default ForumList;