"use client";
import React, {useState, useEffect, useCallback, useRef} from "react";

function MainComponent() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionId, setSessionId] = useState(crypto.randomUUID());
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question:
        "What is the main benefit of microlearning compared to traditional learning methods?",
      options: [
        "It provides long, in-depth lessons for better understanding",
        "It improves retention and engagement through short focused content",
        "It replaces all traditional learning methods entirely",
        "It requires learners to complete multiple hours of study at once",
      ],
    },
    {
      question:
        "Which learning technique is most effective for long-term retention?",
      options: [
        "Passive reading",
        "Active recall",
        "Highlighting text",
        "Cramming before tests",
      ],
    },
    {
      question: "What is the Pomodoro Technique?",
      options: [
        "A pasta cooking method",
        "A time management method using 25-minute focus periods",
        "A memorization technique",
        "A type of study group",
      ],
    },
    {
      question: "How often should you take breaks while studying?",
      options: [
        "Never, to maintain focus",
        "Every 10-15 minutes",
        "Every 45-60 minutes",
        "Only after completing all work",
      ],
    },
  ]);
  const getNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      loadMoreQuestions();
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
    setShowFeedback(false);
  };
  const fetchQuizHistory = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch("/api/get-quiz-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch quiz history");
      }
      const data = await response.json();
      if (data.success) {
        setQuizHistory(data.answers);
      }
    } catch (error) {
      console.error("Failed to fetch quiz history:", error);
    }
  }, [sessionId]);
  const loadMoreQuestions = () => {
    const newQuestions = [
      {
        question: "What is the most effective way to memorize new information?",
        options: [
          "Reading it once carefully",
          "Spaced repetition practice",
          "Writing it down once",
          "Listening to audio while sleeping",
        ],
      },
      {
        question:
          "Which study environment is typically most conducive to learning?",
        options: [
          "A noisy café",
          "A quiet, well-lit space",
          "In bed",
          "While watching TV",
        ],
      },
    ];
    setQuizQuestions((prev) => [...prev, ...newQuestions]);
  };
  const handleSubmit = async () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === 1;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    try {
      const response = await fetch("/api/save-quiz-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          selectedAnswer: currentQuestion.options[selectedAnswer],
          correctAnswer: currentQuestion.options[1],
          sessionId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save answer");
      }
      await fetchQuizHistory();
    } catch (error) {
      console.error("Failed to save answer:", error);
    }

    setTimeout(getNextQuestion, 2000);
  };
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const touchStart = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (showHistory) {
      fetchQuizHistory();
    }
  }, [showHistory, sessionId, fetchQuizHistory]);

  useEffect(() => {
    if (currentQuestionIndex === 0) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setQuizHistory([]);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme && currentTheme !== theme) {
        setTheme(currentTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);

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
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("theme", theme);
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    };
    fetchTheme();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      setShowHistory(diff > 0);
      touchStart.current = null;
    }
  };
  const handleTouchEnd = () => {
    touchStart.current = null;
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
          ref={containerRef}
          className={`max-w-md mx-auto ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } min-h-screen pb-16`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <header
            className={`sticky top-0 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } px-4 py-3 z-10`}
          >
            <div className="flex items-center justify-between">
              <div className="relative flex items-center">
                <h1
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } font-inter`}
                >
                  Quiz
                </h1>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`ml-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <i
                    className={`fas fa-chevron-down transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {isDropdownOpen && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-48 ${
                      theme === "dark" ? "bg-gray-700" : "bg-white"
                    } rounded-lg shadow-lg z-50`}
                  >
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-3 py-1.5 text-xs ${
                          theme === "dark"
                            ? "text-white hover:bg-gray-600"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        Multiple Choice Mode
                      </button>
                      <button
                        className={`block w-full text-left px-3 py-1.5 text-xs ${
                          theme === "dark"
                            ? "text-white hover:bg-gray-600"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        Flash Card Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`${
                  theme === "dark"
                    ? "text-white bg-gray-700"
                    : "text-gray-900 bg-gray-100"
                } text-xs px-3 py-1 rounded-full flex items-center`}
              >
                <i
                  className={`fas fa-history mr-1 ${
                    showHistory ? "text-blue-400" : ""
                  }`}
                ></i>
                {showHistory ? "Current" : "History"}
              </button>
            </div>
          </header>

          <div className="p-4">
            <div
              className={`rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              } p-6 mb-6`}
            >
              <div
                className={`flex w-[200%] transition-transform duration-300 ${
                  showHistory ? "-translate-x-1/2" : "translate-x-0"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center px-3">
                  {quizQuestions.map(
                    (quiz, questionIndex) =>
                      questionIndex === currentQuestionIndex && (
                        <div
                          key={questionIndex}
                          className="w-full max-w-lg flex flex-col justify-center"
                        >
                          <div className="w-full">
                            <div className="mb-6 h-[80px] flex items-center justify-center">
                              <h2
                                className={`text-base ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                } font-inter leading-tight px-2 text-center`}
                              >
                                {quiz.question}
                              </h2>
                            </div>

                            <div className="space-y-2">
                              {quiz.options.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedAnswer(index);
                                  }}
                                  disabled={showFeedback}
                                  className={`w-full p-2.5 text-center rounded-lg border text-xs font-inter transition-colors
            ${
              selectedAnswer === index
                ? showFeedback
                  ? isCorrect
                    ? "border-green-500 bg-green-500 bg-opacity-10 text-green-500"
                    : "border-red-500 bg-red-500 bg-opacity-10 text-red-500"
                  : theme === "dark"
                  ? "border-gray-600 bg-transparent text-white"
                  : "border-gray-300 bg-transparent text-gray-900"
                : theme === "dark"
                ? "border-gray-600 bg-transparent text-white hover:bg-[#2a3241]"
                : "border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50"
            } ${
                                    showFeedback && index === 1
                                      ? "border-green-500 bg-green-500 bg-opacity-10 text-green-500"
                                      : ""
                                  }`}
                                >
                                  <span className="text-xs flex items-center justify-center gap-2">
                                    {option}
                                    {showFeedback &&
                                      index === selectedAnswer && (
                                        <i
                                          className={`fas fa-${
                                            isCorrect ? "check" : "times"
                                          }`}
                                        ></i>
                                      )}
                                    {showFeedback &&
                                      index === 1 &&
                                      index !== selectedAnswer && (
                                        <i className="fas fa-check"></i>
                                      )}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={handleSubmit}
                              disabled={selectedAnswer === null || showFeedback}
                              className={`w-full mt-4 py-2.5 rounded-lg font-inter text-xs transition-colors ${
                                selectedAnswer !== null && !showFeedback
                                  ? theme === "dark"
                                    ? "bg-[#2a3241] text-white hover:bg-[#2a3241] border border-gray-600"
                                    : "bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300"
                                  : theme === "dark"
                                  ? "bg-[#2a3241] text-gray-400 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {showFeedback
                                ? isCorrect
                                  ? "Correct!"
                                  : "Incorrect!"
                                : "Submit Answer"}
                            </button>

                            <button
                              onClick={getNextQuestion}
                              className="w-full mt-3 flex justify-center items-center"
                            >
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "bg-[#2a3241]"
                                    : "bg-gray-200"
                                } p-2.5 rounded-full ${
                                  theme === "dark"
                                    ? "hover:bg-[#2a3241]"
                                    : "hover:bg-gray-300"
                                } transition-all`}
                              >
                                <i
                                  className={`fas fa-arrow-right ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  } text-sm`}
                                ></i>
                              </div>
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </div>
                <div className="w-full px-3">
                  <div className="w-full h-full overflow-y-auto">
                    <div className="space-y-4">
                      {quizHistory.map((item, index) => (
                        <div
                          key={index}
                          className={`${
                            theme === "dark"
                              ? "bg-[#2a3241] border-gray-600"
                              : "bg-gray-50 border-gray-200"
                          } rounded-lg p-4 border`}
                        >
                          <p
                            className={`${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            } text-xs mb-2`}
                          >
                            {item.question}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={
                                item.selected_answer === item.correct_answer
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              Your answer: {item.selected_answer}
                            </span>
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }
                            >
                              {new Date(item.answered_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav
            className={`fixed bottom-0 left-0 right-0 ${
              theme === "dark"
                ? "bg-[#1a1f2c] border-gray-800"
                : "bg-white border-gray-200"
            } border-t px-3 py-2 flex justify-around items-center z-20`}
          >
            <a
              href="/"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-home text-lg"></i>
            </a>
            <a
              href="/search"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-search text-lg"></i>
            </a>
            <a
              href="/add_content"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-plus text-lg"></i>
            </a>
            <button
              className={theme === "dark" ? "text-white" : "text-gray-900"}
            >
              <i className="fas fa-tv text-lg"></i>
            </button>
            <a
              href="/profile"
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-user text-lg"></i>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}

export default MainComponent;