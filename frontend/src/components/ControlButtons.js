import React from 'react';
import '../styles/ControlButtons.css';

const ControlButtons = () => {
  return (
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
  );
};

export default ControlButtons;