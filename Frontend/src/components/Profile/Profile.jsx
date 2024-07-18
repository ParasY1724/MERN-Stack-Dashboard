import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useParams, Link } from 'react-router-dom';
import badge1 from '../../assets/badge-1.png';
import badge2 from '../../assets/badge-2.png';
import badge3 from '../../assets/badge-3.png';
import badge4 from '../../assets/badge-4.png';
import badge5 from '../../assets/badge-5.png';
import badge6 from '../../assets/badge-6.png';


const badgesArray = [badge1,badge2,badge3,badge4,badge5,badge6];

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const { user: currentUser } = useContext(AuthContext);
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowed , setisFollowed] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      let userData;
      if (!currentUser || currentUser.username !== username) {
        const response = await fetch(`${API_URL}/auth/users/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        userData = await response.json();
        setisFollowed(userData.isFollowed);
        userData = userData.user;
      } else {
        userData = currentUser;
      }

      const postsResponse = await fetch(`${API_URL}/feed/posts/${userData.username}`);
      if (!postsResponse.ok) throw new Error('Failed to fetch user posts');
      const postsData = await postsResponse.json();
      setProfile({
        ...userData,
        allPosts: postsData.posts.slice(0, 4),
        topPost: postsData.posts.reduce((max, post) => post.likes > max.likes ? post : max, postsData.posts[0] || {}),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/auth/toggle-follow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },  
        body: JSON.stringify({ followId: profile._id.toString() })
      });
      if (!response.ok) throw new Error('Failed to Follow/Unfollow');
      
      setisFollowed(prevIsFollowed => !prevIsFollowed);
      setProfile(prevProfile => ({
        ...prevProfile,
        progress: {
          ...prevProfile.progress,
          followers: prevProfile.progress.followers + (isFollowed ? -1 : 1)
        }
      }));
    }
    catch (err) {
      setError(err.message);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s Profile`,
        url: window.location.href
      })
      .then(() => console.log('Profile shared successfully'))
      .catch((error) => console.error('Error sharing profile:', error));
    } else {
      setError('Web Share API is not supported in your browser.');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-8">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="bg-white p-4 rounded-lg shadow">
          <img src={profile.profilePic} alt="Profile" className="w-28 h-28 rounded-full mx-auto mb-3 border-2 border-blue-500" />
          <h1 className="text-xl font-bold text-center text-gray-800">{profile.name}</h1>
          <p className="text-center text-gray-600 text-sm mb-3">@{profile.username}</p>
          <div className="flex justify-center space-x-6 mb-3">
            {(!currentUser || currentUser.username !== profile.username) ? (
              <>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{profile.progress.followers || 0}</p>
                  <p className="text-xs text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{profile.progress.following || 0}</p>
                  <p className="text-xs text-gray-600">Following</p>
                </div>
              </>
            ) : (
              <>
                <Link to='/followers' className="text-center hover:text-blue-600 transition">
                  <p className="font-bold">{profile.progress.followers ? profile.progress.followers.length : 0}</p>
                  <p className="text-xs text-gray-600">Followers</p>
                </Link>
                <Link to='/following' className="text-center hover:text-blue-600 transition">
                  <p className="font-bold">{profile.progress.following ? profile.progress.following.length : 0}</p>
                  <p className="text-xs text-gray-600">Following</p>
                </Link>
              </>
            )}
          </div>
          <div className="mb-3">
            <h2 className="font-semibold text-sm mb-1 text-gray-700">About:</h2>
            <p className="text-xs text-gray-600">{profile.about || 'No bio available'}</p>
          </div>
          
          <div className="mb-3">
            <h2 className="font-semibold text-sm mb-1 text-gray-700">Social Media:</h2>
            <div className="flex space-x-2 justify-center">
              {profile.socialURL && profile.socialURL.length > 0 ? (
                <>
                  {profile.socialURL.find(url => url.includes('github')) && (
                    <a href={profile.socialURL.find(url => url.includes('github'))} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR27kaHyBN4-iwj7H4pMmnE7kaC720Y-PYzKQ&s" alt="GitHub" className="w-6 h-6" />
                    </a>
                  )}
                  {profile.socialURL.find(url => url.includes('linkedin')) && (
                    <a href={profile.socialURL.find(url => url.includes('linkedin'))} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png" alt="LinkedIn" className="w-6 h-6" />
                    </a>
                  )}
                  {profile.socialURL.find(url => url.includes('instagram')) && (
                    <a href={profile.socialURL.find(url => url.includes('instagram'))} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-6 h-6" />
                    </a>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500">No social media links available</p>
              )}
            </div>
          </div>

          {currentUser && currentUser.username !== profile.username && (
            <button 
              onClick={handleFollow} 
              className="w-full bg-blue-500 text-white py-1.5 rounded text-sm hover:bg-blue-600 transition duration-300 mb-1"
            >
              {(isFollowed ? 'Unfollow' : 'Follow')}
            </button>
          )}
          <button 
            onClick={handleShare} 
            className="w-full bg-gray-200 text-gray-800 py-1.5 rounded text-sm hover:bg-gray-300 transition duration-300">
            Share Profile
          </button>
        </div>

        {/* Middle Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm font-semibold mb-2">Badges Achieved</p>
            <div className="flex items-center justify-between mb-3">
              <div className='flex space-x-1'>
                {badgesArray.slice(0, Math.min(parseInt(profile.progress.exp / 100), badgesArray.length - 1) + 1).map((badge, index) => (
                  <img key={index} src={badge} alt={`Badge ${index + 1}`} className="w-auto h-20 object-contain" />
                ))}
              </div>
            </div>
            <div className='flex justify-between text-sm mb-1'>
              <p className="font-semibold text-blue-600">Level {profile.progress.level}</p>
              <p className="text-gray-600">Total Exp: {profile.progress.exp}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(profile.progress.exp % 100)}%` }}></div>
            </div>
          </div>

          {profile.topPost && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-2 text-gray-800">Your Top Post</h2>
              <h3 className="text-md font-semibold text-blue-600 mb-1">{profile.topPost.title}</h3>
              <p className="text-xs text-gray-600">Likes: {profile.topPost.likes} | Comments: {profile.topPost.comments?.length || 0}</p>
              <Link to={`/forum/post/${profile.topPost._id}`} className="text-sm text-blue-500 hover:underline">View Post →</Link>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg text-gray-800">Your Recent Posts</h2>
              <Link to={`/posts/${profile.username}`} className="text-sm text-blue-500 hover:underline">View All →</Link>
            </div>
            {profile.allPosts.map(post => (
              <div key={post._id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                <Link to={`/forum/post/${post._id}`} className="font-semibold text-sm hover:text-blue-500 transition">{post.title}</Link>
                <p className="text-xs text-gray-600">Likes: {post.likes} | Comments: {post.comments?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;