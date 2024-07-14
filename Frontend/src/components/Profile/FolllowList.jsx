import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function FollowList() {
  const { user } = useContext(AuthContext);
  const { type } = useParams(); // 'followers' or 'following'

  const list = type === 'followers' ? user.progress.followers : user.progress.following;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </h1>
      {list && list.length > 0 ? (
        <ul className="space-y-4">
          {list.map((followUser) => (
            <li key={followUser._id} className="bg-gray-50 rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-lg">
              <Link to={`/profile/${followUser.username}`} className="flex items-center group">
                <img 
                  src={followUser.profilePic} 
                  alt={followUser.username} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-500"
                />
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition duration-300">
                    {followUser.username}
                  </h2>
                  <p className="text-sm text-gray-600">@{followUser.username}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No {type} yet.</p>
          <p className="mt-2 text-gray-500">Start connecting with others to grow your network!</p>
        </div>
      )}
    </div>
  );
}

export default FollowList;