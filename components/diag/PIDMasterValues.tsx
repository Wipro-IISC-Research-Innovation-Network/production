import React, { useState, useEffect } from "react";

const PIDMasterValues: React.FC = () => {
  const [steeringPIDOutput, setSteeringPIDOutput] = useState(0);
  const [brakePIDOutput, setBrakePIDOutput] = useState(0);
  const [motorRPIDOutput1, setMotorRPIDOutput1] = useState(0);
  const [motorRPIDOutput2, setMotorRPIDOutput2] = useState(0);
  const [masterPIDOutput, setMasterPIDOutput] = useState(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPIDValues = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=PIDMasterValues');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.PIDMasterValues) {
          throw new Error('Invalid data structure');
        }
        
        setSteeringPIDOutput(data.PIDMasterValues.steeringPID);
        setBrakePIDOutput(data.PIDMasterValues.brakePID);
        setMotorRPIDOutput1(data.PIDMasterValues.motorRPID1);
        setMotorRPIDOutput2(data.PIDMasterValues.motorRPID2);
        setMasterPIDOutput(data.PIDMasterValues.masterPID);
        setError("");
      } catch (error) {
        console.error('Error fetching PID values:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchPIDValues();
    const interval = setInterval(fetchPIDValues, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="pid-values-container">
        <div className="panel-title">PID Master Values</div>
        <div className="pid-values">
          <div className="pid-value-item">
            <span className="pid-label">Steering PID Output</span>
            <span className="pid-value">{steeringPIDOutput}</span>
          </div>
          <div className="pid-value-item">
            <span className="pid-label">Brake PID Output</span>
            <span className="pid-value">{brakePIDOutput}</span>
          </div>
          <div className="pid-value-item">
            <span className="pid-label">Motor R PID Output</span>
            <span className="pid-value">{motorRPIDOutput1}</span>
          </div>
          <div className="pid-value-item">
            <span className="pid-label">Motor R PID Output</span>
            <span className="pid-value">{motorRPIDOutput2}</span>
          </div>
          <div className="pid-value-item">
            <span className="pid-label">Master PID Output</span>
            <span className="pid-value">{masterPIDOutput}</span>
          </div>
        </div>
        <div className="pid-master-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car" />
      </div>
    </div>
  );
};

export default PIDMasterValues;
