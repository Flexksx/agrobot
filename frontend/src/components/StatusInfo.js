import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import '../styles/StatusInfo.css';

const StatusInfo = () => {
  const [botData, setBotData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create AgroBot instance
  const agroBot = new AgroBot();

  // Function to fetch status info data from AgroBot
  const fetchStatusData = async () => {
    try {
      setError(null);
      await agroBot.fetchData();
      setBotData(agroBot.getFormattedData());
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

  // Get pest severity counts
  const getPestSeverityCounts = () => {
    if (!botData?.pestCoordinates) return { low: 0, medium: 0, high: 0 };
    
    return botData.pestCoordinates.reduce((counts, pest) => {
      counts[pest.severity] = (counts[pest.severity] || 0) + 1;
      return counts;
    }, { low: 0, medium: 0, high: 0 });
  };

  // Get dryness level color
  const getDrynessSeverity = (dryness) => {
    if (dryness >= 80) return 'critical';
    if (dryness >= 60) return 'high';
    if (dryness >= 40) return 'medium';
    return 'low';
  };

  // Get battery level color
  const getBatteryLevel = (battery) => {
    if (battery >= 70) return 'good';
    if (battery >= 40) return 'medium';
    if (battery >= 20) return 'low';
    return 'critical';
  };

  // Get temperature level
  const getTemperatureLevel = (temp) => {
    if (temp >= 30) return 'hot';
    if (temp >= 20) return 'normal';
    return 'cold';
  };

  if (isLoading) {
    return (
      <div className="status-info">
        <div className="status-header">
          <h3>Map Legend</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-info">
        <div className="status-header">
          <h3>Map Legend</h3>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  const pestCounts = getPestSeverityCounts();

  return (
    <div className="status-info">
      <div className="status-header">
        <h3>Map Legend</h3>
      </div>
      
      <div className="status-content">
        {/* Robot Status */}
        <div className="status-item">
          <div className={`status-dot robot-status ${botData?.status?.toLowerCase()}`}></div>
          <span className="status-label">Robot: {botData?.status || 'Unknown'}</span>
        </div>

        {/* Battery Level */}
        <div className="status-item">
          <div className={`status-dot battery ${getBatteryLevel(botData?.battery || 0)}`}></div>
          <span className="status-label">Battery: {botData?.battery || 0}%</span>
        </div>

        {/* Total Pests */}
        <div className="status-item">
          <div className="status-dot pest-total"></div>
          <span className="status-label">Total Pests: {botData?.pests || 0}</span>
        </div>

        {/* Pest Severity Breakdown */}
        {pestCounts.high > 0 && (
          <div className="status-item sub-item">
            <div className="status-dot pest-high"></div>
            <span className="status-label">High Severity: {pestCounts.high}</span>
          </div>
        )}
        
        {pestCounts.medium > 0 && (
          <div className="status-item sub-item">
            <div className="status-dot pest-medium"></div>
            <span className="status-label">Medium Severity: {pestCounts.medium}</span>
          </div>
        )}
        
        {pestCounts.low > 0 && (
          <div className="status-item sub-item">
            <div className="status-dot pest-low"></div>
            <span className="status-label">Low Severity: {pestCounts.low}</span>
          </div>
        )}

        {/* Dryness Level */}
        <div className="status-item">
          <div className={`status-dot dryness ${getDrynessSeverity(botData?.dryness || 0)}`}></div>
          <span className="status-label">Dryness: {botData?.dryness || 0}%</span>
        </div>

        {/* Temperature */}
        <div className="status-item">
          <div className={`status-dot temperature ${getTemperatureLevel(botData?.sensors?.temperature || 0)}`}></div>
          <span className="status-label">Temperature: {botData?.sensors?.temperature || 0}°C</span>
        </div>

        {/* Humidity */}
        <div className="status-item">
          <div className="status-dot humidity"></div>
          <span className="status-label">Humidity: {botData?.sensors?.humidity || 0}%</span>
        </div>

        {/* Soil Moisture */}
        <div className="status-item">
          <div className="status-dot soil-moisture"></div>
          <span className="status-label">Soil Moisture: {botData?.sensors?.soilMoisture || 0}%</span>
        </div>

        {/* Work Progress */}
        <div className="status-item">
          <div className="status-dot work-progress"></div>
          <span className="status-label">Work Progress: {agroBot.getWorkProgress()}%</span>
        </div>

        {/* Active Alerts */}
        {botData?.alerts && agroBot.getActiveAlertsCount() > 0 && (
          <div className="status-item">
            <div className="status-dot alert-active"></div>
            <span className="status-label">Active Alerts: {agroBot.getActiveAlertsCount()}</span>
          </div>
        )}

        {/* Last Updated */}
        <div className="status-item last-updated">
          <span className="status-label">Last Updated: {agroBot.getTimeSinceUpdate()}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusInfo;