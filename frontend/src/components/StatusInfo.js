import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import '../styles/StatusInfo.css';

const StatusInfo = () => {
  const [pests, setPests] = useState(0);
  const [dryness, setDryness] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create AgroBot instance
  const agroBot = new AgroBot();

  // Function to fetch status info data from AgroBot
  const fetchStatusData = async () => {
    try {
      setError(null);
      await agroBot.fetchData();
      setPests(agroBot.pests || 0);
      setDryness(agroBot.dryness || 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching status data:', error);
      setError('Failed to load status data');
      setIsLoading(false);
    }
  };

  // Fetch status data on component mount and every 30 seconds
  useEffect(() => {
    fetchStatusData(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchStatusData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Remove all rendering - component will not display anything
  return null;
};

export default StatusInfo;