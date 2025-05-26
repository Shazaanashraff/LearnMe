import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizAttempt() {
  const { quizId } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`);
        setQuiz(response.data);
        // Reset state when loading a new quiz
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setScore(0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz. Please try again.");
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerNumber) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerNumber
    });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz and calculate score
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizSubmitted(true);
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!quiz) return false;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return selectedAnswers[currentQuestion.id] !== undefined;
  };

  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    if (!quiz) return false;
    return quiz.questions.every(q => selectedAnswers[q.id] !== undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading Quiz...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700">Take a Quiz</h1>
          <p className="text-gray-500 mt-2">Challenge yourself with a timed quiz and review your performance instantly!</p>
        </div>

        {/* === Quiz in Progress === */}
        {quiz && !quizSubmitted && (
          <div className="mt-10 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{quiz.name}</h2>
              <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Difficulty: {quiz.difficulty}
              </span>
            </div>

            {/* Question navigation */}
            <div className="flex justify-between items-center text-sm mb-6 text-gray-500">
              <div>Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
              <div className="space-x-2 flex">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-1 rounded-md font-medium ${
                    currentQuestionIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === quiz.questions.length - 1 || !isCurrentQuestionAnswered()}
                  className={`px-4 py-1 rounded-md font-medium ${
                    currentQuestionIndex === quiz.questions.length - 1 || !isCurrentQuestionAnswered()
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Box */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {quiz.questions[currentQuestionIndex].title}
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    onClick={() => handleAnswerSelect(quiz.questions[currentQuestionIndex].id, num)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAnswers[quiz.questions[currentQuestionIndex].id] === num
                        ? "bg-indigo-50 border-indigo-500"
                        : "bg-gray-50 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                        selectedAnswers[quiz.questions[currentQuestionIndex].id] === num
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}>
                        {num}
                      </div>
                      <span className="text-gray-800">{quiz.questions[currentQuestionIndex][`answer${num}`]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question progress indicators */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {quiz.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentQuestionIndex
                        ? "bg-indigo-600"
                        : selectedAnswers[quiz.questions[i].id] !== undefined
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              {currentQuestionIndex === quiz.questions.length - 1 && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!areAllQuestionsAnswered()}
                  className={`px-6 py-3 font-medium text-white rounded-md ${
                    areAllQuestionsAnswered()
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* === Quiz Results === */}
        {quiz && quizSubmitted && (
          <div className="mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex w-28 h-28 items-center justify-center bg-indigo-100 text-3xl font-bold text-indigo-700 rounded-full mb-4">
                {score}/{quiz.questions.length}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quiz Completed!</h2>
              <p className="text-gray-600 mt-2">
                {score === quiz.questions.length
                  ? "Perfect score! You got all questions right."
                  : score >= quiz.questions.length / 2
                    ? "Great job! You passed the quiz."
                    : "Keep practicing. You'll improve with time."}
              </p>
            </div>

            {/* Review Questions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Review Answers</h3>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 border">
                    <h4 className="font-medium mb-2 text-gray-800">{question.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map(num => {
                        const isCorrect = num === question.correctAnswer;
                        const isUserAnswer = selectedAnswers[question.id] === num;
                        const bg =
                          isCorrect && isUserAnswer
                            ? "bg-green-100 border-green-400"
                            : isCorrect
                              ? "bg-green-50 border-green-300"
                              : isUserAnswer
                                ? "bg-red-50 border-red-300"
                                : "bg-white border-gray-200";

                        return (
                          <div key={num} className={`p-3 border rounded-md ${bg}`}>
                            <div className="flex items-center">
                              <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 text-xs ${
                                isCorrect
                                  ? "bg-green-500 text-white"
                                  : isUserAnswer
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-300 text-gray-700"
                              }`}>
                                {num}
                              </div>
                              <span>{question[`answer${num}`]}</span>
                              {isCorrect && (
                                <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Back to Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}