import React from 'react';
import '../styles/StatusInfo.css';

const StatusInfo = ({ pests, dryness }) => {
  return (
    <div className="status-info">
      <div className="status-item">
        <span className="status-dot red-dot">●</span>
        <span>Pests: {pests}</span>
      </div>
      <div className="status-item">
        <span className="status-dot orange-dot">●</span>
        <span>Dryness: {dryness}%</span>
      </div>
    </div>
  );
};

export default StatusInfo;