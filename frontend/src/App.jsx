import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuizCreator from './Pages/QuizCreator';
import QuizAttempt from './Pages/QuizAttempt';
import AssignmentSubmit from './Pages/AssignmentSubmit';
import StudentPerformanceView from './Pages/StudentPerformanceView';
import CreateAssignment from './Pages/CreateAssignment ';
import ViewSubmissions from './Pages/ViewSubmissions ';
import Home from './Pages/Home';
import CoursePage from './Pages/Courses';
import AddCourse from './Pages/AddCourse';
import LoginPage from './Pages/Login';
import SignupPage from './Pages/SignUp';
import ViewProfilePage from './Pages/Profile';
import AllUsers from './Pages/AllUsers';
import UpdateCourse from './Pages/UpdateCourse';
import CourseDetails from './Pages/CourseDetails';
import AddLecture from './Pages/AddLecture';
import UpdateLecture from './Pages/UpdateLecture';
import PaymentInterface from './Pages/payment/PaymentInterface';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <>
    <ToastContainer />
    <Router>
          <Routes>
            {/* ---------------------------- student ------------------------ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path= "/profile" element={<ViewProfilePage />} />
            <Route path= "/all-users" element={<AllUsers />} />
            <Route path="/" element={<Home />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/assignment/:assignmentId" element={<AssignmentSubmit />} />
            <Route path="/quiz/:quizId" element={<QuizAttempt />} />


            {/* ---------------------------- educator ------------------------ */}
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/update-course" element={<UpdateCourse />} />
            <Route path="/add-lecture" element={<AddLecture />} />
            <Route path="/update-lecture" element={<UpdateLecture />} />

            <Route path="/create-quiz" element={<QuizCreator />} />
            <Route path="/performance" element={<StudentPerformanceView />} />
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/submissions" element={<ViewSubmissions />} />
            <Route path="/payment" element={<PaymentInterface />} />

          </Routes>
    </Router>
    </>
  );
};




export default App;