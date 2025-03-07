"use client";
import React, {useState, useEffect} from "react";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [dislikedPosts, setDislikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [theme, setTheme] = useState("dark");
  const [userTopics, setUserTopics] = useState([]);

  const placeholderPosts = [
    {
      id: 1,
      author: "Physics Enthusiast",
      title: "Understanding Gravity",
      content: "Gravity is one of the fundamental forces of nature...",
      topic: "Physics",
      image_url: "https://example.com/gravity.jpg",
      likes: 1200,
      comments: 45,
    },
    {
      id: 2,
      author: "Math Teacher",
      title: "Beautiful Mathematics",
      content: "The Fibonacci sequence appears throughout nature...",
      topic: "Mathematics",
      image_url: "https://example.com/math.jpg",
      likes: 890,
      comments: 32,
    },
    {
      id: 3,
      author: "Bio Explorer",
      title: "Cell Structure",
      content: "The cell is the basic unit of life...",
      topic: "Biology",
      image_url: "https://example.com/cell.jpg",
      likes: 750,
      comments: 28,
    },
  ];

  async function loadUserTopics() {
    try {
      const response = await fetch("/api/manage-user-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list",
          user_id: "current_user",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to load user topics");
      }
      const data = await response.json();
      setUserTopics(data.body.topics || []);
    } catch (err) {
      console.error("Failed to load user topics:", err);
      setError("Failed to load user preferences");
    }
  }

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/list-educational-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_type: "feed",
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }
      const data = await response.json();

      const filteredPlaceholders = placeholderPosts.filter(
        (post) => userTopics.length === 0 || userTopics.includes(post.topic)
      );

      const userPosts = Array.isArray(data.body)
        ? data.body.filter(
            (post) => userTopics.length === 0 || userTopics.includes(post.topic)
          )
        : [];

      setPosts([...filteredPlaceholders, ...userPosts]);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserTopics();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [userTopics]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
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
  const toggleLike = (id) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!likedPosts[id]) {
      setDislikedPosts((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };
  const toggleDislike = (id) => {
    setDislikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!dislikedPosts[id]) {
      setLikedPosts((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };
  const toggleBookmark = (id) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } min-h-screen relative pb-16`}
        >
          <header
            className={`sticky top-0 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } px-4 py-3 z-10`}
          >
            <div className="flex justify-between items-center">
              <h1
                className={`text-2xl font-inter font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                MindScroll
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i
                    className={`fas ${
                      theme === "light" ? "fa-moon" : "fa-sun"
                    } text-xl`}
                  ></i>
                </button>
                <button
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className="fas fa-inbox text-xl"></i>
                </button>
              </div>
            </div>
          </header>
          <div className="space-y-4 p-4">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : posts.length === 0 ? (
              <div
                className={`text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No posts available
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } border rounded-lg overflow-hidden`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <i
                        className={`fas fa-book ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      ></i>
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } text-sm font-inter`}
                      >
                        {post.topic}
                      </span>
                    </div>
                    <h2
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } text-lg font-semibold mb-2`}
                    >
                      {post.title}
                    </h2>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-[200px] object-cover rounded-lg mb-3"
                      />
                    )}
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {post.content}
                    </p>
                    <div
                      className={`flex justify-between items-center mt-4 pt-3 border-t ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`${
                            likedPosts[post.id]
                              ? theme === "dark"
                                ? "text-white"
                                : "text-gray-900"
                              : theme === "dark"
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <i
                            className={`${
                              likedPosts[post.id] ? "fas" : "far"
                            } fa-thumbs-up`}
                          ></i>
                        </button>
                        <button
                          onClick={() => toggleDislike(post.id)}
                          className={`${
                            dislikedPosts[post.id]
                              ? theme === "dark"
                                ? "text-white"
                                : "text-gray-900"
                              : theme === "dark"
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <i
                            className={`${
                              dislikedPosts[post.id] ? "fas" : "far"
                            } fa-thumbs-down`}
                          ></i>
                        </button>
                        <button
                          className={`${
                            theme === "dark"
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <i className="fas fa-share"></i>
                        </button>
                      </div>
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`${
                          bookmarkedPosts[post.id]
                            ? theme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                            : theme === "dark"
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <i
                          className={`${
                            bookmarkedPosts[post.id] ? "fas" : "far"
                          } fa-bookmark`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-t px-4 py-2 flex justify-around items-center z-20`}
          >
            <button
              className={theme === "dark" ? "text-white" : "text-gray-900"}
            >
              <i className="fas fa-home text-xl"></i>
            </button>
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
            <a
              href="/add"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-plus text-xl"></i>
            </a>
            <a
              href="/quiz"
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