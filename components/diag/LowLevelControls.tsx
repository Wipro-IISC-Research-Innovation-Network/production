import React, { useState, useEffect } from "react";

const LowLevelControls: React.FC = () => {
  const [autonomousStatus, setAutonomousStatus] = useState("ENABLED");
  const [manualModeStatus, setManualModeStatus] = useState("DISABLED");
  const [hardwareModeStatus, setHardwareModeStatus] = useState("ACTIVE");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchControlStatus = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=LowLevelControls');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.LowLevelControls) {
          throw new Error('Invalid data structure');
        }
        
        setAutonomousStatus(data.LowLevelControls.autonomous);
        setManualModeStatus(data.LowLevelControls.manualMode);
        setHardwareModeStatus(data.LowLevelControls.hardwareMode);
        setError("");
      } catch (error) {
        console.error('Error fetching control status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchControlStatus();
    const interval = setInterval(fetchControlStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car" />
      </div>
      <div className="status-charge">
        <div className="panel-title">Low Level Controls</div>
        <br></br>
        <div className="control-item">
          <span className="control-label">Autonomous</span>
          <br></br>
          <span className="control-status">{autonomousStatus}</span>
        </div>
        <div className="control-item">
          <span className="control-label">Manual Mode</span>
          <span className="control-status">{manualModeStatus}</span>
        </div>
        <div className="control-item">
          <span className="control-label">Hardware Mode</span>
          <span className="control-status">{hardwareModeStatus}</span>
        </div>
        <p className="control-hint">Click to switch modes</p>
        <div className="status-charge-line"></div>
      </div>
    </div>
  );
};

export default LowLevelControls;
