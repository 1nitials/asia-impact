"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    topic: "",
    image_url: "",
    content_type: "feed",
  });
  const [theme, setTheme] = useState("dark");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const subscribedTopics = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Literature",
    "Art",
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/create-educational-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error creating content: ${response.status}`);
      }

      window.location.href = "/educational-instagram";
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md mx-auto ${
            theme === "dark" ? "bg-[#1a1f2c]" : "bg-white"
          } min-h-screen pb-16`}
        >
          <header
            className={`sticky top-0 ${
              theme === "dark" ? "bg-[#1a1f2c]" : "bg-white"
            } border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } px-4 py-3 z-10`}
          >
            <div className="flex items-center">
              <a
                href="/educational-instagram"
                className={`${
                  theme === "dark"
                    ? "text-white hover:text-gray-300"
                    : "text-gray-900 hover:text-gray-600"
                } mr-4`}
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </a>
              <h1
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } font-inter`}
              >
                Create New Content
              </h1>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 mb-4 text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-inter`}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`w-full p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } font-inter`}
                required
              />
            </div>
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-inter`}
              >
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className={`w-full p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } font-inter`}
                rows="4"
                required
              />
            </div>
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-inter`}
              >
                Topic
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, topic: e.target.value }))
                }
                className={`w-full p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } font-inter`}
                required
              >
                <option value="">Select a topic</option>
                {subscribedTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-inter`}
              >
                Image URL (optional)
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image_url: e.target.value,
                  }))
                }
                className={`w-full p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } font-inter`}
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-inter`}
              >
                Content Type
              </label>
              <select
                name="content_type"
                value={formData.content_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content_type: e.target.value,
                  }))
                }
                className={`w-full p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } font-inter`}
                required
              >
                <option value="feed">Feed Post</option>
                <option value="flashcard">Flash Card</option>
                <option value="both">Both</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${
                isSubmitting
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              } text-white transition-colors font-inter`}
            >
              {isSubmitting ? "Creating..." : "Create Content"}
            </button>
          </form>

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "dark"
                ? "bg-[#1a1f2c] border-gray-700"
                : "bg-white border-gray-200"
            } border-t px-4 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-home text-xl"></i>
            </a>
            <a
              href="/search"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-search text-xl"></i>
            </a>
            <button
              className={theme === "dark" ? "text-white" : "text-gray-900"}
            >
              <i className="fas fa-plus text-xl"></i>
            </button>
            <a
              href="/interactive"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-tv text-xl"></i>
            </a>
            <a
              href="/profile"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-user text-xl"></i>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}

export default MainComponent;