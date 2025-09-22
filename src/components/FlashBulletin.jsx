import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlashBulletin.css';

const FlashBulletin = () => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBulletinIndex, setCurrentBulletinIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Fetch flash bulletins
  const fetchBulletins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications/flash-bulletins');
      setBulletins(response.data.bulletins || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching flash bulletins:', err);
      setError('Failed to load safety bulletins');
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll through bulletins
  useEffect(() => {
    if (bulletins.length <= 1 || !isAutoScrollEnabled) return;

    const interval = setInterval(() => {
      setCurrentBulletinIndex((prev) => (prev + 1) % bulletins.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [bulletins.length, isAutoScrollEnabled]);

  // Fetch bulletins on component mount and refresh every 2 minutes
  useEffect(() => {
    fetchBulletins();
    
    const refreshInterval = setInterval(fetchBulletins, 2 * 60 * 1000); // Refresh every 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flash-bulletin-container loading">
        <div className="bulletin-loading">
          <div className="loading-spinner">🌊</div>
          <span>Loading safety bulletins...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && bulletins.length === 0) {
    return (
      <div className="flash-bulletin-container error">
        <div className="bulletin-error">
          <span className="error-icon">⚠️</span>
          <span>Unable to load safety bulletins</span>
          <button onClick={fetchBulletins} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No bulletins available
  if (bulletins.length === 0) {
    return null; // Don't render if no bulletins
  }

  const currentBulletin = bulletins[currentBulletinIndex];

  const handlePrevious = () => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex((prev) => 
      prev === 0 ? bulletins.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex((prev) => (prev + 1) % bulletins.length);
  };

  const handleDotClick = (index) => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex(index);
  };

  return (
    <div className="flash-bulletin-container">
      <div 
        className={`flash-bulletin ${currentBulletin.severity}`}
        style={{ '--bulletin-color': currentBulletin.color }}
      >
        {/* Header */}
        <div className="bulletin-header">
          <div className="bulletin-icon">
            {currentBulletin.icon}
          </div>
          <div className="bulletin-title-section">
            <h3 className="bulletin-title">{currentBulletin.title}</h3>
            <span className="bulletin-area">{currentBulletin.affectedAreas}</span>
          </div>
          <div className="bulletin-severity">
            <span className={`severity-badge ${currentBulletin.severity}`}>
              {currentBulletin.severity.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="bulletin-message">
          <p>{currentBulletin.message}</p>
        </div>

        {/* Action Items */}
        {currentBulletin.actionItems && currentBulletin.actionItems.length > 0 && (
          <div className="bulletin-actions">
            <h4>Safety Guidelines:</h4>
            <ul>
              {currentBulletin.actionItems.slice(0, 3).map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="bulletin-footer">
          <div className="bulletin-timestamp">
            Last updated: {new Date(currentBulletin.timestamp).toLocaleTimeString()}
          </div>
          <div className="bulletin-expires">
            Valid until: {new Date(currentBulletin.expiresAt).toLocaleTimeString()}
          </div>
        </div>

        {/* Navigation controls */}
        {bulletins.length > 1 && (
          <div className="bulletin-controls">
            <button 
              className="bulletin-nav prev"
              onClick={handlePrevious}
              aria-label="Previous bulletin"
            >
              ‹
            </button>
            
            <div className="bulletin-indicators">
              {bulletins.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentBulletinIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to bulletin ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="bulletin-nav next"
              onClick={handleNext}
              aria-label="Next bulletin"
            >
              ›
            </button>
          </div>
        )}

        {/* Auto-scroll indicator */}
        {bulletins.length > 1 && isAutoScrollEnabled && (
          <div className="auto-scroll-indicator">
            <div className="auto-scroll-progress"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashBulletin;