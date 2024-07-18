import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the import path as needed
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_BACKEND_URL;

function PostDetail() {
  const [data, setData] = useState(null);
  const [comment, setComment] = useState('');
  const { postId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/feed/post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) { 
        throw new Error('Failed to fetch post');
      }
      const res_data = await response.json();
      setData(res_data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/feed/like-post/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      fetchPost(); // Refetch post to update like status
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/feed/like-comment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      fetchPost(); // Refetch post to update like status
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/feed/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: comment })
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setComment('');
      fetchPost(); // Refetch post to update comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <img src={data.post.creator.profilePic} alt={data.post.creator.username} className="w-10 h-10 rounded-full mr-2 " />
          <Link to={`/profile/${data.post.creator.username}`} className="font-semibold hover:text-blue-500  ">@{data.post.creator.username}</Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">{data.post.title}</h1>
        {data.post.mediaURL && (
          (data.post.mediaType === "image" ? <img src={data.post.mediaURL} alt="Post" className="w-full h-80 object-contain rounded-md mb-4" /> :
            <video controls="controls" controlsList="nodownload noremoteplayback" src={data.post.mediaURL}  className="w-full h-80 object-contain rounded-md mb-4"></video>
          )
          
        )}
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: data.post.content }}></div>
        <div className="flex items-center space-x-2 mb-4">
          {data.post.tags && data.post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              # {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(data.post.createdAt).toLocaleString()}</span>
          <button 
            onClick={handleLike}
            className={`flex items-center ${data.isLiked ? 'text-blue-500' : ''}`}
          >
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {data.post.likes} Likes
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Add a comment..."
            rows="3"
          ></textarea>
          <button type="submit" className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Post Comment
          </button>
        </form>
        <div className="space-y-4">
          {data.post.comments.map((comment) => (
            <div key={comment._id} className="border-b pb-2">
              <div className="flex items-center mb-2">
                <img src={comment.profilePic} alt={comment.username} className="w-8 h-8 rounded-full mr-2" />
                <Link to={`/profile/${comment.username}`} className="font-semibold hover:text-blue-500">{comment.username}</Link>
              </div>
              <p>{comment.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                <button  onClick={() => {handleCommentLike(comment._id)}}  className={`flex items-center ${comment.isLikedByCurrentUser ? 'text-blue-500' : ''}`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {comment.likedBy} Likes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;