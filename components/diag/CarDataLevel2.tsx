import React, { useState, useEffect } from 'react';

interface CarDataLevel2Props {
  onClose: () => void;
}

const CarDataLevel2: React.FC<CarDataLevel2Props> = ({ onClose }) => {
  const [internalTemp, setInternalTemp] = useState("23°C");
  const [internalHumidity, setInternalHumidity] = useState("22%");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCarDataLevel2 = async () => {
      try {
        const response = await fetch('/api/car_status?section=CarDataLevel2');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.CarDataLevel2) {
          throw new Error('Invalid data structure');
        }
        
        setInternalTemp(data.CarDataLevel2.internalTemp);
        setInternalHumidity(data.CarDataLevel2.internalHumidity);
        setError("");
      } catch (error) {
        console.error('Error fetching car data level 2:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchCarDataLevel2();
    const interval = setInterval(fetchCarDataLevel2, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      {error && <div className="error-message">{error}</div>}
      <div className="car-mode-popup">
        <div className="panel-title">Car Data Level 2</div>
        <br></br>
        <div className="status-row">
          <div className="status-label">Internal Temp</div>
          <div className="status-value">{internalTemp}</div>
        </div>
        <div className="status-row">
          <div className="status-label-humi">Internal Humidity</div>
          <div className="status-value">{internalHumidity}</div>
        </div>
      </div>
      <div className="car-container2">
        <img src="/images_diag/car-model.svg" alt="Car Model" />
      </div>
    </div>
  );
};

export default CarDataLevel2;