import React, { useState } from 'react';

const CaseConverter = () => {
  const [text, setText] = useState('');

  const handleUpperCase = () => setText(text.toUpperCase());
  const handleLowerCase = () => setText(text.toLowerCase());
  const handleCapitalize = () =>
    setText(text.replace(/\b\w/g, char => char.toUpperCase()));
  const handleRemoveSpaces = () =>
    setText(text.replace(/\s+/g, ' ').trim());
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };
  const handleClear = () => setText('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🔤 Text Case Converter
        </h1>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-4"
          rows="6"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button onClick={handleUpperCase} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">UPPERCASE</button>
          <button onClick={handleLowerCase} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">lowercase</button>
          <button onClick={handleCapitalize} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">Capitalize</button>
          <button onClick={handleRemoveSpaces} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Remove Spaces</button>
          <button onClick={handleCopy} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Copy</button>
          <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Clear</button>
        </div>

        <div className="text-center text-gray-600">
          <p className="text-sm">📝 Words: <span className="font-medium">{text.trim() === '' ? 0 : text.trim().split(/\s+/).length}</span> | Characters: <span className="font-medium">{text.length}</span></p>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
