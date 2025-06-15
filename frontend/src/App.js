// src/App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import AgroBot from './models/AgroBot';
import DataService from './services/DataService';

function App() {
  const [agroBot] = useState(new AgroBot());
  const [robotData, setRobotData] = useState(agroBot.getFormattedData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch robot data on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setError(null);
        
        await agroBot.fetchData();
        
        if (isMounted) {
          setRobotData(agroBot.getFormattedData());
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
          console.error('Error fetching robot data:', err);
        }
      }
    };

    fetchData();
    
    // Set up polling every 5 seconds to get updated data (faster for demo)
    const interval = setInterval(() => {
      if (isMounted) {
        fetchData();
      }
    }, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array is fine now

  const fetchRobotData = async () => {
    try {
      setError(null);
      
      await agroBot.fetchData();
      setRobotData(agroBot.getFormattedData());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching robot data:', err);
    }
  };

  const handleCommand = async (command) => {
    try {
      setError(null);
      const result = await agroBot.sendCommand(command);
      
      if (result.success) {
        // Refresh data after command
        await fetchRobotData();
        console.log(`Command "${command}" executed successfully`);
      } else {
        setError(result.error || 'Command failed');
      }
    } catch (err) {
      setError(`Failed to execute command: ${err.message}`);
      console.error('Error sending command:', err);
    }
  };

  const handleCoordinatesUpdate = async (newCoordinates) => {
    try {
      setError(null);
      const result = await agroBot.updateCoordinates(newCoordinates);
      
      if (result.success) {
        setRobotData(agroBot.getFormattedData());
        console.log('Coordinates updated successfully');
      } else {
        setError(result.error || 'Failed to update coordinates');
      }
    } catch (err) {
      setError(`Failed to update coordinates: ${err.message}`);
      console.error('Error updating coordinates:', err);
    }
  };

  // Show error state only if we can't connect and have no data
  if (error && !robotData.isConnected && isLoading) {
    return (
      <div className="app error-state">
        <div className="error-message">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={fetchRobotData}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Initial loading overlay */}
      {isLoading && !robotData.isConnected && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading AgroBot data...</div>
        </div>
      )}
      
      {/* Error banner (non-blocking) */}
      {error && robotData.isConnected && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {/* Main content */}
      <LeftPanel 
        status={robotData.status}
        battery={robotData.battery || 0}
        isConnected={robotData.isConnected}
        sensors={robotData.sensors || { temperature: 0, humidity: 0, soilMoisture: 0 }}
        workProgress={agroBot.getWorkProgress()}
        alerts={robotData.alerts || []}
        onCommand={handleCommand}
      />
      
      <RightPanel 
        pests={robotData.pests || 0}
        dryness={robotData.dryness || 0}
        coordinates={robotData.coordinates || []}
        lastUpdated={robotData.lastUpdated}
        workArea={robotData.workArea || { totalArea: 0, coveredArea: 0, remainingArea: 0 }}
        onCoordinatesUpdate={handleCoordinatesUpdate}
      />
      
      {/* Connection status indicator */}
      <div className="connection-status">
        <div className={`connection-indicator ${robotData.isConnected ? 'connected' : 'disconnected'}`}></div>
        {robotData.isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}

export default App;