import React, { useState } from "react";

// Single-file Rock-Paper-Scissors game (React)
// - Player vs Computer
// - Score tracking for session
// - Reset scores button
// - Simple styling with Tailwind classes

export default function RockPaperScissors() {
  const choices = ["Rock", "Paper", "Scissors"];
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ Player: 0, Computer: 0, Draws: 0 });

  function play(choice) {
    const compChoice = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setComputerChoice(compChoice);

    let res = "";
    if (choice === compChoice) {
      res = "Draw";
      setScores((s) => ({ ...s, Draws: s.Draws + 1 }));
    } else if (
      (choice === "Rock" && compChoice === "Scissors") ||
      (choice === "Paper" && compChoice === "Rock") ||
      (choice === "Scissors" && compChoice === "Paper")
    ) {
      res = "You Win!";
      setScores((s) => ({ ...s, Player: s.Player + 1 }));
    } else {
      res = "Computer Wins!";
      setScores((s) => ({ ...s, Computer: s.Computer + 1 }));
    }
    setResult(res);
  }

  function resetScores() {
    setScores({ Player: 0, Computer: 0, Draws: 0 });
    setResult("");
    setPlayerChoice(null);
    setComputerChoice(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Rock • Paper • Scissors</h1>

        <div className="flex justify-center space-x-4 mb-6">
          {choices.map((c) => (
            <button
              key={c}
              onClick={() => play(c)}
              className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold"
            >
              {c}
            </button>
          ))}
        </div>

        {result && (
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">{result}</p>
            <p className="text-sm text-gray-600">You chose: {playerChoice}</p>
            <p className="text-sm text-gray-600">Computer chose: {computerChoice}</p>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-700">
          <p>Scores:</p>
          <p className="text-xs text-gray-600">Player: {scores.Player} • Computer: {scores.Computer} • Draws: {scores.Draws}</p>
        </div>

        <button
          onClick={resetScores}
          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm"
        >
          Reset Scores
        </button>

        <div className="mt-4 text-xs text-gray-400">Single-file component — render &lt;RockPaperScissors /&gt; anywhere in your React app.</div>
      </div>
    </div>
  );
}
