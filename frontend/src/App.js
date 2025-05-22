import React, { useState } from 'react';
import './styles/App.css';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [robotStatus, setRobotStatus] = useState({
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
      <LeftPanel status={robotStatus.status} />
      <RightPanel 
        pests={robotStatus.pests}
        dryness={robotStatus.dryness}
        coordinates={robotStatus.coordinates}
      />
    </div>
  );
}

export default App;