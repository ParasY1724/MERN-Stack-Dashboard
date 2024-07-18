import React from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <img 
          src={post.creator.profilePic} 
          alt={post.creator.username} 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 border-2 border-blue-500"
        />
        <Link to={`/profile/${post.creator.username}`} className="font-semibold hover:text-blue-500 text-base sm:text-lg text-gray-800">@{post.creator.username}</Link>
      </div>
      
      <Link to={`/forum/post/${post._id}`} className="block mb-3">
        <h2 className="text-xl sm:text-2xl font-bold hover:text-blue-600 transition duration-300">
          {post.title}
        </h2>
      </Link>
      
      {post.mediaURL && (
        <div className="mb-4">
          {post.mediaType === 'image' ? 
            <img 
              src={post.mediaURL} 
              alt="Post" 
              className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:opacity-90 transition duration-300"
            /> :
            <video 
              src={post.mediaURL} 
              controls 
              controlsList='nodownload noplayback' 
              className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:opacity-90 transition duration-300'
            ></video>
          }
        </div>
      )}
      
      <div 
        className="text-gray-700 mb-4 leading-relaxed max-h-36 sm:max-h-48 overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: post.content
        }}
      />
    
      <Link to={`/forum/post/${post._id}`} className="text-sm italic text-blue-500 float-right">view post..</Link>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {post.tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
          >
            # {tag}
          </span>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mt-2">
        <span className="bg-gray-100 px-3 py-1 rounded-full mb-2 sm:mb-0">
          {new Date(post.createdAt).toLocaleString()}
        </span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            {post.comments.length} Comments
          </span>
          <span className="flex items-center">
            {post.likes} Likes
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostItem;