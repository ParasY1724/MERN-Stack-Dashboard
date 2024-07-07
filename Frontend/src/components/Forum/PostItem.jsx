import React, { useState } from 'react';

function PostItem({ post }) {
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    // Fetch comments for this post
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>By: {post.author} on {post.timestamp}</p>
      <button onClick={fetchComments}>Show Comments</button>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>By: {comment.author} on {comment.timestamp}</p>
        </div>
      ))}
    </div>
  );
}

export default PostItem;