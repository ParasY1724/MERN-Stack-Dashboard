import React from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 p-6">
      <div className="flex items-center mb-4">
        <img 
          src={post.creator.profilePic} 
          alt={post.creator.username} 
          className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500"
        />
        <Link to={`/profile/${post.creator.username}`} className="font-semibold hover:text-blue-500 text-lg text-gray-800">@{post.creator.username}</Link>
      </div>
      <Link to={`/forum/post/${post._id}`} className="block">
        <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition duration-300">
          {post.title}
        </h2>
      </Link>
      
      <div className='flex space-x-6'>
        {post.mediaURL && (
          (post.mediaType === 'image' ? 
            <img 
              src={post.mediaURL} 
              alt="Post" 
              className="w-40 h-40 object-cover rounded-lg shadow-md mb-4 hover:opacity-90 transition duration-300"
            /> :
            <video 
              src={post.mediaURL} 
              controls 
              controlsList='nodownload noplayback' 
              className='w-40 h-40 object-cover rounded-lg shadow-md mb-4 hover:opacity-90 transition duration-300'
            ></video>
          )
        )}
        <div 
          className="text-gray-700 mb-4 leading-relaxed max-h-72 overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: post.content
          }}
        />
      </div>
    
      <Link to={`/forum/post/${post._id}`} className="text-sm italic text-blue-500 float-right">view post..</Link>
      
      <div className="flex items-center space-x-2 mb-4">
        {post.tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
          >
            # {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <div className="flex items-center space-x-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            {new Date(post.createdAt).toLocaleString()}
          </span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              {post.comments.length} Comments
            </span>
            <span className="flex items-center">
              {post.likes} Likes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
