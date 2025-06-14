import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import '../styles/Battery.css';

const Battery = () => {
  const [battery, setBattery] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create AgroBot instance
  const agroBot = new AgroBot();

  // Function to fetch battery data from AgroBot
  const fetchBatteryData = async () => {
    try {
      setError(null);
      await agroBot.fetchData();
      setBattery(agroBot.battery);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching battery data:', error);
      setError('Failed to load battery data');
      setIsLoading(false);
    }
  };

  // Fetch battery data on component mount and every 30 seconds
  useEffect(() => {
    fetchBatteryData(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchBatteryData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to get battery color based on percentage
  const getBatteryColor = (battery) => {
    if (battery >= 75) return '#4CAF50'; // Green
    if (battery >= 25) return '#FFD700'; // Yellow
    return '#FF4444'; // Red
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="battery-container">
        <div className="battery-bar">
          <div className="battery-fill" style={{ width: '0%', backgroundColor: '#ccc' }}></div>
        </div>
        <span className="battery-text">Loading...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="battery-container">
        <div className="battery-bar">
          <div className="battery-fill" style={{ width: '0%', backgroundColor: '#FF4444' }}></div>
        </div>
        <span className="battery-text" style={{ color: '#FF4444' }}>Error</span>
      </div>
    );
  }

  return (
    <div className="battery-container">
      <div className="battery-bar">
        <div 
          className="battery-fill" 
          style={{ 
            width: `${battery}%`,
            backgroundColor: getBatteryColor(battery)
          }}
        ></div>
      </div>
      <span 
        className="battery-text"
        style={{ color: getBatteryColor(battery) }}
      >
        {battery}%
      </span>
    </div>
  );
};

export default Battery;