import React, { useState } from "react";

export default function CrudApp() {
  const [items, setItems] = useState([]); // store list of items
  const [input, setInput] = useState(""); // store current input value
  const [editIndex, setEditIndex] = useState(null); // track index for edit mode

  const handleAddOrUpdate = () => {
    if (input.trim() === "") return; // avoid empty values

    if (editIndex !== null) {
      // update existing item
      const updatedItems = [...items];
      updatedItems[editIndex] = input;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      // add new item
      setItems([...items, input]);
    }

    setInput(""); // reset input field
  };

  const handleEdit = (index) => {
    setInput(items[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null); // cancel edit mode if deleting edited item
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">React CRUD (Single Component)</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="space-y-2 w-64">
        {items.length === 0 && <p className="text-gray-500">No items yet.</p>}
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>{item}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
