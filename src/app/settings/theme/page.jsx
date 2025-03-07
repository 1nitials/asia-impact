"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [theme, setTheme] = useState("dark");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const applyTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  const handleThemeChange = async (newTheme) => {
    if (loading) return;

    try {
      setError(null);
      setLoading(true);

      applyTheme(newTheme);

      const response = await fetch("/api/update-theme-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update theme");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save theme preference");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialTheme = async () => {
      try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          applyTheme(savedTheme);
        }

        const response = await fetch("/api/update-theme-preference");
        if (!response.ok) throw new Error("Failed to fetch theme");
        const data = await response.json();
        if (data.success && data.theme) {
          applyTheme(data.theme);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialTheme();
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div
        className={`min-h-screen ${
          theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
      >
        <div
          className={`max-w-md mx-auto ${
            theme === "light" ? "bg-white" : "bg-[#1a1f2c]"
          } min-h-screen`}
        >
          <header
            className={`sticky top-0 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-[#1a1f2c] border-gray-700"
            } px-4 py-3 border-b z-30`}
          >
            <div className="flex items-center">
              <a
                href="/settings"
                className={`${
                  theme === "light"
                    ? "text-gray-800 hover:text-gray-600"
                    : "text-white hover:text-gray-300"
                } mr-4`}
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </a>
              <h1
                className={`text-lg font-bold font-inter ${
                  theme === "light" ? "text-gray-800" : "text-white"
                }`}
              >
                Theme and accessibility
              </h1>
            </div>
          </header>

          <div className="px-4 py-6">
            <div className="mb-8">
              <h2
                className={`${
                  theme === "light" ? "text-gray-900" : "text-white"
                } font-inter text-lg mb-4`}
              >
                Appearance
              </h2>
              <div className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm font-inter mb-4">
                    {error}
                  </div>
                )}
                <button
                  onClick={() => handleThemeChange("light")}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border
                    ${
                      theme === "light"
                        ? "bg-blue-50 border-blue-100"
                        : "bg-[#2a3241] border-gray-700 hover:bg-[#2a3241]"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-sun text-yellow-500"></i>
                    <span
                      className={`${
                        theme === "light" ? "text-gray-800" : "text-white"
                      } font-inter`}
                    >
                      Light Mode
                    </span>
                  </div>
                  {theme === "light" && (
                    <i className="fas fa-check text-blue-500"></i>
                  )}
                </button>

                <button
                  onClick={() => handleThemeChange("dark")}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border
                    ${
                      theme === "dark"
                        ? "bg-blue-900 border-blue-800"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-50"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-moon text-blue-500"></i>
                    <span
                      className={`${
                        theme === "light" ? "text-gray-800" : "text-white"
                      } font-inter`}
                    >
                      Dark Mode
                    </span>
                  </div>
                  {theme === "dark" && (
                    <i className="fas fa-check text-blue-500"></i>
                  )}
                </button>
                {loading && (
                  <div
                    className={`text-sm font-inter ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Updating theme...
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-[#1a1f2c] border-gray-700"
            } border-t px-4 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-home text-xl"></i>
            </a>
            <a
              href="/search"
              className={`${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-search text-xl"></i>
            </a>
            <a
              href="/add_content"
              className={`${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-plus text-xl"></i>
            </a>
            <a
              href="/interactive"
              className={`${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-tv text-xl"></i>
            </a>
            <a
              href="/profile"
              className={`${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-400 hover:text-white"
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