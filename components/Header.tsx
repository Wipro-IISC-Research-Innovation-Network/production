import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [averageWhPerKm, setAverageWhPerKm] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      const formattedDate = now.toLocaleDateString('en-US', options);

      setTime(formattedTime);
      setDate(formattedDate);
    };

    const fetchBatteryData = async () => {
      try {
        const res = await fetch('/api/battery_percentage');
        if (!res.ok) throw new Error('Failed to fetch battery data');
        const data = await res.json();
        setBatteryPercentage(data.percentage);
        setRemainingDistance(data.remainingRangeKm);
        setAverageWhPerKm(data.avgWhPerKm);
      } catch (err) {
        console.error(err);
      }
    };

    // initial fetch
    fetchBatteryData();
    updateDateTime();

    // intervals
    const timeIntervalId = setInterval(updateDateTime, 1000);
    const batteryIntervalId = setInterval(fetchBatteryData, 1000); // poll every 1s

    return () => {
      clearInterval(timeIntervalId);
      clearInterval(batteryIntervalId);
    };
  }, []);

  return (
    <header className="header">
      <div className="left-section">
        <div className="time-date-weather">
          <div className="time-date">
            <p id="time">{time}</p>
            <p id="date">{date}</p>
          </div>
          <div className="weather">
            <p id="weather-icon"><img src="images/Vector (6).svg" alt="" /></p>
            <p id="temperature">23°C / 27°C</p>
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="connectivity-icons">
          <div className="icon" style={{ backgroundImage: `url('images/Vector (4).svg')` }}></div>
          <div className="icon" style={{ backgroundImage: `url('images/Vector (5).svg')` }}></div>
          <div className="icon" style={{ backgroundImage: `url('images/Union (3).svg')` }}></div>
        </div>
        <div className="battery-info-bar">
          <div className="battery-info">
            <div className="remaining">
              <span className="remaining-km" id="distance">{remainingDistance}</span>
              <span className="unit">km</span>
              <div className="remaining-text">Remaining</div>
            </div>
            <div className="battery">
              <span className="battery-percentage" id="battery">{batteryPercentage}</span>
              <span className="unit">%</span>
              <div className="battery-text">Battery</div>
            </div>
            <div className="average">
              <span className="avg-wh" id="average">{averageWhPerKm}</span>
              <span className="unit">Wh/km</span>
              <div className="average-text">Average</div>
            </div>
          </div>
          <div className="battery-bar-container">
            <div className="battery-bar-base">
              {/* Dynamically set the height of the battery fill based on battery percentage */}
              <div
                className="battery-bar-fill"
                id="battery-bar-fill"
                style={{ height: `${batteryPercentage}%` }}  // Adjust battery fill based on percentage
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
