// components/ControlPanel.js
import { useState } from 'react';

const ControlPanel = () => {
    const [status, setStatus] = useState('stopped');
    const [mode, setMode] = useState('none');

    const updateStatus = async (newStatus, newMode) => {
        try {
            const response = await fetch('/api/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, mode: newMode || mode }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const ackData = await response.json();
            console.log('Server Acknowledgment:', ackData);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleStartStop = () => {
        const newStatus = status === 'stopped' ? 'started' : 'stopped';
        setStatus(newStatus);
        updateStatus(newStatus);
    };

    const handleEmergencyStop = () => {
        setStatus('stopped');
        updateStatus('stopped');
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        updateStatus(status, newMode);
    };

    return (
        <div>
            <button onClick={handleStartStop}>{status === 'stopped' ? 'Start' : 'Stop'}</button>
            <button onClick={handleEmergencyStop}>Emergency Stop</button>
            <button onClick={() => handleModeChange('manual')}>Manual Drive</button>
            <button onClick={() => handleModeChange('autonomous')}>Autonomous Drive</button>
            <button onClick={() => handleModeChange('parking')}>Parking Mode</button>
        </div>
    );
};

export default ControlPanel;