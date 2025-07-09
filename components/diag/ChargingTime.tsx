import React, { useEffect, useState } from "react";

interface ChargingTimeProps {
  chargingTime: string;  // Keep as fallback
}

const ChargingTime: React.FC<ChargingTimeProps> = ({ chargingTime }) => {
  const [timeData, setTimeData] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOBCStatus = async () => {
      try {
        const response = await fetch('/api/obc-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.OBC || !data.OBC.ChargingTime) {
          throw new Error('Invalid data structure');
        }
        
        setTimeData(data.OBC.ChargingTime);
        setError("");
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setTimeData(null);
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
      <div className="charge-level">
        <div className="panel-title">Charging Time</div>
        <br />
        <div className="panel-info">Est. time</div>
        <div className="panel-info">to full</div>
        <div className="charging-time-value">{timeData || chargingTime}m</div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default ChargingTime;
