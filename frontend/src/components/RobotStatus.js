import React from 'react';
import '../styles/RobotStatus.css';

const RobotStatus = ({ status }) => {
  return (
    <div className="status-container">
      <span className="status-label">Status:</span>
      <span className="status-value">{status}</span>
    </div>
  );
};

export default RobotStatus;