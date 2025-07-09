// Seating.tsx
import React, { useState, useEffect } from "react";

const Seating: React.FC = () => {
  const [captainSeatPosition, setCaptainSeatPosition] = useState("Front");
  const [coCaptainSeatPosition, setCoCaptainSeatPosition] = useState("Front");
  const [captainBackrestPosition, setCaptainBackrestPosition] = useState(40);
  const [coCaptainBackrestPosition, setCoCaptainBackrestPosition] = useState(40);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSeatingStatus = async () => {
      try {
        const response = await fetch('/api/seating?section=Seating');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.Seating || !data.Seating.CaptainSeat || !data.Seating.CoCaptainSeat) {
          throw new Error('Invalid data structure');
        }
        
        setCaptainSeatPosition(data.Seating.CaptainSeat.position);
        setCaptainBackrestPosition(data.Seating.CaptainSeat.backrestPosition);
        setCoCaptainSeatPosition(data.Seating.CoCaptainSeat.position);
        setCoCaptainBackrestPosition(data.Seating.CoCaptainSeat.backrestPosition);
        setError("");
      } catch (error) {
        console.error('Error fetching seating status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchSeatingStatus();
    const interval = setInterval(fetchSeatingStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCaptainSeatPosition = (position: string) => {
    setCaptainSeatPosition(position);
  };

  const handleCoCaptainSeatPosition = (position: string) => {
    setCoCaptainSeatPosition(position);
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="captain-seat-container">
        <h2>Captain Seat</h2>
        <br />
        <div className="seating-item">
          <span className="seating-label">
            Facing Positon (Front/Back/Side/Rotating)
          </span>
          <span className="seating-status">{captainSeatPosition}</span>
        </div>
        <div className="seating-item">
          <span className="seating-label">Backrest Positions</span>
          <span className="seating-status-detail">
            {captainBackrestPosition}%
          </span>
        </div>
      </div>
      <div className="co-captain-seat-container">
        <h2>Co Captain Seat</h2>
        <br />
        <div className="seating-item">
          <span className="seating-label">
            Facing Positon (Front/Back/Side/Rotating)
          </span>
          <span className="seating-status">{coCaptainSeatPosition}</span>
        </div>
        <div className="seating-item">
          <span className="seating-label">Backrest Positions</span>
          <span className="seating-status-detail">
            {coCaptainBackrestPosition}%
          </span>
        </div>
      </div>
      <div className="car-image-seating">
        <img src="/images/Car image1.svg" alt="Car" />
        <img
          src="/images/Group 427319068.svg"
          alt="Arrow"
          className="arrow-seating1" />
        <img
          src="/images/Line 44.svg"
          alt="Arrow2"
          className="arrow-seating2" />
      </div>
    </div>
  );
};

export default Seating;
