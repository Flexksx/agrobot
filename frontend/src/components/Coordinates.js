import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';

function Coordinates() {
  const [coordinates, setCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create AgroBot instance
  const agroBot = new AgroBot();

  // Function to fetch coordinates data from AgroBot
  const fetchCoordinatesData = async () => {
    try {
      setError(null);
      await agroBot.fetchData();
      setCoordinates(agroBot.coordinates || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching coordinates data:', error);
      setError('Failed to load coordinates data');
      setIsLoading(false);
    }
  };

  // Fetch coordinates data on component mount and every 30 seconds
  useEffect(() => {
    fetchCoordinatesData(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchCoordinatesData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="coordinates">
        <h3>Robot Coordinates</h3>
        <p>Loading coordinates...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="coordinates">
        <h3>Robot Coordinates</h3>
        <p className="error">{error}</p>
      </div>
    );
  }

  // Safety check for coordinates
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
    return (
      <div className="coordinates">
        <h3>Robot Coordinates</h3>
        <p>No coordinates available</p>
      </div>
    );
  }

  return (
    <div className="coordinates">
      <h3>Robot Coordinates</h3>
      <div className="coordinates-list">
        {coordinates.map((coord, index) => {
          // Safety check for each coordinate object
          if (!coord || typeof coord.lat === 'undefined' || typeof coord.lon === 'undefined') {
            return (
              <div key={index} className="coordinate-item error">
                <span>Invalid coordinate #{index + 1}</span>
              </div>
            );
          }

          return (
            <div key={index} className="coordinate-item">
              <span className="coordinate-label">Point {index + 1}:</span>
              <span className="coordinate-value">
                {coord.lat.toFixed(4)}°, {coord.lon.toFixed(4)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Coordinates;