import React, { useState, useEffect } from 'react';

const ControlUnit1: React.FC = () => {
  const [ecu2Status, setEcu2Status] = useState("ACTIVE");
  const [ecu716Status, setEcu716Status] = useState("ACTIVE");
  const [ecu8Status, setEcu8Status] = useState("ACTIVE");
  const [monitorStatus, setMonitorStatus] = useState("PROCESSING");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchControlUnit1Status = async () => {
      try {
        const response = await fetch('/api/vehicle_control?section=ControlUnit1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.ControlUnit1) {
          throw new Error('Invalid data structure');
        }
        
        setEcu2Status(data.ControlUnit1.ECU2ICU.heartbeat);
        setEcu716Status(data.ControlUnit1.ECU716VHMS.heartbeat);
        setEcu8Status(data.ControlUnit1.ECU8USU.heartbeat);
        setMonitorStatus(data.ControlUnit1.MonitorProcessor.status);
        setError("");
      } catch (error) {
        console.error('Error fetching control unit 1 status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchControlUnit1Status();
    const interval = setInterval(fetchControlUnit1Status, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="control-unit-box">
        <div className="panel-title">Control Unit 1</div>
        <br />
        <br />
        <div className="control-unit-item">
          <span className="control-unit-label">ECU2-ICU</span>
          <span className="control-unit-status">Heartbeat</span>
          <span className="control-unit-status-detail">{ecu2Status}</span>
        </div>
        <div className="control-unit-item">
          <span className="control-unit-label">ECU716-VHMS</span>
          <span className="control-unit-status">Heartbeat</span>
          <span className="control-unit-status-detail">{ecu716Status}</span>
        </div>
        <div className="control-unit-item">
          <span className="control-unit-label">ECU8-USU</span>
          <span className="control-unit-status">Heartbeat</span>
          <span className="control-unit-status-detail">{ecu8Status}</span>
        </div>
        <div className="control-unit-item">
          <span className="control-unit-label">17 - Monitor and Processor</span>
          <span className="control-unit-status">Status</span>
          <span className="control-unit-status-detail">{monitorStatus}</span>
        </div>
        <div className="control-unit-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car3" />
      </div>
    </div>
  );
};

export default ControlUnit1;
