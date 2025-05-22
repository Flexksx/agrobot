import React, { useState, useEffect } from 'react';
import '../styles/Battery.css';

const Battery = () => {
  const [battery, setBattery] = useState(100);

  // Function to fetch battery data
  const fetchBatteryData = async () => {
    try {
      const response = await fetch('/data/battery.json');
      const data = await response.json();
      setBattery(data.battery);
    } catch (error) {
      console.error('Error fetching battery data:', error);
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