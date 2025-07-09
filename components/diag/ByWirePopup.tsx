import React, { useState, useEffect } from 'react';

interface ByWirePopupProps {
  onClose: () => void; // Prop to close the popup
}

const ByWirePopup: React.FC<ByWirePopupProps> = ({ onClose }) => {
  const [steeringStatus, setSteeringStatus] = useState("Open");
  const [accPedalStatus, setAccPedalStatus] = useState("Open");
  const [brakePedalStatus, setBrakePedalStatus] = useState("Open");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchByWireStatus = async () => {
      try {
        const response = await fetch('/api/car_status?section=ByWireSystem');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.ByWireSystem) {
          throw new Error('Invalid data structure');
        }
        
        setSteeringStatus(data.ByWireSystem.steering.status);
        setAccPedalStatus(data.ByWireSystem.accBrake.accPedalStatus);
        setBrakePedalStatus(data.ByWireSystem.accBrake.brakePedalStatus);
        setError("");
      } catch (error) {
        console.error('Error fetching by-wire status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchByWireStatus();
    const interval = setInterval(fetchByWireStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="bywire-system-container">
        <div className="panel-title">Steering</div>
        <br></br>
        <div className="status-row">
          <div className="status-label2">Status</div>
          <div className="status-label3">(Open/Close/Opening/Closing)</div>
          <div className="status-value">{steeringStatus}</div>
        </div>
      </div>
      <div className="bywire-system-section">
        <div className="panel-title">Acc/Brake Pedal</div>
        <div className="status-row">
          <div className="status-label">Acc Pedal Status</div>
          <div className="status-value">{accPedalStatus}</div>
        </div>
        <div className="status-row">
          <div className="status-label-brake">Brake Pedal Status</div>
          <div className="status-value-brake">{brakePedalStatus}</div>
        </div>
        <div className="status-label1">(Open/Close/Opening/Closing)</div>        
        <div className="status-label1-brake">(Open/Close/Opening/Closing)</div>
        <div className="bywire-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images_diag/car-model.svg" alt="Car Model" />
      </div>
    </div>
  );
};

export default ByWirePopup;