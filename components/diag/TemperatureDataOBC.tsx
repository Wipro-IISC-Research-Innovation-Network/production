import React, { useEffect, useState } from "react";

interface TemperatureData2Props {
  temperature2: number;
  isGood: boolean;
}

const TemperatureData2: React.FC<TemperatureData2Props> = ({
  temperature2,
  isGood: defaultIsGood,
}) => {
  const [tempData, setTempData] = useState<{ value: number; isGood: boolean } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOBCStatus = async () => {
      try {
        const response = await fetch('/api/obc-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.OBC || !data.OBC.Temperature) {
          throw new Error('Invalid data structure');
        }
        
        setTempData(data.OBC.Temperature);
        setError("");
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setTempData(null);
      }
    };

    fetchOBCStatus();
    const interval = setInterval(fetchOBCStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="voltage-current-container">
      <div className="car-container2">
        <img src="/images/Car image.svg" alt="Car" />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="temp-data">
        <div className="panel-title">OBC Temperature</div>
        <br></br>
        <br></br>
        <div className="panel-info">Current temp</div>
        <div className="temperature-value">{tempData?.value || temperature2} C</div>
        <div className="temp-data-image">
          <img
            src={(tempData?.isGood ?? defaultIsGood) ? "/images/Good cell.svg" : "/images/Poor cell.svg"}
            alt={(tempData?.isGood ?? defaultIsGood) ? "TempSuccess" : "TempWarning"}
          />
        </div>
        <div className="temp-line"></div>
      </div>
    </div>
  );
};

export default TemperatureData2;
