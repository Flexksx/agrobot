import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';

function Coordinates() {
  const [coordinates, setCoordinates] = useState([]);
  const [pestCoordinates, setPestCoordinates] = useState([]);
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
      setPestCoordinates(agroBot.pestCoordinates || []);
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

  // Remove all rendering - component will not display anything
  return null;
}

export default Coordinates;