// Pages/CreateAssignment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, ClockIcon, BookmarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const CreateAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    // Fetch courses when component mounts
    axios.get('http://localhost:8080/api/course')
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error('Error fetching courses:', err);
        setMessage({
          text: 'Failed to load courses. Please try again.',
          type: 'error'
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!selectedCourse) {
      setMessage({
        text: 'Please select a course',
        type: 'error'
      });
      setLoading(false);
      return;
    }
    
    try {
      // Combine date and time for the dueDate
      const combinedDateTime = `${dueDate}T${dueTime}:00`;
      
      // Create FormData object
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('dueDate', combinedDateTime);
      formData.append('status', status);
      formData.append('courseId', selectedCourse);

      // Get the token from localStorage
      
      const response = await axios.post('http://localhost:8080/api/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({
        text: 'Assignment created successfully!',
        type: 'success'
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('23:59');
      setStatus('Active');
      setSelectedCourse('');
      
      console.log('Assignment created:', response.data);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to create assignment. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white border rounded-lg shadow-md">
      <div className="flex items-center mb-6 border-b pb-4">
        <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">Create New Assignment</h2>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Select Course*
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Title*
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter assignment title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter assignment details and requirements"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                Due Date*
              </div>
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                Due Time*
              </div>
            </label>
            <input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <BookmarkIcon className="h-4 w-4 mr-1 text-gray-500" />
              Status
            </div>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;