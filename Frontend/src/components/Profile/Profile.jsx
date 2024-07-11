import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile data
    // This is a placeholder, replace with actual API call
    setProfile({
      name: user.username,
      username: user.username,
      about: user.about,
      profilePic: user.profilePic,
      badge: "path/to/badge-svg.svg",
      currentLeague: user.progress.level,
      totalLikes: user.likes.length,
      totalExp: user.progress.exp,
      topPost: {
        title: "My Best Post Ever",
        likes: 250,
        comments: 45
      },
      allPosts: [
        // Add up to 5 most recent posts here
      ],
      leaderboard: [
        // Add leaderboard data here
      ]
    });
  }, [user]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <img src={profile.profilePic} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center">{profile.name}</h1>
          <p className="text-center text-gray-600">@{profile.username}</p>
          <div className="mt-4">
            <h2 className="font-semibold">About:</h2>
            <p>{profile.about}</p>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold">Social Media:</h2>
            {/* Add social media icons here */}
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Share Profile</button>
        </div>

        {/* Middle Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center justify-between">
              <img src={profile.badge} alt="Badge" className="w-16 h-16" />
              <div>
                <p>Current League: {profile.currentLeague}</p>
                <p>Total Likes: {profile.totalLikes}</p>
                <p>Total Exp: {profile.totalExp}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="font-bold mb-2">Your Top Post</h2>
            <h3>{profile.topPost.title}</h3>
            <p>Likes: {profile.topPost.likes}</p>
            <p>Comments: {profile.topPost.comments}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Your All Post List</h2>
              <button className="text-blue-500">View All</button>
            </div>
            {/* Add up to 5 most recent posts here */}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Leaderboard</h2>
              <button className="text-blue-500">View All</button>
            </div>
            {/* Add leaderboard content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;