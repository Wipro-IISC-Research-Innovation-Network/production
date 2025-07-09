import React, { useState, useEffect } from 'react';

const InternalLighting: React.FC = () => {
    const [RoofLightStatus, setRoofLightStatus] = useState('ON');
    const [RoofLightValue, setRoofLightValue] = useState(100);
    const [DoorPuddleStatus, setDoorPuddleStatus] = useState('ON');
    const [DoorPuddleValue, setDoorPuddleValue] = useState(50);
    const [FloorLightsStatus, setFloorLightsStatus] = useState('ON');
    const [FloorLightsValue, setFloorLightsValue] = useState(100);
    const [DashboardLightsStatus, setDashboardLightsStatus] = useState('OFF');
    const [DashboardLightsValue, setDashboardLightsValue] = useState('OFF');
    const [BoatLightsStatus, setBoatLightsStatus] = useState('ON');
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchInternalLighting = async () => {
            try {
                const response = await fetch('/api/seating?section=InternalLighting');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!data.InternalLighting) {
                    throw new Error('Invalid data structure');
                }

                const lighting = data.InternalLighting;
                setRoofLightStatus(lighting.roofLight.status);
                setRoofLightValue(lighting.roofLight.brightness);
                setDoorPuddleStatus(lighting.doorPuddle.status);
                setDoorPuddleValue(lighting.doorPuddle.brightness);
                setFloorLightsStatus(lighting.floorLights.status);
                setFloorLightsValue(lighting.floorLights.brightness);
                setDashboardLightsStatus(lighting.dashboardLights.status);
                setDashboardLightsValue(lighting.dashboardLights.brightness);
                setBoatLightsStatus(lighting.boatLights.status);
                setError("");
            } catch (error) {
                console.error('Error fetching internal lighting:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                setError(`Failed to fetch data: ${errorMessage}`);
            }
        };

        fetchInternalLighting();
        const interval = setInterval(fetchInternalLighting, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="external-lighting-box">
            <h2>Internal Lighting</h2>
            {error && <div className="error-message">{error}</div>}
            <br/>
            <div className="lighting-item">
                <span className="lighting-label">Roof Light</span>
                <span className="lighting-status">{RoofLightStatus}</span>
                <span className="lighting-status-detail">{RoofLightValue}</span>
            </div>
            <div className="lighting-item">
                <span className="lighting-label">Door Puddle</span>
                <span className="lighting-status">{DoorPuddleStatus}</span>
                <span className="lighting-status-detail">{DoorPuddleValue}</span>
            </div>
            <div className="lighting-item">
                <span className="lighting-label">Floor Lights</span>
                <span className="lighting-status">{FloorLightsStatus}</span>
                <span className="lighting-status-detail">{FloorLightsValue}</span>
            </div>
            <div className="lighting-item">
                <span className="lighting-label">Dashboard Lights</span>
                <span className="lighting-status">{DashboardLightsStatus}</span>
                <span className="lighting-status-detail">{DashboardLightsValue}</span>
            </div>
            <div className="lighting-item">
                <span className="lighting-label">Boat Lights</span>
                <span className="lighting-status">{BoatLightsStatus}</span>
                <span className="lighting-status-detail">-</span>
            </div>
            <div className="car-external-lighting-container">
                <img src="/images/Car image1.svg" alt="Car3" className="car-image-external-lighting" />
                <img src="/images/Group 427319068.svg" alt="Arrow3" className="arrow-external-lighting-image" />
            </div>
        </div>
    );
};

export default InternalLighting;
