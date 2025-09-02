import React, { useState, useEffect } from "react";

export default function SuperLudo() {
  const trackLength = 20;
  const tokensPerPlayer = 2;
  const safeZones = [0, 8, 16, trackLength - 1];

  const [positions, setPositions] = useState(
    Array.from({ length: 4 }, () => Array(tokensPerPlayer).fill(-1))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [winnerList, setWinnerList] = useState([]);
  const [scores, setScores] = useState(Array(4).fill(0));
  const [darkMode, setDarkMode] = useState(false);

  // Roll dice with animation
  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 100);
  };

  const moveToken = (player, tokenIdx) => {
    if (rolling || dice === null || player !== currentPlayer) return;

    setPositions((prev) => {
      const newPos = prev.map((tokens, idx) => [...tokens]);

      let curr = newPos[player][tokenIdx];
      if (curr === -1 && dice === 6) {
        newPos[player][tokenIdx] = 0;
      } else if (curr >= 0) {
        let next = curr + dice;
        if (next >= trackLength) {
          next = trackLength;
          if (next === trackLength) {
            // token finished
            if (!winnerList.includes(player)) {
              setWinnerList((w) => [...w, player]);
              setScores((s) =>
                s.map((score, idx) => (idx === player ? score + 1 : score))
              );
            }
          }
        }
        newPos[player][tokenIdx] = next;

        // capture logic
        if (!safeZones.includes(next) && next < trackLength) {
          newPos.forEach((tokens, pIdx) => {
            if (pIdx !== player) {
              tokens.forEach((t, tIdx) => {
                if (t === next) {
                  newPos[pIdx][tIdx] = -1; // send back home
                }
              });
            }
          });
        }
      }

      return newPos;
    });

    // switch turn
    setDice(null);
    setCurrentPlayer((p) => (p + 1) % 4);
  };

  const resetGame = () => {
    setPositions(Array.from({ length: 4 }, () => Array(tokensPerPlayer).fill(-1)));
    setCurrentPlayer(0);
    setDice(null);
    setWinnerList([]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">🎲 Super Ludo</h1>

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 px-4 py-2 rounded-lg shadow bg-indigo-500 text-white"
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      {/* Board */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: trackLength }).map((_, i) => {
          let playersHere = [];
          positions.forEach((tokens, pIdx) => {
            tokens.forEach((t) => {
              if (t === i) playersHere.push(pIdx);
            });
          });

          const isSafe = safeZones.includes(i);
          return (
            <div
              key={i}
              className={`w-16 h-16 flex items-center justify-center rounded-xl border 
              ${isSafe ? "bg-green-300" : "bg-white"}
              ${darkMode ? "text-black" : ""}`}
            >
              {playersHere.length > 0 &&
                playersHere.map((p, idx) => (
                  <span
                    key={idx}
                    className={`px-1 rounded-full text-xs font-bold ${
                      ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"][
                        p
                      ]
                    } text-white`}
                  >
                    P{p + 1}
                  </span>
                ))}
              {playersHere.length === 0 && <span>{i}</span>}
            </div>
          );
        })}
      </div>

      {/* Dice */}
      <button
        onClick={rollDice}
        disabled={rolling}
        className="mb-4 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow"
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
      {dice && <div className="text-2xl mb-4">🎲 {dice}</div>}

      {/* Players */}
      <div className="flex gap-4 mb-6">
        {positions.map((tokens, pIdx) => (
          <div
            key={pIdx}
            className={`p-4 rounded-xl shadow ${
              currentPlayer === pIdx ? "border-4 border-indigo-500" : "border"
            }`}
          >
            <h2
              className={`font-bold mb-2 ${
                ["text-red-500", "text-blue-500", "text-yellow-500", "text-purple-500"][
                  pIdx
                ]
              }`}
            >
              Player {pIdx + 1}
            </h2>
            <div className="flex gap-2">
              {tokens.map((pos, tIdx) => (
                <button
                  key={tIdx}
                  onClick={() => moveToken(pIdx, tIdx)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {pos === -1 ? "🏠" : pos === trackLength ? "🏁" : pos}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Winner List */}
      {winnerList.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold">🏆 Winners</h2>
          {winnerList.map((w, idx) => (
            <p key={idx}>
              {idx + 1}️⃣ Player {w + 1}
            </p>
          ))}
        </div>
      )}

      {/* Scoreboard */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">📊 Scoreboard</h2>
        {scores.map((s, i) => (
          <p key={i}>
            Player {i + 1}: {s}
          </p>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-2 bg-red-500 text-white rounded-lg shadow"
      >
        🔄 Reset Game
      </button>
    </div>
  );
}
