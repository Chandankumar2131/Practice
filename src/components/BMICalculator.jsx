import { useState } from "react";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const result = (w / (h * h)).toFixed(2);
      setBmi(result);

      if (result < 18.5) setCategory("Underweight");
      else if (result >= 18.5 && result < 24.9) setCategory("Normal");
      else if (result >= 25 && result < 29.9) setCategory("Overweight");
      else setCategory("Obese");
    } else {
      setBmi(null);
      setCategory("");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">💪 BMI Calculator</h1>

      <input
        type="number"
        placeholder="Height in cm"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        placeholder="Weight in kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={calculateBMI}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Calculate BMI
      </button>

      {bmi && (
        <div className="mt-6 text-lg font-medium">
          <p>Your BMI: <span className="font-bold">{bmi}</span></p>
          <p className="mt-2">Category: <span className="font-bold">{category}</span></p>
        </div>
      )}
    </div>
  );
}
