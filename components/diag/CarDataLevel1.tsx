import React, { useState, useEffect } from 'react';

interface CarDataLevel1Props {
  onClose: () => void; // Prop to close the component
}

const CarDataLevel1: React.FC<CarDataLevel1Props> = ({ onClose }) => {
  const [speedL, setSpeedL] = useState("4000rpm");
  const [speedR, setSpeedR] = useState("4000rpm");
  const [steeringAngle, setSteeringAngle] = useState("259");
  const [brakeLevel, setBrakeLevel] = useState("259");
  const [gearStatus, setGearStatus] = useState("FORWARD");
  const [footSwitchState, setFootSwitchState] = useState("OFF");
  const [motorBrakeState, setMotorBrakeState] = useState("ON");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCarDataLevel1 = async () => {
      try {
        const response = await fetch('/api/car_status?section=CarDataLevel1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.CarDataLevel1) {
          throw new Error('Invalid data structure');
        }
        
        setSpeedL(data.CarDataLevel1.speedL);
        setSpeedR(data.CarDataLevel1.speedR);
        setSteeringAngle(data.CarDataLevel1.steeringAngle);
        setBrakeLevel(data.CarDataLevel1.brakeLevel);
        setGearStatus(data.CarDataLevel1.gear.status);
        setFootSwitchState(data.CarDataLevel1.footSwitch.state);
        setMotorBrakeState(data.CarDataLevel1.motorBrake.state);
        setError("");
      } catch (error) {
        console.error('Error fetching car data level 1:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchCarDataLevel1();
    const interval = setInterval(fetchCarDataLevel1, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="control-unit-box">
        <div className="panel-title">Car Data Level 1</div>
        <br></br>
        <div className="status-row">
          <div className="status-label">Speed L (0 to 5000rpm)</div>
          <div className="status-value">{speedL}</div>
        </div>
        <div className="status-row">
          <div className="status-label">Speed R (0 to 5000rpm)</div>
          <div className="status-value">{speedR}</div>
        </div>
        <div className="status-row">
          <div className="status-label">Steering Angle (0 to 1000)</div>
          <div className="status-value">{steeringAngle}</div>
        </div>
        <div className="status-row">
          <div className="status-label">Brake Level (0 to 300)</div>
          <div className="status-value">{brakeLevel}</div>
        </div>
        <div className="status-row">
          <div className="status-label-gear">Gear</div>
          <div className="status-label1-gear">Status</div>
          <div className="status-value">{gearStatus}</div>
        </div>
        <div className="status-row">
          <div className="status-label">Foot Switch</div>
          <div className="status-label2-gear">State</div>
          <div className="status-value">{footSwitchState}</div>
        </div>
        <div className="status-row">
          <div className="status-label">Motor Brake</div>
          <div className="status-label3-gear">State</div>
          <div className="status-value">{motorBrakeState}</div>
        </div>
        <div className="data-level1-line"></div>
      </div>
      <div className="car-container2">
        <img src="/images_diag/car-model.svg" alt="Car Model" />
      </div>
    </div>
  );
};

export default CarDataLevel1;