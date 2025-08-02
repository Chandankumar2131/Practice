import React, { useState, useEffect } from "react";

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tags, setTags] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title) return;
    const tagList = tags.split(",").map(tag => tag.trim().toLowerCase());
    const newTask = {
      id: Date.now(),
      title,
      priority,
      tags: tagList,
    };
    setTasks([newTask, ...tasks]);
    setTitle("");
    setPriority("Low");
    setTags("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTag = filterTag ? task.tags.includes(filterTag.toLowerCase()) : true;
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    return matchesTag && matchesPriority;
  });

  return (
    <div style={{
      padding: "30px",
      background: "#f1f5f9",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>
      <h1 style={{ textAlign: "center" }}>📋 Advanced Task Manager</h1>

      {/* Add Task */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", flex: 1, minWidth: "200px" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: "10px", flex: 1, minWidth: "200px" }}
        />
        <button onClick={addTask} style={{
          padding: "10px 20px",
          background: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}>
          ➕ Add Task
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", justifyContent: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={{ padding: "8px" }}
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Task List */}
      <ul style={{ maxWidth: "700px", margin: "auto" }}>
        {filteredTasks.length === 0 && <p style={{ textAlign: "center" }}>No tasks found</p>}
        {filteredTasks.map(task => (
          <li key={task.id} style={{
            background: "#e2e8f0",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}>
            <div>
              <strong>{task.title}</strong> <br />
              <small>Priority: <span style={{ fontWeight: "bold", color: priorityColor(task.priority) }}>{task.priority}</span></small><br />
              <small>Tags: {task.tags.join(", ")}</small>
            </div>
            <button onClick={() => deleteTask(task.id)} style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              height: "40px",
              alignSelf: "center"
            }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const priorityColor = (level) => {
  switch (level) {
    case "High":
      return "#dc2626";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#10b981";
    default:
      return "black";
  }
};

export default TaskManager;
