import React from 'react';
import '../styles/LeftPanel.css';
import RobotImage from './RobotImage';
import Battery from './Battery';
import RobotStatus from './RobotStatus';
import StatusInfo from './StatusInfo';

const LeftPanel = () => {
  return (
    <div className="left-panel">
      <div className="robot-section">
        <h2 className="section-title">
          <span className="agro-text">Agro</span>
          <span className="bot-text">Bot</span>
        </h2>
        
        <RobotImage />
        <Battery />
        <RobotStatus />
        <StatusInfo />
      </div>
    </div>
  );
};

export default LeftPanel;