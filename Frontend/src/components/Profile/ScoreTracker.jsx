import React from 'react';

function ScoreTracker({ score }) {
  return (
    <div>
      <h2>Your Score</h2>
      <p>{score} points</p>
      {/* Add achievements display here */}
    </div>
  );
}

export default ScoreTracker;