import React, { useEffect, useRef, useState } from "react";

const ChatRoom = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>💬 Simple Chat Room</h2>
      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            <span>{msg.text}</span>
            <span style={styles.time}>{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  message: {
    marginBottom: "10px",
    padding: "8px",
    backgroundColor: "#e0f7fa",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: "12px",
    color: "#555",
    marginLeft: "10px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ChatRoom;
