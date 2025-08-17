// DigitalClock.jsx
import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">🕒 Digital Clock</h1>
      <p className="text-xl font-mono">{time.toLocaleTimeString()}</p>
      <p className="text-sm text-gray-300">Date: {time.toLocaleDateString()}</p>
    </div>
  );
};

export default DigitalClock;
