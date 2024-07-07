import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // For example:
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user.token}`
      //   },
      //   body: JSON.stringify({ title, content })
      // });
      // if (response.ok) {
      //   // Handle successful post creation
      //   setTitle('');
      //   setContent('');
      // } else {
      //   throw new Error('Failed to create post');
      // }

      // For now, we'll just log the post data
      console.log('New post:', { title, content });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Post</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;