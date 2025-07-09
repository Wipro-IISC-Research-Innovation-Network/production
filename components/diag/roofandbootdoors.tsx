import React, { useState, useEffect } from "react";

const NewComponent: React.FC = () => {
  // State variables for door statuses
  const [firstDoorStatus, setFirstDoorStatus] = useState("Open");
  const [secondDoorStatus, setSecondDoorStatus] = useState("Open");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDoorStatus = async () => {
      try {
        const response = await fetch('/api/doors_and_tyres?section=RoofAndBootDoors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.RoofAndBootDoors) {
          throw new Error('Invalid data structure');
        }
        
        setFirstDoorStatus(data.RoofAndBootDoors.RoofDoor.status);
        setSecondDoorStatus(data.RoofAndBootDoors.BootDoor.status);
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
    <div className="new-doors-container">
      {error && <div className="error-message">{error}</div>}
      {/* First Door Status (Roof Door) */}
      <div className="new-door-box first-door">
        <h2>Roof Door</h2>
        <div className="new-door-box-content">
          <span className="new-status-row">Status (Open/Close/Opening/Closing)</span>
          <span className="new-status">{firstDoorStatus}</span>
        </div>
      </div>

      {/* Second Door Status (Boot Door) */}
      <div className="new-door-box second-door">
        <h2>Boot Door</h2>
        <div className="new-door-box-content">
          <span className="new-status-row">Status (Open/Close/Opening/Closing)</span>
          <span className="new-status">{secondDoorStatus}</span>
        </div>
      </div>

      {/* Car Image */}
      <div className="new-car-image-container">
        <img src="/images/car13image.svg" alt="Car" className="new-car-image" />
      </div>
    </div>
  );
};

export default NewComponent;
