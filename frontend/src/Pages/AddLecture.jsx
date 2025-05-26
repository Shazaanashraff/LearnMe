import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddLecture() {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all courses for the dropdown
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Error fetching courses:", err);
        toast.error("Failed to load courses");
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedCourse) {
      toast.error("Please select a course");
      setIsLoading(false);
      return;
    }

    try {
      const lectureDetailsJson = JSON.stringify({
        ...formData,
        duration: parseInt(formData.duration),
      });

      const formPayload = new FormData();
      formPayload.append("lectureDetails", lectureDetailsJson);
      if (file) {
        formPayload.append("file", file);
      }

      const response = await axios.post(
        `http://localhost:8080/api/lecture?courseId=${selectedCourse}`,
        formPayload
      );

      if (response.status === 200) {
        // Reset form
        setFormData({
          title: "",
          duration: "",
        });
        setSelectedCourse("");
        setFile(null);
        toast.success("Lecture added successfully!");
      }
    } catch (err) {
      console.error("Error adding lecture:", err);
      toast.error(err.response?.data?.message || "Failed to add lecture");
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
        Add New Lecture
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="block mb-2 text-sm text-gray-300">Select Course</label>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-300">Lecture Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-300">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-300">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full text-white bg-gray-700 p-2 rounded file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
            disabled={isLoading}
          />
        </div>

        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Adding Lecture...
            </div>
          ) : (
            "Add Lecture"
          )}
        </motion.button>
      </form>
    </div>
  );
}
