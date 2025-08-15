import React, { useState } from "react";

const MegaSinglePage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent by ${formData.name}!`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen transition-colors duration-500`}>
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md dark:shadow-gray-700 sticky top-0 z-50 bg-opacity-90 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold">MegaPage</h1>
        <div className="space-x-4 flex items-center">
          {["home", "about", "skills", "projects", "contact"].map((tab) => (
            <button
              key={tab}
              className={`capitalize font-medium ${activeTab === tab ? "underline text-blue-500" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button
            className="ml-4 px-2 py-1 border rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-20">
        
        {/* Home Section */}
        {activeTab === "home" && (
          <section className="text-center space-y-6">
            <h2 className="text-5xl font-bold">Welcome to MegaPage</h2>
            <p className="text-lg max-w-2xl mx-auto">
              This is a large single-page React component demo with multiple sections, animations, modals, and interactivity.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Open Modal
            </button>
          </section>
        )}

        {/* About Section */}
        {activeTab === "about" && (
          <section className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">About Me</h2>
            <p>
              I'm a full-stack developer passionate about creating dynamic and interactive web applications. I specialize in React, Node.js, Express, and MongoDB.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>React & Tailwind CSS</li>
              <li>Node.js & Express.js</li>
              <li>MongoDB & Mongoose</li>
              <li>REST APIs & JWT Authentication</li>
              <li>Context API & Redux Toolkit</li>
            </ul>
          </section>
        )}

        {/* Skills Section with bars */}
        {activeTab === "skills" && (
          <section className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">Skills</h2>
            {[
              { skill: "React", level: 90 },
              { skill: "Node.js", level: 80 },
              { skill: "MongoDB", level: 75 },
              { skill: "Tailwind CSS", level: 85 },
              { skill: "Redux Toolkit", level: 70 },
            ].map((s) => (
              <div key={s.skill} className="space-y-1">
                <span>{s.skill}</span>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-700"
                    style={{ width: `${s.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects Section */}
        {activeTab === "projects" && (
          <section className="space-y-6 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <div
                  key={p}
                  className="p-4 border rounded shadow-lg hover:scale-105 transition-transform bg-white dark:bg-gray-800"
                >
                  <h3 className="text-xl font-semibold mb-2">Project {p}</h3>
                  <p className="mb-2">
                    This is a detailed description of project {p}. It includes features, technologies used, and highlights.
                  </p>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeTab === "contact" && (
          <section className="space-y-6 max-w-lg mx-auto">
            <h2 className="text-4xl font-bold">Contact Me</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Send
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">Hello from Modal!</h3>
            <p>This is a modal popup built inside a single React component.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-6 text-center border-t border-gray-300 dark:border-gray-700">
        &copy; {new Date().getFullYear()} MegaPage. All rights reserved.
      </footer>
    </div>
  );
};

export default MegaSinglePage;
