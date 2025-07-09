import React, { useState, useEffect } from 'react';

interface CarModePopupProps {
  onClose: () => void;
}

const CarModePopup: React.FC<CarModePopupProps> = ({ onClose }) => {
  const [carMode, setCarMode] = useState("AMBIENT MODE");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCarMode = async () => {
      try {
        const response = await fetch('/api/car_status?section=CarMode');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.CarMode) {
          throw new Error('Invalid data structure');
        }
        
        setCarMode(data.CarMode.mode);
        setError("");
      } catch (error) {
        console.error('Error fetching car mode:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchCarMode();
    const interval = setInterval(fetchCarMode, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="car-container2">
        <img src="/images_diag/car-model.svg" alt="Car Model" />
      </div>
      <div className="car-mode-popup">
        <div className="panel-title">Car Mode</div>
        <br></br>
        <div className="panel-info">CAR MODE</div>
        <div className="car-mode-panel-value">{carMode}</div>
      </div>
    </div>
  );
};

export default CarModePopup;