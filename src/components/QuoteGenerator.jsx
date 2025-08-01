
import { useState } from 'react';

const quotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success is not for the lazy.",
  "Your only limit is your mind.",
  "Don't stop until you're proud.",
  "Do something today that your future self will thank you for.",
];

function QuoteGenerator() {
  const [quote, setQuote] = useState("Click below to get a motivational quote!");

  const generateQuote = () => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔥 Quote Generator</h1>
        <p className="text-lg text-gray-600 mb-4">{quote}</p>
        <button
          onClick={generateQuote}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Generate Quote
        </button>
      </div>
    </div>
  );
}

export default QuoteGenerator ;
