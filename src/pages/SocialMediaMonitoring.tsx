import React, { useState } from 'react';
import './SocialMediaMonitoring.css';

interface Tweet {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

const mockTweets: Tweet[] = [
  {
    id: 1,
    user: 'user123',
    content: 'Just felt a huge tremor in downtown! Everyone okay? #earthquake',
    timestamp: '2m ago',
  },
  {
    id: 2,
    user: 'reporter_jane',
    content: 'Reports of a wildfire spreading near the northern hills. Emergency services are on their way. #wildfire',
    timestamp: '5m ago',
  },
  {
    id: 3,
    user: 'concerned_citizen',
    content: 'My street is completely flooded. We need help! #flood',
    timestamp: '10m ago',
  },
];

const SocialMediaMonitoring: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>(mockTweets);
  const [filter, setFilter] = useState('');

  const filteredTweets = tweets.filter(
    (tweet) =>
      tweet.content.toLowerCase().includes(filter.toLowerCase()) ||
      tweet.user.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="social-media-monitoring-page">
      <header className="page-header">
        <h1>Social Media Monitoring</h1>
        <p>Real-time feed from social channels.</p>
      </header>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by keyword or user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="tweet-feed">
        {filteredTweets.length > 0 ? (
          filteredTweets.map((tweet) => (
            <div key={tweet.id} className="tweet-card">
              <div className="tweet-header">
                <span className="tweet-user">@{tweet.user}</span>
                <span className="tweet-timestamp">{tweet.timestamp}</span>
              </div>
              <p className="tweet-content">{tweet.content}</p>
            </div>
          ))
        ) : (
          <p>No tweets match your filter.</p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaMonitoring;
