import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import '../styles/RobotStatus.css';

const RobotStatus = () => {
  const [status, setStatus] = useState('Offline');
  const [statusColor, setStatusColor] = useState('#9E9E9E');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create AgroBot instance
  const agroBot = new AgroBot();

  // Function to fetch robot status from AgroBot
  const fetchRobotStatus = async () => {
    try {
      setError(null);
      await agroBot.fetchData();
      setStatus(agroBot.status || 'Offline');
      setStatusColor(agroBot.getStatusColor());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching robot status:', error);
      setError('Failed to load status');
      setStatus('Error');
      setStatusColor('#F44336');
      setIsLoading(false);
    }
  };

  // Fetch robot status on component mount and every 30 seconds
  useEffect(() => {
    fetchRobotStatus(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchRobotStatus();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="status-container">
        <span className="status-label">Status:</span>
        <span className="status-value" style={{ color: '#9E9E9E' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="status-container">
      <span className="status-label">Status:</span>
      <span className="status-value" style={{ color: statusColor }}>
        {error ? 'Connection Error' : status}
      </span>
    </div>
  );
};

export default RobotStatus;