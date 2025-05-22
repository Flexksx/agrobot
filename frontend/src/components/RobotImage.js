import React from 'react';
import '../styles/RobotImage.css';
import agrobotImage from '../assets/agrobot.png';

const RobotImage = () => {
  return (
    <div className="robot-image-container">
      <img src={agrobotImage} alt="Agrobot" className="robot-image" />
    </div>
  );
};

export default RobotImage;