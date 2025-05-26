import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizCreator() {
  const [quizData, setQuizData] = useState({
    id: "",
    name: "",
    difficulty: "EASY",
    courseId: "", // Add courseId to the quiz data
    questions: [
      {
        title: "",
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        correctAnswer: 1
      }
    ]
  });

  const [courses, setCourses] = useState([]); // State to store courses
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [idError, setIdError] = useState("");

  useEffect(() => {
    // Fetch courses from the backend
    axios
      .get("http://localhost:8080/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;

    if (name === "id") {
      // Validate ID input (6 digits only)
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 6) {
        setQuizData({
          ...quizData,
          [name]: numericValue
        });
      }

      // Set error message if not valid
      if (numericValue.length !== 6 && numericValue.length > 0) {
        setIdError("ID must be exactly 6 digits");
      } else {
        setIdError("");
      }
    } else {
      setQuizData({
        ...quizData,
        [name]: value
      });
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };

    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          title: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          correctAnswer: 1
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this question?"
      );
      if (!confirmDelete) return;

      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({
        ...quizData,
        questions: updatedQuestions
      });
    }
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/quizzes",
        quizData
      );

      console.log("quiz  ",quizData)

      if (response.status === 200 || response.status === 201) {
        setMessage({ text: "Quiz created successfully!", type: "success" });
        // Reset form
        setQuizData({
          id: "",
          name: "",
          difficulty: "EASY",
          courseId: "",
          questions: [
            {
              title: "",
              answer1: "",
              answer2: "",
              answer3: "",
              answer4: "",
              correctAnswer: 1
            }
          ]
        });
      } else {
        setMessage({
          text: "Failed to create quiz. Please try again.",
          type: "error"
        });
      }
    } catch (error) {
      setMessage({
        text:
          "Error submitting quiz: " +
          (error.response?.data?.message || error.message),
        type: "error"
      });
    } finally {
      setIsLoading(false);
      // Auto-dismiss message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  const validateForm = () => {
    if (!quizData.id || quizData.id.length !== 6) return false;
    if (!quizData.name.trim()) return false;
    if (!quizData.courseId) return false; // Ensure course is selected

    for (const question of quizData.questions) {
      if (
        !question.title.trim() ||
        !question.answer1.trim() ||
        !question.answer2.trim() ||
        !question.answer3.trim() ||
        !question.answer4.trim()
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Create a Quiz
      </h1>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-md transition-all duration-500 ease-in-out ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz ID (6 digits)
            </label>
            <input
              type="text"
              name="id"
              value={quizData.id}
              onChange={handleQuizChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                idError ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., 123456"
              maxLength="6"
            />
            {idError && <p className="mt-1 text-sm text-red-500">{idError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Name
            </label>
            <input
              type="text"
              name="name"
              value={quizData.name}
              onChange={handleQuizChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter quiz name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={quizData.difficulty}
              onChange={handleQuizChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              name="courseId" // This ensures the courseId is updated in quizData
              value={quizData.courseId}
              onChange={handleQuizChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Questions</h2>
        
        {quizData.questions.map((question, index) => (
          <div 
            key={index} 
            className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Question {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={quizData.questions.length === 1}
              >
                {quizData.questions.length > 1 ? "Remove" : ""}
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                value={question.title}
                onChange={(e) => handleQuestionChange(index, "title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your question"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Answer {num}
                    {question.correctAnswer === num && (
                      <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={question[`answer${num}`]}
                    onChange={(e) => handleQuestionChange(index, `answer${num}`, e.target.value)}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:border-indigo-500 transition-all ${
                      question.correctAnswer === num 
                        ? "border-green-300 bg-green-50" 
                        : "border-gray-300"
                    }`}
                    placeholder={`Answer ${num}`}
                  />
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mr-3">Correct Answer</label>
              <select
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, "correctAnswer", parseInt(e.target.value))}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value={1}>Answer 1</option>
                <option value={2}>Answer 2</option>
                <option value={3}>Answer 3</option>
                <option value={4}>Answer 4</option>
              </select>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Another Question
        </button>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={submitQuiz}
          disabled={!validateForm() || isLoading}
          className={`px-6 py-3 font-medium rounded-md text-white ${
            validateForm() && !isLoading
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          } transition-colors duration-300 flex items-center`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Create Quiz"
          )}
        </button>
      </div>
    </div>
  );
}