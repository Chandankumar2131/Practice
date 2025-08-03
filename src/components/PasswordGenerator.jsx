import React, { useState } from "react";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
    let chars = "";
    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumber) chars += numbers;
    if (includeSymbol) chars += symbols;

    if (chars === "") return;

    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(newPass);
    assessStrength(newPass);
  };

  const assessStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) setStrength("Weak");
    else if (score === 2 || score === 3) setStrength("Medium");
    else setStrength("Strong");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  };

  return (
    <div style={styles.container}>
      <h1>🔐 Password Generator</h1>
      <div style={styles.row}>
        <label>Password Length:</label>
        <input
          type="number"
          min="4"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          style={styles.input}
        />
      </div>
      <div style={styles.row}>
        <label><input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(!includeUpper)} /> Uppercase</label>
        <label><input type="checkbox" checked={includeLower} onChange={() => setIncludeLower(!includeLower)} /> Lowercase</label>
        <label><input type="checkbox" checked={includeNumber} onChange={() => setIncludeNumber(!includeNumber)} /> Numbers</label>
        <label><input type="checkbox" checked={includeSymbol} onChange={() => setIncludeSymbol(!includeSymbol)} /> Symbols</label>
      </div>
      <button onClick={generatePassword} style={styles.button}>Generate Password</button>

      {password && (
        <>
          <h2 style={styles.password}>{password}</h2>
          <p style={{ color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red" }}>
            Strength: {strength}
          </p>
          <button onClick={copyToClipboard} style={styles.copyBtn}>📋 Copy</button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial",
    textAlign: "center",
    background: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  row: {
    margin: "15px 0",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "10px",
  },
  input: {
    padding: "5px",
    width: "80px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "20px 0",
    cursor: "pointer",
  },
  copyBtn: {
    padding: "6px 14px",
    cursor: "pointer",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  password: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "20px",
    wordBreak: "break-all",
  },
};

export default PasswordGenerator;
