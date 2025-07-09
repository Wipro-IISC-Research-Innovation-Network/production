import React, { useState, useEffect } from "react";

const PIDControls: React.FC = () => {
  const [masterControlStatus, setMasterControlStatus] = useState("ENABLED");
  const [steeringRackStatus, setSteeringRackStatus] = useState("ACTIVE");
  const [brakeStatus, setBrakeStatus] = useState("ACTIVE");
  const [motorsStatus, setMotorsStatus] = useState("ENABLED");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPIDControls = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=PIDControls');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.PIDControls) {
          throw new Error('Invalid data structure');
        }
        
        setMasterControlStatus(data.PIDControls.masterControl);
        setSteeringRackStatus(data.PIDControls.steeringRack);
        setBrakeStatus(data.PIDControls.brake);
        setMotorsStatus(data.PIDControls.motors);
        setError("");
      } catch (error) {
        console.error('Error fetching PID controls:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchPIDControls();
    const interval = setInterval(fetchPIDControls, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="pid-controls-box">
        <div className="panel-title">PID Controls</div>
        <br />
        <div className="control-item">
          <span className="control-label">Master Control</span>
          <span className="control-status">{masterControlStatus}</span>
        </div>
        <div className="control-item">
          <span className="control-label">Steering Rack</span>
          <span className="control-status">{steeringRackStatus}</span>
        </div>
        <div className="control-item">
          <span className="control-label">Brake</span>
          <span className="control-status">{brakeStatus}</span>
        </div>
        <div className="control-item">
          <span className="control-label">Motors</span>
          <span className="control-status">{motorsStatus}</span>
        </div>
        <div className="status-charge-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car2" />
      </div>
    </div>
  );
};

export default PIDControls;
