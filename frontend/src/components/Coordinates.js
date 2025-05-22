import React from 'react';
import '../styles/Coordinates.css';

const Coordinates = ({ coordinates }) => {
  return (
    <div className="coordinates">
      <div className="coord-item">
        <span className="coord-icon red-icon">📍</span>
        <span>Lat: {coordinates[0].lat} Long {coordinates[0].lon}</span>
      </div>
      <div className="coord-item">
        <span className="coord-icon orange-icon">📍</span>
        <span>Lat: {coordinates[1].lat} Long {coordinates[1].lon}</span>
      </div>
    </div>
  );
};

export default Coordinates;