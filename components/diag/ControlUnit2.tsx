import React, { useState, useEffect } from 'react';

const ControlUnit2: React.FC = () => {
  const [mpuStatus, setMpuStatus] = useState("ACTIVE");
  const [ecu1HeartbeatStatus, setEcu1HeartbeatStatus] = useState("ACTIVE");
  const [ecu1SoulStatus, setEcu1SoulStatus] = useState("ENABLED");
  const [ecuXHeartbeatStatus, setEcuXHeartbeatStatus] = useState("ACTIVE");
  const [ecu3HeartbeatStatus, setEcu3HeartbeatStatus] = useState("ACTIVE");
  const [ecu3SoulStatus, setEcu3SoulStatus] = useState("ENABLED");
  const [ecu4HeartbeatStatus, setEcu4HeartbeatStatus] = useState("ACTIVE");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchControlUnit2Status = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=ControlUnit2');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.ControlUnit2) {
          throw new Error('Invalid data structure');
        }
        
        setMpuStatus(data.ControlUnit2.MPUMotionPlanner.status);
        setEcu1HeartbeatStatus(data.ControlUnit2.ECU1VCU.heartbeat);
        setEcu1SoulStatus(data.ControlUnit2.ECU1VCU.activeSoul);
        setEcuXHeartbeatStatus(data.ControlUnit2.ECUXFCU.heartbeat);
        setEcu3HeartbeatStatus(data.ControlUnit2.ECU3DoorECU.heartbeat);
        setEcu3SoulStatus(data.ControlUnit2.ECU3DoorECU.activeSoul);
        setEcu4HeartbeatStatus(data.ControlUnit2.ECU4RPiOUT.heartbeat);
        setError("");
      } catch (error) {
        console.error('Error fetching control unit 2 status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchControlUnit2Status();
    const interval = setInterval(fetchControlUnit2Status, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="control-unit-box">
        <div className="panel-title">Control Unit 2</div>
        <br />
        <br></br>
        <div className="control-unit2-item">
          <span className="control-unit2-label">MPU Motion Planner</span>
          <span className="control-unit2-status">Status</span>
          <span className="control-unit2-status-detail">{mpuStatus}</span>
        </div>
        <div className="control-unit2-item">
          <span className="control-unit2-label">ECU1-VCU</span>
          <span className="control-unit2-status">Heartbeat</span>
          <span className="control-unit2-status-detail">{ecu1HeartbeatStatus}</span>
          <br />
          <br />
          <span className="control-unit2-status">Active Soul</span>
          <span className="control-unit2-status-detail">{ecu1SoulStatus}</span>
        </div>
        <div className="control-unit2-item">
          <span className="control-unit2-label">ECUX-FCU</span>
          <span className="control-unit2-status">Heartbeat</span>
          <span className="control-unit2-status-detail">{ecuXHeartbeatStatus}</span>
          <br />
        </div>
        <div className="control-unit2-item">
          <span className="control-unit2-label">ECU3-DoorECU</span>
          <span className="control-unit2-status">Heartbeat</span>
          <span className="control-unit2-status-detail">{ecu3HeartbeatStatus}</span>
          <span className="control-unit2-status">Active Soul</span>
          <span className="control-unit2-status-detail">{ecu3SoulStatus}</span>
          <br />
        </div>
        <div className="control-unit2-item">
          <span className="control-unit2-label">ECU4-RPi-OUT</span>
          <span className="control-unit2-status">Heartbeat</span>
          <span className="control-unit2-status-detail">{ecu4HeartbeatStatus}</span>
          <br />
        </div>
        <div className="control-unit-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car3" />
      </div>
    </div>
  );
};

export default ControlUnit2;
