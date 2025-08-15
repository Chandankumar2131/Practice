import React, { useState } from "react";

const SinglePageComponent = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent by ${formData.name}!`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">MyPage</h1>
        <div className="space-x-4">
          {["home", "about", "projects", "contact"].map((tab) => (
            <button
              key={tab}
              className={`capitalize ${activeTab === tab ? "font-bold underline" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button
            className="ml-4 px-2 py-1 border rounded"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-16">
        {activeTab === "home" && (
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Welcome to My Page</h2>
            <p className="text-lg max-w-xl mx-auto">
              This is a single-page component example with multiple interactive sections, form, and dark mode support.
            </p>
          </section>
        )}

        {activeTab === "about" && (
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">About Me</h2>
            <p>
              I'm a passionate developer with experience in React, Node.js, MongoDB, and more. I love building interactive web applications and learning new technologies.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>React & Tailwind CSS</li>
              <li>Node.js & Express.js</li>
              <li>MongoDB & Mongoose</li>
              <li>REST API & JWT Authentication</li>
            </ul>
          </section>
        )}

        {activeTab === "projects" && (
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((project) => (
                <div
                  key={project}
                  className="p-4 border rounded shadow hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
                  <p>
                    This is a sample project description. It includes key features, technologies used, and what makes it interesting.
                  </p>
                  <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "contact" && (
          <section className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold">Contact Me</h2>
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
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Send
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-gray-300 dark:border-gray-700">
        &copy; {new Date().getFullYear()} MyPage. All rights reserved.
      </footer>
    </div>
  );
};

export default SinglePageComponent;
