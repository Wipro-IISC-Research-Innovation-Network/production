import React, { useState, useEffect } from "react";

const Tyres: React.FC = () => {
  // State variables for tyre pressure
  const [frontRightPressure, setFrontRightPressure] = useState(45);
  const [frontLeftPressure, setFrontLeftPressure] = useState(45);
  const [backRightPressure, setBackRightPressure] = useState(45);
  const [backLeftPressure, setBackLeftPressure] = useState(45);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTyreStatus = async () => {
      try {
        const response = await fetch('/api/doors_and_tyres?section=Tyres');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.Tyres) {
          throw new Error('Invalid data structure');
        }
        
        setFrontRightPressure(data.Tyres.FrontRight.pressure);
        setFrontLeftPressure(data.Tyres.FrontLeft.pressure);
        setBackRightPressure(data.Tyres.BackRight.pressure);
        setBackLeftPressure(data.Tyres.BackLeft.pressure);
        setError("");
      } catch (error) {
        console.error('Error fetching tyre status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to fetch data: ${errorMessage}`);
      }
    };

    fetchTyreStatus();
    const interval = setInterval(fetchTyreStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tyres-container">
      {error && <div className="error-message">{error}</div>}
      {/* Front Right Wheel */}
      <div className="tyre-box front-right">
        <h2>Front Right Wheel</h2>
        <div className="tyre-box-content">
          <span className="tyre-box-detail">Tyre Pressure</span>
          <span className="tyre-box-value"> {frontRightPressure} psi</span> {/* Using the variable */}
        </div>
      </div>

      {/* Front Left Wheel */}
      <div className="tyre-box front-left">
        <h2>Front Left Wheel</h2>
        <div className="tyre-box-content">
          <span className="tyre-box-detail">Tyre Pressure</span>
          <span className="tyre-box-value"> {frontLeftPressure} psi</span> {/* Using the variable */}
        </div>
      </div>

      {/* Back Right Wheel */}
      <div className="tyre-box back-right">
        <h2>Back Right Wheel</h2>
        <div className="tyre-box-content">
          <span className="tyre-box-detail">Tyre Pressure</span>
          <span className="tyre-box-value"> {backRightPressure} psi</span> {/* Using the variable */}
        </div>
      </div>

      {/* Back Left Wheel */}
      <div className="tyre-box back-left">
        <h2>Back Left Wheel</h2>
        <div className="tyre-box-content">
          <span className="tyre-box-detail">Tyre Pressure</span>
          <span className="tyre-box-value"> {backLeftPressure} psi</span> {/* Using the variable */}
        </div>
      </div>

      {/* Car Image */}
      <div className="car12-image-container">
        <img src="/images/Group 427319102.svg" alt="Car" className="car12-image" />
      </div>
    </div>
  );
};

export default Tyres;
