import React, { useEffect, useMemo, useRef, useState } from "react";

export default function WhackAMole() {
  const [gridSize, setGridSize] = useState(3); // 3x3 by default
  const totalHoles = useMemo(() => gridSize * gridSize, [gridSize]);
  const [moleIndex, setMoleIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("Normal");
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("wam_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const tickRef = useRef(null);
  const moleRef = useRef(null);

  const speed = useMemo(() => {
    switch (difficulty) {
      case "Easy":
        return 800;
      case "Normal":
        return 600;
      case "Hard":
        return 420;
      case "Insane":
        return 260;
      default:
        return 600;
    }
  }, [difficulty]);

  useEffect(() => {
    if (!isPlaying) return;

    // Game timer (seconds)
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAllIntervals();
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Mole movement
    moleRef.current = setInterval(() => {
      setMoleIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * totalHoles);
        }
        return next;
      });
    }, speed);

    return () => clearAllIntervals();
  }, [isPlaying, speed, totalHoles]);

  function clearAllIntervals() {
    if (tickRef.current) clearInterval(tickRef.current);
    if (moleRef.current) clearInterval(moleRef.current);
    tickRef.current = null;
    moleRef.current = null;
  }

  function endGame() {
    setIsPlaying(false);
    setMoleIndex(null);
    setHighScore((hs) => {
      const next = Math.max(hs, score);
      localStorage.setItem("wam_highscore", String(next));
      return next;
    });
  }

  function startGame() {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setMoleIndex(Math.floor(Math.random() * totalHoles));
  }

  function stopGame() {
    clearAllIntervals();
    endGame();
  }

  function handleHoleClick(idx) {
    if (!isPlaying) return;
    if (idx === moleIndex) {
      setScore((s) => s + 1);
      // move mole immediately to avoid double clicks
      setMoleIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * totalHoles);
        }
        return next;
      });
    } else {
      // small penalty for miss
      setScore((s) => (s > 0 ? s - 1 : 0));
    }
  }

  const gridTemplate = {
    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Whack-a-Mole <span className="text-sky-400">(Single Component)</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">Grid</span>
            <select
              className="bg-slate-700/60 rounded-xl px-3 py-2 outline-none ring-1 ring-slate-600 hover:ring-slate-500"
              value={gridSize}
              disabled={isPlaying}
              onChange={(e) => setGridSize(parseInt(e.target.value, 10))}
            >
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>{`${n} x ${n}`}</option>
              ))}
            </select>

            <span className="text-sm opacity-80 ml-2">Difficulty</span>
            <select
              className="bg-slate-700/60 rounded-xl px-3 py-2 outline-none ring-1 ring-slate-600 hover:ring-slate-500"
              value={difficulty}
              disabled={isPlaying}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {["Easy", "Normal", "Hard", "Insane"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card label="Score" value={score} />
          <Card label="Time" value={`${timeLeft}s`} />
          <Card label="High Score" value={highScore} />
          <Card label="Speed" value={`${speed}ms`} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.99] shadow-lg shadow-sky-900/30"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-[0.99] shadow-lg shadow-rose-900/30"
            >
              Stop
            </button>
          )}
          <button
            onClick={() => {
              setScore(0);
              setTimeLeft(30);
              setMoleIndex(null);
              setIsPlaying(false);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-700 hover:bg-slate-600 active:scale-[0.99] ring-1 ring-slate-600"
          >
            Reset
          </button>
        </div>

        {/* Grid */}
        <div className="grid gap-3 select-none" style={gridTemplate}>
          {Array.from({ length: totalHoles }).map((_, idx) => {
            const active = idx === moleIndex && isPlaying;
            return (
              <button
                key={idx}
                onClick={() => handleHoleClick(idx)}
                className={[
                  "relative aspect-square rounded-2xl border border-slate-700 overflow-hidden",
                  "bg-slate-800 hover:bg-slate-700 transition",
                  active ? "ring-2 ring-sky-400 shadow-lg shadow-sky-900/30" : "",
                ].join(" ")}
              >
                {/* Hole */}
                <div className="absolute inset-0 flex items-end justify-center p-2">
                  {/* Mole */}
                  <div
                    className={[
                      "w-[70%] aspect-[1/0.8] rounded-t-[999px] rounded-b-[30%]",
                      "transition-transform duration-150",
                      active ? "translate-y-0" : "translate-y-[120%]",
                      "bg-gradient-to-b from-amber-400 to-amber-700",
                      "shadow-inner shadow-black/40",
                    ].join(" ")}
                    aria-hidden
                  />
                </div>
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900 to-emerald-700" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm opacity-70 text-center">
          Tip: Increase grid size or difficulty for a bigger challenge.
        </p>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-800/70 ring-1 ring-slate-700 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
