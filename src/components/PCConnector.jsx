// PC Connector - Single File React App
// --------------------------------------------------
// Purpose:
// A single-page React component (export default) that provides a clean UI
// for managing "PC" entries (name, IP/Host, optional port), testing connections
// (simulated by default, with an optional real-fetch attempt), and connecting/disconnecting
// in a mock fashion. Data persists to localStorage.
//
// How to use:
// 1. Create a React app (Vite / Create React App). Ensure Tailwind CSS is configured
//    or replace Tailwind classes with your own CSS.
// 2. Save this file as `PCConnector.jsx` and import it in your `App.jsx`:
//      import PCConnector from './PCConnector';
//      export default function App(){ return <PCConnector/> }
// 3. Run `npm start`.
//
// Notes:
// - The component simulates network tests by default because browsers block raw ICMP pings
//   and cross-origin HTTP to arbitrary IPs. There is a "Try real HTTP test" toggle which
//   attempts a fetch to the target host (may fail due to CORS or closed ports).
// - All operations are client-side: add/delete/edit PCs, test connection (simulated), connect/disconnect (stateful).
//
// Features included:
// - Add / Edit / Delete PC entries
// - Test connection (simulated or real fetch)
// - Connect / Disconnect simulation with live logs
// - Persisted storage (localStorage)
// - Keyboard-friendly forms and accessibility considerations
// - Responsive layout using Tailwind-compatible classes

import React, { useEffect, useState, useRef } from 'react';

export default function PCConnector() {
  // State
  const [pcs, setPcs] = useState(() => {
    try {
      const raw = localStorage.getItem('pc_connector_pcs');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [form, setForm] = useState({ name: '', host: '', port: '' });
  const [editingId, setEditingId] = useState(null);
  const [logs, setLogs] = useState(() => {
    try {
      const raw = localStorage.getItem('pc_connector_logs');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [realHttpTest, setRealHttpTest] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const logEndRef = useRef(null);

  // Persist state
  useEffect(() => {
    localStorage.setItem('pc_connector_pcs', JSON.stringify(pcs));
  }, [pcs]);

  useEffect(() => {
    localStorage.setItem('pc_connector_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    // auto-scroll logs
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Helpers
  function pushLog(text, level = 'info') {
    const entry = { id: Date.now() + Math.random(), text, level, time: new Date().toISOString() };
    setLogs((s) => [...s, entry].slice(-500)); // keep last 500
  }

  function resetForm() {
    setForm({ name: '', host: '', port: '' });
    setEditingId(null);
  }

  function validateHost(host) {
    // basic validation for IP or hostname
    if (!host || !host.trim()) return false;
    // very permissive regex: allow letters, digits, dots, hyphens
    return /^[a-zA-Z0-9.:-]+$/.test(host.trim());
  }

  // CRUD
  function addOrUpdatePc(e) {
    e.preventDefault();
    const { name, host, port } = form;
    if (!name.trim()) return pushLog('Name is required', 'error');
    if (!validateHost(host)) return pushLog('Host is invalid', 'error');

    if (editingId) {
      setPcs((s) => s.map((p) => (p.id === editingId ? { ...p, name: name.trim(), host: host.trim(), port: port.trim() } : p)));
      pushLog(`Updated PC: ${name}`);
    } else {
      const newPc = { id: Date.now() + Math.random(), name: name.trim(), host: host.trim(), port: port.trim(), connected: false };
      setPcs((s) => [newPc, ...s]);
      pushLog(`Added PC: ${name}`);
    }

    resetForm();
  }

  function startEdit(pc) {
    setForm({ name: pc.name, host: pc.host, port: pc.port || '' });
    setEditingId(pc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function removePc(id) {
    const target = pcs.find((p) => p.id === id);
    setPcs((s) => s.filter((p) => p.id !== id));
    pushLog(`Removed PC: ${target?.name || id}`, 'warn');
  }

  // Simulated connect / disconnect
  function connectPc(id) {
    setPcs((s) => s.map((p) => (p.id === id ? { ...p, connected: true } : p)));
    pushLog(`Connected to PC ${pcs.find((p) => p.id === id)?.name || ''}`);
  }

  function disconnectPc(id) {
    setPcs((s) => s.map((p) => (p.id === id ? { ...p, connected: false } : p)));
    pushLog(`Disconnected from PC ${pcs.find((p) => p.id === id)?.name || ''}`, 'warn');
  }

  // Test connection (simulated by default)
  async function testConnection(pc) {
    setLoadingId(pc.id);
    pushLog(`Testing connection to ${pc.name} (${pc.host}${pc.port ? ':' + pc.port : ''})...`);

    // If realHttpTest is enabled, attempt a fetch (may fail due to CORS)
    if (realHttpTest) {
      const url = `http://${pc.host}${pc.port ? ':' + pc.port : ''}/`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          pushLog(`Real HTTP test succeeded for ${pc.name}`);
          setLoadingId(null);
          return true;
        } else {
          pushLog(`Real HTTP test returned status ${res.status}`);
          setLoadingId(null);
          return false;
        }
      } catch (err) {
        pushLog(`Real HTTP test failed: ${err.message}`, 'error');
        setLoadingId(null);
        return false;
      }
    }

    // Simulation path: random success based on host string
    await new Promise((r) => setTimeout(r, 700 + (pc.host.length % 300)));
    const success = (pc.host.length + pc.name.length) % 2 === 0; // deterministic-ish
    pushLog(success ? `Simulated ping succeeded for ${pc.name}` : `Simulated ping failed for ${pc.name}`, success ? 'info' : 'error');
    setLoadingId(null);
    return success;
  }

  // UI helpers
  function formatTime(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch { return iso }
  }

  // Quick actions
  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text).then(() => pushLog(`Copied: ${text}`)).catch(() => pushLog('Copy failed', 'error'));
  }

  function clearLogs() {
    setLogs([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Form + Settings */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow p-5">
          <h2 className="text-2xl font-semibold mb-2">PC Connector</h2>
          <p className="text-sm text-gray-500 mb-4">Add PCs, test connections (simulated) and connect/disconnect.</p>

          <form onSubmit={addOrUpdatePc} className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="Workstation-1"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Host (IP or hostname)</span>
              <input
                value={form.host}
                onChange={(e) => setForm((s) => ({ ...s, host: e.target.value }))}
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="192.168.1.15 or my-pc.local"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Port (optional)</span>
              <input
                value={form.port}
                onChange={(e) => setForm((s) => ({ ...s, port: e.target.value }))}
                className="mt-1 block w-full rounded-md border p-2"
                placeholder="80"
              />
            </label>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:opacity-95">
                {editingId ? 'Update PC' : 'Add PC'}
              </button>
              <button type="button" className="px-3 py-2 border rounded-md" onClick={resetForm}>Reset</button>
            </div>
          </form>

          <hr className="my-4" />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={realHttpTest} onChange={(e) => setRealHttpTest(e.target.checked)} />
              <span>Try real HTTP test (may CORS/fail)</span>
            </label>
            <button className="text-xs text-red-600" onClick={() => { setPcs([]); pushLog('Cleared all PCs', 'warn') }}>Clear PCs</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">Local storage used for persistence. This is a demo — no real remote control is performed.</div>
        </div>

        {/* Middle: PC list */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Saved PCs</h3>

          {pcs.length === 0 ? (
            <div className="text-sm text-gray-500">No PCs added yet. Add one from the left.</div>
          ) : (
            <ul className="space-y-3">
              {pcs.map((pc) => (
                <li key={pc.id} className="flex items-center justify-between gap-3 border rounded p-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <strong>{pc.name}</strong>
                      <span className="text-xs text-gray-500">{pc.host}{pc.port ? ':' + pc.port : ''}</span>
                    </div>
                    <div className="text-xs mt-1 text-gray-600">Status: <span className={`${pc.connected ? 'text-green-600' : 'text-red-600'}`}>{pc.connected ? 'Connected' : 'Disconnected'}</span></div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-sm border rounded" onClick={() => startEdit(pc)}>Edit</button>
                      <button className="px-2 py-1 text-sm border rounded" onClick={() => removePc(pc.id)}>Delete</button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 text-sm rounded ${pc.connected ? 'bg-yellow-100 border' : 'bg-green-600 text-white'}`}
                        onClick={() => (pc.connected ? disconnectPc(pc.id) : connectPc(pc.id))}
                      >
                        {pc.connected ? 'Disconnect' : 'Connect'}
                      </button>

                      <button
                        className="px-2 py-1 text-sm border rounded"
                        onClick={async () => {
                          const res = await testConnection(pc);
                          if (res) pushLog(`Test OK — ${pc.name}`);
                          else pushLog(`Test FAILED — ${pc.name}`, 'error');
                        }}
                      >
                        {loadingId === pc.id ? 'Testing...' : 'Test'}
                      </button>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Logs */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Activity Logs</h3>
            <div className="flex gap-2">
              <button className="text-sm px-2 py-1 border rounded" onClick={() => { copyToClipboard(JSON.stringify(pcs, null, 2)); pushLog('Exported PCs to clipboard') }}>Export</button>
              <button className="text-sm px-2 py-1 border rounded" onClick={clearLogs}>Clear</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto border rounded p-3 bg-gray-50 text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No activity yet.</div>
            ) : (
              <ul className="space-y-2">
                {logs.map((ln) => (
                  <li key={ln.id} className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500">{formatTime(ln.time)}</div>
                      <div className={`mt-1 ${ln.level === 'error' ? 'text-red-600' : ln.level === 'warn' ? 'text-yellow-600' : 'text-gray-900'}`}>{ln.text}</div>
                    </div>
                    <div className="ml-3 text-xs text-gray-400">{ln.level}</div>
                  </li>
                ))}
                <div ref={logEndRef} />
              </ul>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">This demo keeps the last 500 logs in localStorage.</div>
        </div>
      </div>

      {/* Footer quick help */}
      <div className="max-w-6xl mx-auto mt-6 text-xs text-gray-600">
        <strong>Note:</strong> Browsers cannot perform raw ICMP pings. "Test" here is a simulated check unless you toggle "Try real HTTP test" and the remote host responds to HTTP/HEAD.
      </div>
    </div>
  );
}
