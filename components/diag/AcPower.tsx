import React, { useEffect, useState } from "react";

interface ACPowerProps {
  acPower: string;  // Keep as fallback
}

const ACPower: React.FC<ACPowerProps> = ({ acPower }) => {
  const [powerData, setPowerData] = useState<string | null>(null);
  const [chargeLevel, setChargeLevel] = useState<string>("Loading...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOBCStatus = async () => {
      try {
        const response = await fetch('/api/obc-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.OBC || !data.OBC.ChargeLevel || !data.OBC.ACData?.power) {
          throw new Error('Invalid data structure');
        }
        
        setChargeLevel(data.OBC.ChargeLevel);
        setPowerData(data.OBC.ACData.power);
        setError("");
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setChargeLevel("Error");
        setPowerData(null);
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
        <div className="panel-title">AC Power</div>
        <br/><br/>
        <div className="panel-info">Est. AC Power</div>
        <div className="panel-info">{chargeLevel}</div>
        <div className="charge-level-value">{powerData || acPower} W</div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default ACPower;
