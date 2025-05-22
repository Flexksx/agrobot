import React from 'react';
import '../styles/MapView.css';

const MapView = () => {
  return (
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
  );
};

export default MapView;