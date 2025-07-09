import React, { useEffect, useState } from "react";

interface DcVoltageAndCurrentProps {
  dcCurrent: string;
  dcVoltage: string;
}

const DcVoltageAndCurrent: React.FC<DcVoltageAndCurrentProps> = ({
  dcCurrent,
  dcVoltage,
}) => {
  const [dcData, setDcData] = useState<{ voltage: string; current: string } | null>(null);
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
        
        if (!data.OBC || !data.OBC.ChargeLevel || !data.OBC.DCData) {
          throw new Error('Invalid data structure');
        }
        
        setChargeLevel(data.OBC.ChargeLevel);
        setDcData(data.OBC.DCData);
        setError("");
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setChargeLevel("Error");
        setDcData(null);
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
        <div className="panel-title">DC Current</div>
        <br/>
        <div className="panel-info">Est. DC</div>
        <div className="panel-info">Current drawn</div>
        <div className="panel-value">{dcData?.current || dcCurrent} A</div>
      </div>
      <div className="battery-voltage">
        <div className="panel-title">DC Voltage</div>
        <br/>
        <div className="panel-info">Est. DC</div>
        <div className="panel-info">Voltage</div>
        <div className="panel-value">{dcData?.voltage || dcVoltage} V</div>
      </div>
    </div>
  );
};

export default DcVoltageAndCurrent;
