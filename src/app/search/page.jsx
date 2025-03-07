"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [availableTopics, setAvailableTopics] = useState([]);
  const [followedTopics, setFollowedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
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

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/educational-content/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "listTopics" }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch available topics");
        }

        const data = await response.json();
        if (!Array.isArray(data.body)) {
          throw new Error("Invalid topics data received");
        }

        setAvailableTopics(data.body);

        const userTopicsResponse = await fetch("/api/manage-user-topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "list",
            user_id: "current_user",
          }),
        });

        if (!userTopicsResponse.ok) {
          throw new Error("Failed to fetch user topics");
        }

        const userTopicsData = await userTopicsResponse.json();
        setFollowedTopics(userTopicsData.topics || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setError("Failed to load topics. Please try again later.");
        setAvailableTopics([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    try {
      await fetch("/api/update-theme-preference", {
        method: "POST",
        body: JSON.stringify({ theme: newTheme }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    } catch (error) {
      console.error("Failed to update theme preference:", error);
    }
  };

  const toggleFollowTopic = async (topic) => {
    const isCurrentlyFollowing = followedTopics.includes(topic);
    const action = isCurrentlyFollowing ? "unfollow" : "follow";

    try {
      const response = await fetch("/api/manage-user-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          topic,
          user_id: "current_user",
        }),
      });

      if (response.ok) {
        if (isCurrentlyFollowing) {
          setFollowedTopics(followedTopics.filter((t) => t !== topic));
        } else {
          setFollowedTopics([...followedTopics, topic]);
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} topic:`, error);
    }
  };

  const filteredTopics = availableTopics.filter((topic) =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } min-h-screen pb-16`}
        >
          <div
            className={`sticky top-0 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } px-4 py-3 z-10 flex items-center justify-between`}
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  if (!searchQuery) {
                    setIsSearchFocused(false);
                  }
                }}
                className={`w-full p-3 pl-10 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200"
                } border font-inter`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <i className={`fas fa-${theme === "dark" ? "sun" : "moon"}`}></i>
            </button>
          </div>

          {!isSearchFocused && (
            <div className="px-1 mt-2">
              {/* First Grid Row */}
              <div className="grid grid-cols-3 gap-1 mb-1">
                {[...Array.from({ length: 9 })].map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Second Grid Row */}
              <div className="grid grid-cols-3 gap-1 mb-1">
                {[...Array.from({ length: 9 })].map((_, index) => (
                  <div
                    key={`second-${index}`}
                    className={`aspect-square ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Third Grid Row */}
              <div className="grid grid-cols-3 gap-1">
                {[...Array.from({ length: 9 })].map((_, index) => (
                  <div
                    key={`third-${index}`}
                    className={`aspect-square ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {isSearchFocused && (
            <div className="px-4 py-4">
              <h2
                className={`text-lg font-bold mb-4 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Available Topics
              </h2>

              {loading ? (
                <div
                  className={`text-center py-4 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Loading topics...
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="space-y-2">
                  {filteredTopics.map((topic, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === "light" ? "bg-gray-50" : "bg-gray-700"
                      }`}
                    >
                      <span
                        className={
                          theme === "light" ? "text-gray-900" : "text-white"
                        }
                      >
                        {topic}
                      </span>
                      <button
                        onClick={() => toggleFollowTopic(topic)}
                        className={`px-4 py-1 rounded-full transition-colors ${
                          followedTopics.includes(topic)
                            ? "bg-purple-500 text-white"
                            : theme === "light"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {followedTopics.includes(topic)
                          ? "Following"
                          : "Follow"}
                      </button>
                    </div>
                  ))}

                  {filteredTopics.length === 0 && (
                    <div
                      className={`text-center py-4 ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      No topics found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-t px-4 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-home text-xl"></i>
            </a>
            <button
              className={theme === "dark" ? "text-white" : "text-purple-600"}
            >
              <i className="fas fa-search text-xl"></i>
            </button>
            <a
              href="/add_content"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-plus text-xl"></i>
            </a>
            <a
              href="/interactive"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-tv text-xl"></i>
            </a>
            <a
              href="/profile"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-gray-900"
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