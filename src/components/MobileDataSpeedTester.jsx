import React, { useState, useRef } from "react";

// Single-file React component (default export)
// Tailwind CSS classes are used for styling (no import required when used in Tailwind project)

export default function MobileDataSpeedTester() {
  const [running, setRunning] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [bytesReceived, setBytesReceived] = useState(0);
  const [mbps, setMbps] = useState(null);
  const [instantSpeed, setInstantSpeed] = useState(null);
  const [testUrl, setTestUrl] = useState("https://speed.hetzner.de/5MB.bin");
  const [message, setMessage] = useState("");
  const controllerRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastTimeRef = useRef(null);
  const lastBytesRef = useRef(0);

  // Options for test files (note: downloading uses mobile data!)
  const options = [
    { label: "1 MB (low data)", url: "https://speed.hetzner.de/1MB.bin" },
    { label: "5 MB (recommended)", url: "https://speed.hetzner.de/5MB.bin" },
    { label: "10 MB (more accurate)", url: "https://speed.hetzner.de/10MB.bin" },
  ];

  const formatMbps = (val) => {
    if (val === null) return "-";
    return `${val.toFixed(2)} Mbps`;
  };

  const humanBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  async function runDownloadTest(url) {
    try {
      setMessage("");
      setRunning(true);
      setProgressPct(0);
      setElapsedSec(0);
      setBytesReceived(0);
      setMbps(null);
      setInstantSpeed(null);

      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      startTimeRef.current = performance.now();
      lastTimeRef.current = startTimeRef.current;
      lastBytesRef.current = 0;

      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const contentLength = res.headers.get("Content-Length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : null;

      const reader = res.body.getReader();
      let received = 0;
      const start = performance.now();

      while (true) {
        const { done, value } = await reader.read();
        const now = performance.now();
        if (done) break;
        received += value.length;

        // update bytes and elapsed
        const elapsed = (now - start) / 1000; // seconds
        setElapsedSec(elapsed);
        setBytesReceived(received);

        // progress percent if total known
        if (totalBytes) {
          setProgressPct(Math.min(100, (received / totalBytes) * 100));
        } else {
          // estimate progress with a simple ramp (not accurate)
          setProgressPct((prev) => Math.min(99, prev + 1));
        }

        // instant speed (since last update)
        const timeDiff = (now - lastTimeRef.current) / 1000;
        const bytesDiff = received - lastBytesRef.current;
        if (timeDiff > 0.2) {
          const instBps = (bytesDiff * 8) / timeDiff; // bits per second
          const instMbps = instBps / 1e6;
          setInstantSpeed(instMbps);
          lastTimeRef.current = now;
          lastBytesRef.current = received;
        }

        // overall speed so far
        const bits = received * 8;
        const mbpsSoFar = (bits / elapsed) / 1e6; // Mbps
        setMbps(mbpsSoFar);
      }

      // finalize
      const totalTime = (performance.now() - start) / 1000;
      const finalMbps = ((received * 8) / totalTime) / 1e6;
      setMbps(finalMbps);
      setProgressPct(100);
      setMessage(`Download complete — ${humanBytes(received)} in ${totalTime.toFixed(2)} s`);
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessage('Test cancelled.');
      } else {
        setMessage(`Error: ${err.message}`);
      }
    } finally {
      setRunning(false);
      controllerRef.current = null;
    }
  }

  function startTest() {
    if (running) return;
    // Confirm user understands data cost
    const ok = window.confirm(
      'This test will download up to the selected file size using your mobile data. Continue?'
    );
    if (!ok) return;
    runDownloadTest(testUrl);
  }

  function cancelTest() {
    if (controllerRef.current) controllerRef.current.abort();
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-2">Mobile Data Speed Tester</h2>
      <p className="text-sm text-slate-600 mb-4">Measures download speed (Mbps) by streaming a test file. <span className="font-medium text-red-600">Warning:</span> consumes mobile data.</p>

      <label className="block text-sm font-medium mb-1">Choose test file</label>
      <select
        value={testUrl}
        onChange={(e) => setTestUrl(e.target.value)}
        className="w-full p-2 rounded-md border mb-4"
        disabled={running}
      >
        {options.map((o) => (
          <option key={o.url} value={o.url}>{o.label}</option>
        ))}
      </select>

      <div className="flex gap-2 mb-4">
        <button
          onClick={startTest}
          disabled={running}
          className={`px-4 py-2 rounded-md shadow ${running ? 'bg-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {running ? 'Running...' : 'Start Download Test'}
        </button>
        <button
          onClick={cancelTest}
          disabled={!running}
          className={`px-4 py-2 rounded-md shadow ${!running ? 'bg-slate-200' : 'bg-red-600 text-white hover:bg-red-700'}`}>
          Cancel
        </button>
        <button
          onClick={() => {
            setMbps(null); setInstantSpeed(null); setProgressPct(0); setBytesReceived(0); setMessage('');
          }}
          className="px-3 py-2 rounded-md bg-slate-100"
        >Reset</button>
      </div>

      <div className="mb-4">
        <div className="w-full h-4 bg-slate-200 rounded overflow-hidden">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Progress: {progressPct.toFixed(0)}%</span>
          <span>{humanBytes(bytesReceived)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-slate-50 rounded">
          <div className="text-xs text-slate-500">Overall Speed</div>
          <div className="text-lg font-medium mt-1">{formatMbps(mbps)}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded">
          <div className="text-xs text-slate-500">Instant Speed</div>
          <div className="text-lg font-medium mt-1">{instantSpeed ? `${instantSpeed.toFixed(2)} Mbps` : '-'}</div>
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-3">Elapsed: {elapsedSec ? elapsedSec.toFixed(2) : 0} s</div>

      {message && (
        <div className="p-3 bg-slate-100 rounded text-sm mb-2">{message}</div>
      )}

      <div className="text-xs text-slate-500">Notes:</div>
      <ul className="list-disc pl-5 text-xs text-slate-500">
        <li>This measures **download** speed only (no server-side upload test).</li>
        <li>Results vary with network conditions, server location and congestion.</li>
        <li>Use the 1MB option if you have very limited data; 10MB is more accurate.</li>
      </ul>
    </div>
  );
}
