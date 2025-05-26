import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const checkPaymentStatus = async (courseId) => {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        toast.error("Please login to access course content");
        return false;
      }

      // Check payment status
      const response = await axios.get(`http://localhost:8080/api/payments/check/${userData.id}/${courseId}`);
      return response.data.paid;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return false;
    }
  };

  const handleCourseClick = async (courseId) => {
    const hasPaid = await checkPaymentStatus(courseId);
    
    if (hasPaid) {
      navigate(`/course/${courseId}`);
    } else {
      console.log("hasPaid", hasPaid)
      toast.error("Please complete the payment to access this course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            onClick={() => handleCourseClick(course.id)}
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {course.description.slice(0, 60)}...
              </p>
              <p className="mt-2 text-green-400 font-bold">Rs. {course.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
