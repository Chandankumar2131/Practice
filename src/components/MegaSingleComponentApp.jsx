import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sun, Moon } from "lucide-react";

// simple markdown-to-html stub
const markdownToHtml = (md) => md.replace(/\n/g, "<br/>");

export default function MegaSingleComponentApp() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("dashboard");

  // KPI data
  const kpi = { revenue: 52300, users: 1280, churn: 4.6 };
  const revenueData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 4000 },
    { month: "Apr", revenue: 3500 },
  ];
  const userSegments = [
    { name: "Free", value: 400 },
    { name: "Pro", value: 300 },
    { name: "Enterprise", value: 100 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Design UI", status: "todo" },
    { id: 2, text: "Setup backend", status: "inprogress" },
    { id: 3, text: "Deploy", status: "done" },
  ]);

  // Table data
  const [people] = useState([
    { id: 1, name: "Alice", role: "Admin", age: 24 },
    { id: 2, name: "Bob", role: "User", age: 30 },
    { id: 3, name: "Charlie", role: "Manager", age: 28 },
  ]);
  const [search, setSearch] = useState("");

  // Form state
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });

  return (
    <div className={dark ? "dark bg-gray-900 text-gray-100 min-h-screen" : "bg-gray-50 text-gray-900 min-h-screen"}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">MegaApp</h1>
        <div className="flex gap-4 items-center">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            <option value="dashboard">Dashboard</option>
            <option value="tasks">Tasks</option>
            <option value="notes">Notes</option>
            <option value="table">Table</option>
            <option value="profile">Profile</option>
          </select>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <main className="p-6 space-y-6">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
              <h2 className="font-semibold mb-2">Revenue</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
              <h2 className="font-semibold mb-2">User Segments</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={userSegments} dataKey="value" label>
                    {userSegments.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow col-span-full flex gap-4">
              <KpiCard title="Revenue" value={`$${kpi.revenue}`} desc="This month" />
              <KpiCard title="Users" value={kpi.users} desc="Active users" />
              <KpiCard title="Churn" value={`${kpi.churn}%`} desc="Monthly avg" />
            </div>
          </motion.div>
        )}

        {/* Tasks */}
        {tab === "tasks" && (
          <div className="grid md:grid-cols-3 gap-6">
            {["todo", "inprogress", "done"].map((col) => (
              <div key={col} className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
                <h3 className="font-semibold capitalize">{col}</h3>
                {tasks.filter((t) => t.status === col).map((t) => (
                  <div key={t.id} className="p-2 mt-2 bg-gray-100 dark:bg-gray-700 rounded">{t.text}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {tab === "notes" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
              <h3 className="font-semibold">Add Note</h3>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700"
              />
              <button
                onClick={() => { setNotes([...notes, { body: noteInput }]); setNoteInput(""); }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
            <div className="space-y-2">
              {notes.map((n, i) => (
                <div key={i} className="p-2 bg-gray-100 dark:bg-gray-700 rounded" dangerouslySetInnerHTML={{ __html: markdownToHtml(n.body) }} />
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {tab === "table" && (
          <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="mb-2 p-2 border rounded w-full"
            />
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>Name</th><th>Role</th><th>Age</th>
                </tr>
              </thead>
              <tbody>
                {people.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.role}</td><td>{p.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Profile Form */}
        {tab === "profile" && (
          <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow max-w-md">
            <h3 className="font-semibold">Profile</h3>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setProfile({ ...profile, avatar: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
              className="mt-2"
            />
            {profile.avatar && <img src={profile.avatar} alt="avatar" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
        )}
      </main>
    </div>
  );
}

// helper card
function KpiCard({ title, value, desc }) {
  return (
    <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 rounded">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs">{desc}</div>
    </div>
  );
}
