import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function CourseDetails() {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      toast.error("Please login to access course content");
      navigate('/login');
      return;
    }

    // Check payment status
    const checkPayment = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/payments/check/${userData.id}/${id}`);
        setHasPaid(response.data.paid);
      } catch (error) {
        console.error("Error checking payment status:", error);
        setHasPaid(false);
      }
    };

    checkPayment();

    // Fetch course details
    axios
      .get(`http://localhost:8080/api/course/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));

    // Fetch lectures for the course
    axios
      .get(`http://localhost:8080/api/lecture?courseId=${id}`)
      .then((res) => setLectures(res.data))
      .catch((err) => console.error(err));

    // Fetch quizzes for the course
    axios
      .get(`http://localhost:8080/api/quizzes?courseId=${id}`)
      .then((res) => {
        console.log("Fetched quizzes:", res.data); // Debugging
        setQuizzes(res.data);
      })
      .catch((err) => console.error(err));

    // Fetch assignments for the course
    axios
      .get(`http://localhost:8080/api/assignments/course/${id}`)
      .then((res) => {
        console.log("Fetched assignments:", res.data);
        setAssignments(res.data);
      })
      .catch((err) => console.error(err));
  }, [id, navigate]);

  const handleContentClick = () => {
    if (!hasPaid) {
      toast.error("Please complete the payment to access this content");
      return;
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold text-center">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <p className="text-gray-300 mb-4">{course.description}</p>
      <p className="text-green-400 text-xl font-semibold mb-6">
        Price: ${course.price}
      </p>

      <h2 className="text-2xl font-bold mb-4">Lectures</h2>
      {lectures.length === 0 ? (
        <p className="text-gray-400">No lectures available for this course.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="bg-gray-800 rounded-lg shadow-md p-4"
            >
              <h3 className="text-xl font-semibold text-purple-300">
                {lecture.title}
              </h3>
              <p className="text-gray-400">Duration: {lecture.duration} mins</p>
              {lecture.videoUrl && (
                <a
                  href={hasPaid ? lecture.videoUrl : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleContentClick}
                  className={`text-blue-400 hover:underline mt-2 block ${
                    !hasPaid ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Watch Video
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-400">No quizzes available for this course.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div 
              onClick={() => hasPaid ? navigate(`/quiz/${quiz.id}`) : handleContentClick()}
              key={quiz.id}
              className={`bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-500 ${
                !hasPaid ? "opacity-50" : ""
              }`}
            >
              <h3 className="text-xl font-semibold text-purple-300">
                {quiz.name}
              </h3>
              <p className="text-gray-400">Difficulty: {quiz.difficulty}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Assignments</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-400">No assignments available for this course.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <div 
              onClick={() => hasPaid ? navigate(`/assignment/${assignment.id}`) : handleContentClick()}
              key={assignment.id}
              className={`bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-500 ${
                !hasPaid ? "opacity-50" : ""
              }`}
            >
              <h3 className="text-xl font-semibold text-purple-300">
                {assignment.title}
              </h3>
              <p className="text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-400">Status: {assignment.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}