import React from 'react';
import '../styles/RightPanel.css';
import ControlButtons from './ControlButtons';
import MapView from './MapView';
import StatusInfo from './StatusInfo';
import Coordinates from './Coordinates';

const RightPanel = ({ pests, dryness, coordinates }) => {
  return (
    <div className="right-panel">
      <ControlButtons />
      <MapView />
      <StatusInfo pests={pests} dryness={dryness} />
      <Coordinates coordinates={coordinates} />
    </div>
  );
};

export default RightPanel;