"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [streak, setStreak] = useState(5);
  const interests = [
    "Mathematics & Logic",
    "Science & Experiments",
    "Programming",
    "Artificial Intelligence",
    "Cybersecurity & Ethical Hacking",
    "Weird Science & Cool Discoveries",
  ];

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme");
      setTheme(currentTheme || "dark");
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(currentTheme || "dark");
    };

    window.addEventListener("storage", handleStorageChange);

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/update-theme-preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme }),
        });
        if (!response.ok) {
          throw new Error("Failed to update theme");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    };
    fetchTheme();
  }, [theme]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div
        className={`min-h-screen ${
          theme === "light" ? "bg-gray-100" : "bg-gray-900"
        }`}
      >
        <div
          className={`max-w-md mx-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          } min-h-screen pb-16 shadow-lg`}
        >
          <header
            className={`sticky top-0 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } border-b ${
              theme === "light" ? "border-gray-200" : "border-gray-700"
            } px-4 py-3 z-10`}
          >
            <div className="flex justify-between items-center">
              <div
                className={`text-lg ${
                  theme === "light" ? "text-gray-900" : "text-gray-300"
                } font-inter`}
              >
                craigthebookworm
              </div>
              <a
                href="/settings"
                className={`${
                  theme === "light"
                    ? "text-gray-900 hover:text-gray-700"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <i className="fas fa-gear text-xl"></i>
              </a>
            </div>
          </header>

          <div className="px-4 text-center">
            <div className="mb-6 pt-4">
              <img
                src="https://ucarecdn.com/6a225a7f-6c4a-49a9-b3e7-91c5a7d75474/-/format/auto/"
                alt="Green alien standing on a scale"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-purple-500"
              />
              <h1
                className={`text-3xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                } mb-1 font-inter`}
              >
                Craig
              </h1>
              <p
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                } font-inter`}
              >
                Beginner Learner
              </p>
            </div>
            <div className="flex justify-center gap-12 mb-6">
              <div>
                <div
                  className={`text-4xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  } font-inter`}
                >
                  6
                </div>
                <div
                  className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } font-inter`}
                >
                  Topics
                </div>
              </div>
              <div>
                <div
                  className={`text-4xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  } font-inter`}
                >
                  9
                </div>
                <div
                  className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } font-inter`}
                >
                  Level
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                className={`flex-1 ${
                  theme === "light"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white rounded-full py-2 px-4 font-inter transition-colors`}
              >
                Edit profile
              </button>
              <button
                className={`flex-1 border ${
                  theme === "light"
                    ? "border-gray-300 text-gray-900 hover:bg-gray-50"
                    : "border-gray-700 text-white hover:bg-gray-700"
                } rounded-full py-2 px-4 font-inter transition-colors`}
              >
                Share profile
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className={`${
                    theme === "light"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-purple-900 bg-opacity-40 text-purple-200"
                  } px-3 py-1 rounded-full text-sm font-inter`}
                >
                  {interest}
                </span>
              ))}
            </div>
            <div
              className={`${
                theme === "light"
                  ? "bg-red-100 text-red-700"
                  : "bg-red-900 bg-opacity-40 text-red-200"
              } px-4 py-2 rounded-full inline-block font-inter transition-colors`}
            >
              <span>{streak} Day Streak! 🔥</span>
            </div>
          </div>

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            } border-t px-4 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-home text-xl"></i>
            </a>
            <a
              href="/search"
              className={`${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-search text-xl"></i>
            </a>
            <button
              href="/add_content"
              className={`${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-plus text-xl"></i>
            </button>
            <a
              href="/interactive"
              className={`${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-tv text-xl"></i>
            </a>
            <button
              className={theme === "light" ? "text-purple-600" : "text-white"}
            >
              <i className="fas fa-user text-xl"></i>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default MainComponent;