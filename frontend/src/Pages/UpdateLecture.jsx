import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function UpdateLecture() {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all lectures
  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/lectures");
      setLectures(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching lectures:", err);
      toast.error("Failed to load lectures");
    }
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/lecture/${lectureId}`);
      if (response.status === 200) {
        toast.success("Lecture deleted successfully!");
        fetchLectures(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting lecture:", err);
      toast.error(err.response?.data?.message || "Failed to delete lecture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Manage Lectures
      </motion.h1>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{lecture.title}</h3>
                <p className="text-gray-400 mb-2">Duration: {lecture.duration} minutes</p>
                <p className="text-gray-400 mb-4">Course: {lecture.course?.title}</p>
                {lecture.videoUrl && (
                  <p className="text-gray-400 mb-4">Video: {lecture.videoUrl}</p>
                )}
                
                <div className="flex space-x-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/edit-lecture/${lecture.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Edit
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(lecture.id)}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {lectures.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 mt-8">
            No lectures found. Add some lectures to get started.
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
} 