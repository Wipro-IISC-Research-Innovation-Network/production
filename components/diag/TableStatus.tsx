// table-lighting.tsx
import React, { useState, useEffect } from "react";

const TableStatus: React.FC = () => {
  const [TableStatus, setTableStatus] = useState("Open");
  const [TableHeight, setTableHeight] = useState(40);
  const [TableLampState, setTableLampState] = useState("ON");
  const [TableLampBrightness, setTableLampBrightness] = useState(40);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTableStatus = async () => {
      try {
        const response = await fetch('/api/seating?section=TableStatus');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.TableStatus || !data.TableStatus.table || !data.TableStatus.tableLamp) {
          throw new Error('Invalid data structure');
        }
        
        setTableStatus(data.TableStatus.table.status);
        setTableHeight(data.TableStatus.table.height);
        setTableLampState(data.TableStatus.tableLamp.state);
        setTableLampBrightness(data.TableStatus.tableLamp.brightness);
        setError("");
      } catch (error) {
        console.error('Error fetching table status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchTableStatus();
    const interval = setInterval(fetchTableStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCaptainSeatPosition = (position: string) => {
    setTableStatus(position);
  };

  const handleCoCaptainSeatPosition = (position: string) => {
    setTableLampState(position);
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="table-status-box">
        <h2>Table Status</h2>
        <div className="table-lighting-item">
          <span className="table-lighting-label">
            Table Status (Open/Close/Opening/Closing/Error)
          </span>
          <span className="table-lighting-status">{TableStatus}</span>
        </div>
        <div className="table-lighting-item">
          <span className="table-lighting-label">Table Height</span>
          <span className="table-lighting-status-detail">{TableHeight}%</span>
        </div>
      </div>
      <div className="table-lighting-box">
        <h2>Table Lighting</h2>
        <div className="table-lighting-item">
          <span className="table-lighting-label">Table Lamp State</span>
          <br />
          <span className="table-lighting-status">{TableLampState}</span>
        </div>
        <div className="table-lighting-item">
          <span className="table-lighting-label">Table Lamp Brightness</span>
          <span className="table-lighting-status-detail">
            {TableLampBrightness}%
          </span>
        </div>
      </div>
      <div className="car-image-table-lighting">
        <img src="/images/Car image2.svg" alt="Car" />
        <img
          src="/images/Group 427319068.svg"
          alt="Arrow"
          className="arrow-table-lighting1"
        />
        <img
          src="/images/Line 44.svg"
          alt="Arrow2"
          className="arrow-table-lighting2"
        />
      </div>
    </div>
  );
};

export default TableStatus;
