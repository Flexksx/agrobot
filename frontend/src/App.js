import React, { useState, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [robotStatus, setRobotStatus] = useState({
    battery: 100,
    status: 'Pause',
    pests: 6,
    dryness: 70,
    coordinates: [
      { lat: 46.77, lon: 23.06 },
      { lat: 38.86, lon: 28.52 }
    ]
  });

  return (
    <div className="app">
      {/* Left Panel - Robot Status */}
      <div className="left-panel">
        <div className="robot-section">
          <h2 className="section-title">
            <span className="agro-text">Agro</span>
            <span className="bot-text">Bot</span>
          </h2>
          
          {/* Robot Image */}
          <div className="robot-image-container">
            <img src="/api/placeholder/300/300" alt="Agrobot" className="robot-image" />
          </div>
          
          {/* Battery Status */}
          <div className="battery-container">
            <div className="battery-bar">
              <div 
                className="battery-fill" 
                style={{ width: `${robotStatus.battery}%` }}
              ></div>
            </div>
            <span className="battery-text">{robotStatus.battery}%</span>
          </div>
          
          {/* Status */}
          <div className="status-container">
            <span className="status-label">Status:</span>
            <span className="status-value">{robotStatus.status}</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Map and Controls */}
      <div className="right-panel">
        {/* Control Buttons */}
        <div className="control-buttons">
          <button className="start-btn">
            <div className="play-icon">▶</div>
            Start
          </button>
          <button className="back-btn">
            <div className="back-icon">↶</div>
            Back to Station
          </button>
        </div>

        {/* Map Container */}
        <div className="map-container">
          <img src="/api/placeholder/600/400" alt="Satellite Map" className="map-image" />
          
          {/* Overlays for coordinates */}
          <div className="coordinate-overlays">
            <div className="coordinate-point red-point" style={{ top: '60%', left: '20%' }}>
              <div className="point-marker"></div>
            </div>
            <div className="coordinate-point orange-point" style={{ top: '40%', right: '15%' }}>
              <div className="point-marker"></div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="status-info">
          <div className="status-item">
            <span className="status-dot red-dot">●</span>
            <span>Pests: {robotStatus.pests}</span>
          </div>
          <div className="status-item">
            <span className="status-dot orange-dot">●</span>
            <span>Dryness: {robotStatus.dryness}%</span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="coordinates">
          <div className="coord-item">
            <span className="coord-icon red-icon">📍</span>
            <span>Lat: {robotStatus.coordinates[0].lat} Long {robotStatus.coordinates[0].lon}</span>
          </div>
          <div className="coord-item">
            <span className="coord-icon orange-icon">📍</span>
            <span>Lat: {robotStatus.coordinates[1].lat} Long {robotStatus.coordinates[1].lon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;