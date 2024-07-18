import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostItem from './PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;




function ForumList({isLikedPosts}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {username} = useParams();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feed/posts/${username ? username : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLikedPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feed/likedPosts`,{
        headers : {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch liked posts');
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isLikedPosts){
      fetchLikedPosts();
    }
    else{
      fetchPosts();
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{isLikedPosts ? `Your Liked Posts` : `Forum Posts`}</h1>
        
        <Link 
          to="/forum/create" 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Create New Post
        </Link>
      </div>
      <div className="space-y-6">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default ForumList;