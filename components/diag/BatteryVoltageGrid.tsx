import React, { useState, useRef } from 'react';

interface BatteryVoltageGridProps {
    onClose: () => void;
    voltages: number[];
}

const FullScreenGrid: React.FC<BatteryVoltageGridProps> = ({ onClose, voltages }) => {
    const cellValues = voltages; 

    const gridRef = useRef<HTMLDivElement>(null);

    const scrollGrid = (direction: 'up' | 'down') => {
        if (gridRef.current) {
            gridRef.current.scrollBy({
                top: direction === 'up' ? -100 : 100,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="battery-voltage-fullscreen">
            <div className="battery-voltage-container">
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'fixed',
                        top: '-15px',
                        right: '-1px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 500
                    }}
                >
                    Close
                </button>

                <div className="grid-container" ref={gridRef}>
                    <div className="grid-header">Cell Number</div>
                    <div className="grid-header">Cell Value</div>

                    {cellValues.map((value, index) => (
                        <React.Fragment key={index}>
                            <div className="grid-item">Cell {index + 1}</div>
                            <div className="grid-item">{value} V</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullScreenGrid;
