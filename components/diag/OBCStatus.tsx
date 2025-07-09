import React, { useEffect, useState } from "react";

interface OBCStatusProps {
  errorStatus: string;
  errorCode: string;
  errorDate: string;
  isWorkingFine: boolean;
}

const OBCStatus: React.FC<OBCStatusProps> = ({
  errorStatus,
  errorCode,
  errorDate,
  isWorkingFine: defaultIsWorkingFine,
}) => {
  const [error, setError] = useState<string>("");
  const [statusData, setStatusData] = useState<{
    status: string;
    code: string;
    date: string;
    isWorkingFine: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchOBCStatus = async () => {
      try {
        const response = await fetch('/api/obc-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.OBC || !data.OBC.ErrorStatus) {
          throw new Error('Invalid data structure');
        }
        
        setStatusData(data.OBC.ErrorStatus);
        setError("");
      } catch (error) {
        console.error('Error fetching OBC status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
        setStatusData(null);
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
      <div className="status-battery-error">
        <div className="panel-title">OBC Error Status</div>
        <br />
        <div className="error-status-image">
          <img
            src={
              (statusData?.isWorkingFine ?? defaultIsWorkingFine) 
                ? "images/Good cell.svg" 
                : "images/Poor cell.svg"
            }
            alt="StatusImage"
          />
        </div>
        <div className="battery-working">
          {(statusData?.isWorkingFine ?? defaultIsWorkingFine) 
            ? "Currently Working Fine." 
            : "Error Detected."}
        </div>
        <div className="panel-info">Last Error</div>
        <div className="panel-info">Code: {statusData?.code || errorCode}</div>
        <div className="panel-info">on {statusData?.date || errorDate}</div>
        <button className="check-history">
          <img src="images/Error Status.svg" alt="CheckHistory" />
        </button>
      </div>
    </div>
  );
};

export default OBCStatus;
