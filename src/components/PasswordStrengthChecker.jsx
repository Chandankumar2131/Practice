import { useState } from "react";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const checkStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2 || strength === 3) return "Medium";
    return "Strong";
  };

  const strength = checkStrength(password);
  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-500",
    Strong: "text-green-500",
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🔐 Password Strength Checker</h1>
      <input
        type="password"
        placeholder="Enter password"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {strength && (
        <p className={`mt-4 font-semibold text-lg ${strengthColor[strength]}`}>
          Strength: {strength}
        </p>
      )}
    </div>
  );
}
