import React, { useState, useEffect } from 'react';

interface TVProps {
  onClose: () => void;
}

const TV: React.FC<TVProps> = ({ onClose }) => {
  const [tvStatus, setTvStatus] = useState("Open Mode");
  const [operatingLevel, setOperatingLevel] = useState("100%");
  const [tvState, setTvState] = useState("State 1");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTVStatus = async () => {
      try {
        const response = await fetch('/api/car_status?section=TVSystem');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.TVSystem) {
          throw new Error('Invalid data structure');
        }
        
        setTvStatus(data.TVSystem.stateLevel.status);
        setOperatingLevel(data.TVSystem.stateLevel.operatingLevel);
        setTvState(data.TVSystem.tvStatus.state);
        setError("");
      } catch (error) {
        console.error('Error fetching TV status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchTVStatus();
    const interval = setInterval(fetchTVStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="bywire-system-container">
        <div className="status-row">
          <span className="panel-title">TV State Level</span>
        </div>
        <br></br>
        <div className="status-row">
          <div className="status-label2-tv">Status (Off/Mid/Open)</div>
          <span className="status-label4">Operating Level</span>
          <span className="status-mode">{tvStatus}</span>
          <span className="status-value1">{operatingLevel}</span>
        </div>
      </div>

      <div className="bywire-system-section">
        <div className="status-row">
          <span className="panel-title">TV Status</span>
        </div>
        <div className="status-row">
          <span className="status-label5">Status (Moving Up/Moving </span>  
          <span className="status-value2">{tvState}</span>
        </div>          
        <span className="status-label6">Down/State 1/State 2/State3)</span>  
        <div className="bywire-line"></div>
      </div>

      <div className="car-container2">
        <img src="/images_diag/car-model.svg" alt="Car Model" />
      </div>
    </div>
  );
};

export default TV;