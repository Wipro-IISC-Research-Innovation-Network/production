import React, { useState, useEffect } from "react";

const SideDoors: React.FC = () => {
  // State for the left and right door statuses
  const [leftDoorStatus, setLeftDoorStatus] = useState("Open");
  const [rightDoorStatus, setRightDoorStatus] = useState("Open");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDoorStatus = async () => {
      try {
        const response = await fetch('/api/doors_and_tyres?section=SideDoors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.SideDoors) {
          throw new Error('Invalid data structure');
        }
        
        setLeftDoorStatus(data.SideDoors.LeftDoor.status);
        setRightDoorStatus(data.SideDoors.RightDoor.status);
        setError("");
      } catch (error) {
        console.error('Error fetching door status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchDoorStatus();
    const interval = setInterval(fetchDoorStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="side-doors-container">
      {error && <div className="error-message">{error}</div>}
      {/* Left Door Status */}
      <div className="door-box left-door">
        <h2>Left Door</h2>
        <div className="door-box-content">
          <span className="status-row">Status</span>
          <span className="openclose">(Open/Close/Opening/Closing)</span>
          <span className="status">{leftDoorStatus}</span>
        </div>
      </div>

      {/* Right Door Status */}
      <div className="door-box right-door">
        <h2>Right Door</h2>
        <div className="door-box-content">
          <span className="status-row">Status</span>
          <span className="openclose">(Open/Close/Opening/Closing)</span>
          <span className="status">{rightDoorStatus}</span>
        </div>
      </div>

      {/* Car Image */}
      <div className="car-image-container13">
        <img src="/images/car13image.svg" alt="Car" className="car-image13" />
      </div>
    </div>
  );
};

export default SideDoors;
