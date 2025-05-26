import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.png";
import tutorImage from "../assets/face.png";
import map1 from "../assets/map1.png";
import map2 from "../assets/map2.png";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("User data from localStorage:", parsedUser); // Debug log
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // If no user data, don't render the page
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Background Image with Overlay */}
      <div className="relative min-h-screen bg-black">
        <img
          src={bgImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-0"></div>

        {/* Navbar */}
        <nav className="relative z-10 flex justify-between items-center px-8 py-6 bg-black/30 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white">EnglishLMS</h1>
          <ul className="flex gap-6 text-sm md:text-base">
            {user.role === "STUDENT" ? (
              // Student Navigation
              <>
                <li>
                  <Link
                    to="/course"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Profile
                  </Link>
                </li>
              </>
            ) : user.role === "TEACHER" ? (
              // Teacher Navigation
              <>
                <li>
                  <Link
                    to="/add-course"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Add Course
                  </Link>
                </li>
                <li>
                  <Link
                    to="/submissions"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Submissions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/performance"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Performance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/payment"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Payments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-blue-400 hover:underline underline-offset-4 transition duration-200"
                  >
                    Profile
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 hover:underline underline-offset-4 transition duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between px-10 py-20 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Learn English with <br />
              <span className="text-blue-500">Mr. Madhusanka Samarakoon</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Join our LMS and enhance your English skills through expert-led courses, interactive quizzes, and real-time assignments.
            </p>
            <button onClick={() => navigate('/course')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition">
              Browse Courses
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2"
          >
            <img
              src={tutorImage}
              alt="Mr. Madhusanka Samarakoon"
              className="rounded-3xl shadow-lg w-full max-w-md mx-auto"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-black text-white px-6 md:px-20 py-16 text-center"
      >
        <h3 className="text-3xl font-semibold mb-6">Reach Us At Our Physical Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <img src={map1} alt="Map 1" className="rounded-lg w-full h-64 object-cover mb-4" />
            <h4 className="text-lg font-semibold text-white">Aquinas Main Campus</h4>
            <p className="text-sm text-gray-400">123 Main Street, City, Country</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <img src={map2} alt="Map 2" className="rounded-lg w-full h-64 object-cover mb-4" />
            <h4 className="text-lg font-semibold text-white">Branch Office - Downtown</h4>
            <p className="text-sm text-gray-400">456 Downtown Ave, City, Country</p>
          </div>
        </div>
      </motion.div>


      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} EnglishLMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;