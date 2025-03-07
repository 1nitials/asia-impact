"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [theme, setTheme] = useState("dark");
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, []);

  const isDarkMode = theme === "dark";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div
          className={`max-w-md mx-auto ${
            isDarkMode ? "bg-[#1a1f2c]" : "bg-white"
          } min-h-screen pb-16`}
        >
          <header
            className={`sticky top-0 ${
              isDarkMode ? "bg-[#1a1f2c]" : "bg-white"
            } px-4 py-3 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } z-30`}
          >
            <div className="flex items-center">
              <a
                href="/profile"
                className={`${
                  isDarkMode
                    ? "text-white hover:text-gray-300"
                    : "text-gray-900 hover:text-gray-600"
                } mr-4`}
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </a>
              <h1
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } font-inter`}
              >
                Settings and activity
              </h1>
            </div>
          </header>

          <div className="px-4 py-6">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-1">
              <a
                href="#account"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-user text-gray-400"></i>
                  <span className="font-inter">Account and privacy</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
              <a
                href="/settings/theme"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-moon text-gray-400"></i>
                  <span className="font-inter">Theme and accessibility</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
              <a
                href="#saved"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-bookmark text-gray-400"></i>
                  <span className="font-inter">Saved items</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>

              <a
                href="#activity"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-chart-line text-gray-400"></i>
                  <span className="font-inter">Your activity</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
              <a
                href="#notifications"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-bell text-gray-400"></i>
                  <span className="font-inter">Notifications</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
              <a
                href="#study"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-clock text-gray-400"></i>
                  <span className="font-inter">Time management</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
              <a
                href="#help"
                className={`flex items-center justify-between p-3 ${
                  isDarkMode
                    ? "text-white hover:bg-[#2a3241]"
                    : "text-gray-900 hover:bg-gray-100"
                } rounded-lg transition-colors border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-question-circle text-gray-400"></i>
                  <span className="font-inter">Help and support</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              </a>
            </div>

            <button className="w-full text-center text-red-500 font-inter mt-8 py-3 hover:text-red-400 transition-colors">
              Log out
            </button>
          </div>

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              isDarkMode ? "bg-[#1a1f2c]" : "bg-white"
            } border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } px-4 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-home text-xl"></i>
            </a>
            <a
              href="/search"
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-search text-xl"></i>
            </a>
            <a
              href="/add_content"
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-plus text-xl"></i>
            </a>
            <a
              href="/quiz"
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-tv text-xl"></i>
            </a>
            <a
              href="/profile"
              className={`${
                isDarkMode
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