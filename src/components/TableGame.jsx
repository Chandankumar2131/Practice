import React, { useState } from "react";

const TableGame = () => {
  // Initialize a 3x3 table with empty strings
  const [table, setTable] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [score, setScore] = useState(0);

  // Function to handle cell click
  const handleClick = (row, col) => {
    if (table[row][col] !== "") return; // prevent clicking an already filled cell

    const randomNumber = Math.floor(Math.random() * 10) + 1; // 1-10
    const newTable = table.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? randomNumber : c))
    );

    setTable(newTable);
    setScore(score + randomNumber);
  };

  // Function to reset the game
  const resetGame = () => {
    setTable([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setScore(0);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Table Game</h1>
      <h2>Score: {score}</h2>
      <table
        style={{
          margin: "0 auto",
          borderCollapse: "collapse",
          fontSize: "24px",
        }}
      >
        <tbody>
          {table.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  onClick={() => handleClick(rIdx, cIdx)}
                  style={{
                    width: "60px",
                    height: "60px",
                    border: "2px solid black",
                    cursor: "pointer",
                    backgroundColor: cell ? "#a0e7e5" : "#f0f0f0",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button onClick={resetGame} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Reset Game
      </button>
    </div>
  );
};

export default TableGame;
