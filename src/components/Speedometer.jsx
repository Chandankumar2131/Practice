import React, { useState } from "react";

const Speedometer = () => {
  const [speed, setSpeed] = useState(50); // Default speed

  const handleChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percentage = speed / 180; // Assuming max speed = 180
  const dashoffset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">React Speedometer</h1>

      <svg width="220" height="120" viewBox="0 0 220 120">
        {/* Background Circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="transparent"
          stroke="#444"
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(-180 110 110)"
        />

        {/* Progress Circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="transparent"
          stroke="#00ffcc"
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform="rotate(-180 110 110)"
          style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
        />

        {/* Speed Text */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
        >
          {speed} km/h
        </text>
      </svg>

      {/* Speed Control Slider */}
      <input
        type="range"
        min="0"
        max="180"
        value={speed}
        onChange={handleChange}
        className="w-64 mt-6 accent-cyan-400"
      />
    </div>
  );
};

export default Speedometer;
