import React, { useEffect, useState } from "react";

interface AcVoltageAndCurrentProps {
  acCurrent: string;
  acVoltage: string;
}

const AcVoltageAndCurrent: React.FC<AcVoltageAndCurrentProps> = ({
  acCurrent,
  acVoltage,
}) => {
  const [chargeLevel, setChargeLevel] = useState<string>("Loading..."); // Default value
  const [error, setError] = useState<string>("");
  const [acData, setAcData] = useState<{ voltage: string; current: string } | null>(null);

  useEffect(() => {
    const fetchOBCStatus = async () => {
      try {
        console.log('Fetching OBC status...'); // Debug log
        const response = await fetch('/api/obc-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (!data.OBC || !data.OBC.ChargeLevel || !data.OBC.ACData) {
          throw new Error('Invalid data structure');
        }
        
        setChargeLevel(data.OBC.ChargeLevel);
        setAcData(data.OBC.ACData);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setChargeLevel("Error"); // Show error state
        setAcData(null);
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
      <div className="battery-current">
        <div className="panel-title">AC Current</div>
        <br/>
        <div className="panel-info">{chargeLevel}</div>
        <div className="panel-info">Current drawn</div>
        <div className="panel-value">{acData?.current || acCurrent} A</div>
      </div>
      <div className="battery-voltage">
        <div className="panel-title">AC Voltage</div>
        <br/>
        <div className="panel-info">{chargeLevel}</div>
        <div className="panel-info">Voltage</div>
        <div className="panel-value">{acData?.voltage || acVoltage} V</div>
      </div>
    </div>
  );
};

export default AcVoltageAndCurrent;
