import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ScoreTracker from './ScoreTracker';

function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile data
  }, [user]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <ScoreTracker score={profile.score} />
      {/* Add social media sharing buttons here */}
    </div>
  );
}

export default Profile;