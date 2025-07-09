import React, {useEffect, useState} from 'react';

const ExternalLighting: React.FC = () => {
    const [HeadlightsStatus, setHeadlightsStatus] = useState('ON');
    const [TailLightsStatus, setTailLightsStatus] = useState('ON');
    const [BrakeLightsStatus, setBrakeLightsStatus] = useState('OFF');
    const [TurnSignalsStatus, setTurnSignalsStatus] = useState('OFF');
    const [FogLightsStatus, setFogLightsStatus] = useState('ON');
    const [error, setError] = useState<string>("");

    useEffect(() => {
      const fetchLightingStatus = async () => {
        try {
          const response = await fetch('/api/seating?section=ExternalLighting');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.ExternalLighting) {
            throw new Error('Invalid data structure');
          }

          const ext = data.ExternalLighting;
          setHeadlightsStatus(ext.HeadLights.status ? "ON" : "OFF");
          setTailLightsStatus(ext.TailLights.status ? "ON" : "OFF");
          setBrakeLightsStatus(ext.BreakLights.status ? "ON" : "OFF");
          setTurnSignalsStatus(ext.TurnSignals.status ? "ON" : "OFF");
          setFogLightsStatus(ext.FogLights.status ? "ON" : "OFF");
          setError("");
        } catch (error) {
          console.error('Error fetching external lighting status:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(`Failed to fetch data: ${errorMessage}`);
        }
      };

      fetchLightingStatus();
      const interval = setInterval(fetchLightingStatus, 1000);

      return () => clearInterval(interval);
    }, []);

  return (
    <div className="external-lighting-box">
      <h2>External Lighting</h2>
      <br/>
      {error && <div className="error-message">{error}</div>}
      <div className="lighting-item">
        <span className="lighting-label">Headlights</span>
        <span className="lighting-status">{HeadlightsStatus}</span>
      </div>
      <div className="lighting-item">
        <span className="lighting-label">Tail Lights</span>
        <span className="lighting-status">{TailLightsStatus}</span>
      </div>
      <div className="lighting-item">
        <span className="lighting-label">Brake Lights</span>
        <span className="lighting-status">{BrakeLightsStatus}</span>
      </div>
      <div className="lighting-item">
        <span className="lighting-label">Turn Signals</span>
        <span className="lighting-status">{TurnSignalsStatus}</span>
      </div>
      <div className="lighting-item">
        <span className="lighting-label">Fog Lights</span>
        <span className="lighting-status">{FogLightsStatus}</span>
      </div>
      <div className="car-external-lighting-container">
        <img src="/images/Car image1.svg" alt="Car2" className="car-image-external-lighting" />
        <img src="/images/Group 427319068.svg" alt="Arrow2" className="arrow-external-lighting-image" />
      </div>
    </div>
  );
};

export default ExternalLighting;
