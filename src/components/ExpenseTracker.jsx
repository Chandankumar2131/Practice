import React, { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount || !date) return;
    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      date,
    };
    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
    setDate("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{
      fontFamily: "Arial",
      padding: "30px",
      background: "#f8fafc",
      minHeight: "100vh"
    }}>
      <h1 style={{ textAlign: "center" }}>💰 Expense Tracker</h1>

      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        justifyContent: "center"
      }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "10px" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "10px" }}
        />
        <button
          onClick={addExpense}
          style={{
            padding: "10px 15px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>

      <h2 style={{ textAlign: "center" }}>Total: ₹{total.toFixed(2)}</h2>

      <ul style={{ maxWidth: "600px", margin: "auto" }}>
        {expenses.map((e) => (
          <li key={e.id} style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
            padding: "10px",
            background: "#e2e8f0",
            borderRadius: "8px"
          }}>
            <span>
              <strong>{e.title}</strong> - ₹{e.amount.toFixed(2)} <br />
              <small>{e.date}</small>
            </span>
            <button onClick={() => deleteExpense(e.id)} style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
