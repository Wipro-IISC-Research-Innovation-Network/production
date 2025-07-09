import React, { useState, useEffect } from 'react';

const ControlUnit3: React.FC = () => {
  const [ecu5Status, setEcu5Status] = useState("ACTIVE");
  const [ecu7Status, setEcu7Status] = useState("ACTIVE");
  const [ecu8Status, setEcu8Status] = useState("ACTIVE");
  const [ecu9Status, setEcu9Status] = useState("ACTIVE");
  const [ecu10Status, setEcu10Status] = useState("ACTIVE");
  const [ecu11Status, setEcu11Status] = useState("ACTIVE");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchControlUnit3Status = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=ControlUnit3');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.ControlUnit3) {
          throw new Error('Invalid data structure');
        }
        
        setEcu5Status(data.ControlUnit3.ECU5RPiIN.heartbeat);
        setEcu7Status(data.ControlUnit3.ECU7HVAC.heartbeat);
        setEcu8Status(data.ControlUnit3.ECU8USU.heartbeat);
        setEcu9Status(data.ControlUnit3.ECU9LCU.heartbeat);
        setEcu10Status(data.ControlUnit3.ECU10Dashboard.heartbeat);
        setEcu11Status(data.ControlUnit3.ECU11Table.heartbeat);
        setError("");
      } catch (error) {
        console.error('Error fetching control unit 3 status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchControlUnit3Status();
    const interval = setInterval(fetchControlUnit3Status, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="control-unit-box">
        <div className="panel-title">Control Unit 3</div>
        <br />
        <br></br>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU5 RPI-IN</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu5Status}</span>
        </div>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU7-HVAC</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu7Status}</span>
        </div>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU8-USU</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu8Status}</span>
        </div>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU9-LCU</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu9Status}</span>
        </div>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU10 DashboardECU</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu10Status}</span>
        </div>
        <div className="control-unit3-item">
          <span className="control-unit3-label">ECU11-TableECU</span>
          <span className="control-unit3-status">Heartbeat</span>
          <span className="control-unit3-status-detail">{ecu11Status}</span>
        </div>
        <div className="control-unit-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car3" />
      </div>
    </div>
  );
};

export default ControlUnit3;
