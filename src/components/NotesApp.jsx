import { useEffect, useState } from "react";

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!text.trim()) return;
    setNotes([
      ...notes,
      {
        id: Date.now(),
        text,
        tag,
        date: new Date().toLocaleString(),
      },
    ]);
    setText("");
    setTag("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.text.toLowerCase().includes(search.toLowerCase()) ||
      n.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-cyan-200 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          📝 Notes App
        </h1>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note here..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="#tag"
            className="w-40 px-4 py-2 border rounded-md"
          />
          <button
            onClick={addNote}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search notes or tags..."
          className="w-full px-4 py-2 mb-6 border rounded-md"
        />

        {/* Notes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.length === 0 && (
            <p className="text-gray-500">No matching notes found.</p>
          )}
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-md relative"
            >
              <p className="text-gray-800 whitespace-pre-wrap">{note.text}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-blue-600 font-medium">
                  #{note.tag || "untagged"}
                </span>
                <span className="text-xs text-gray-400">{note.date}</span>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
