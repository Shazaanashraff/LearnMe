import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, FileText, Upload, AlertCircle, Calendar, CheckCircle, XCircle } from 'lucide-react';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch all assignments on component mount
    fetchAssignments();
  }, []);

  // Fetch all assignments from the server
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/assignments');
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to load assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions for a specific assignment and student
  const fetchSubmissions = async (assignmentId) => {
    if (!studentId || !assignmentId) return;
    
    try {
      const response = await axios.get(`http://localhost:8080/api/submissions/student/${studentId}`);
      // Filter submissions for this assignment
      const filteredSubmissions = response.data.filter(sub => sub.assignmentId === assignmentId);
      setSubmissions(filteredSubmissions);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!selectedAssignment) {
      setError('Please select an assignment first');
      return;
    }
    
    if (!studentId) {
      setError('Please enter your student ID');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('assignmentId', selectedAssignment.id);
    formData.append('studentId', studentId);
    formData.append('comment', comment);
    formData.append('file', file);
    
    try {
      await axios.post('http://localhost:8080/api/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Assignment submitted successfully!');
      setComment('');
      setFile(null);
      
      // Refresh the submissions list
      fetchSubmissions(selectedAssignment.id);
    } catch (err) {
      setError('Failed to submit assignment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment.id);
  };

  // Calculate time remaining for an assignment
  const calculateTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (now > due) {
      return "Assignment past due";
    }
    
    const diffMs = due - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs} hours ${diffMins} mins`;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading assignments...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assignments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">Available Assignments</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {assignments.length === 0 ? (
                <div className="p-4 text-gray-500">No assignments available</div>
              ) : (
                assignments.map(assignment => (
                  <div 
                    key={assignment.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedAssignment?.id === assignment.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                    onClick={() => selectAssignment(assignment)}
                  >
                    <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm">
                      {new Date() > new Date(assignment.dueDate) ? (
                        <span className="text-red-500 flex items-center">
                          <XCircle size={16} className="mr-1" />
                          Past due
                        </span>
                      ) : (
                        <span className="text-green-500 flex items-center">
                          <CheckCircle size={16} className="mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Assignment Details & Submission Form */}
        <div className="lg:col-span-2">
          {selectedAssignment ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedAssignment.title}</h2>
                <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar size={16} className="mr-2" />
                  <span>Due: {new Date(selectedAssignment.dueDate).toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-2" />
                  <span>{calculateTimeRemaining(selectedAssignment.dueDate)}</span>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">SUBMISSION STATUS</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-gray-600">Student ID</div>
                    <div>
                      <input 
                        type="text"
                        placeholder="Enter your student ID"
                        value={studentId}
                        onChange={(e) => {
                          setStudentId(e.target.value);
                          if (e.target.value && selectedAssignment) {
                            fetchSubmissions(selectedAssignment.id);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="text-gray-600">Attempt number</div>
                    <div>
                      {submissions.length > 0 
                        ? `This is attempt ${submissions.length + 1}.` 
                        : 'This is attempt 1.'}
                    </div>
                    
                    <div className="text-gray-600">Submission status</div>
                    <div>
                      {submissions.length > 0 ? 'Submitted' : 'No attempt'}
                    </div>
                    
                    <div className="text-gray-600">Grading status</div>
                    <div className="text-red-500 font-medium">
                      Not graded
                    </div>
                    
                    <div className="text-gray-600">Last modified</div>
                    <div>
                      {submissions.length > 0 
                        ? new Date(submissions[submissions.length - 1].submissionTime).toLocaleString() 
                        : '-'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Your Work</h3>
                  
                  {error && (
                    <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                      <AlertCircle size={20} className="mr-2" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                      <p>{success}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <textarea
                        placeholder="Optional comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="file-upload" 
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                      >
                        <Upload size={18} className="mr-2" />
                        Choose File
                      </label>
                      
                      <div className="mt-3 text-gray-700">
                        {file ? (
                          <div className="flex items-center justify-center">
                            <FileText size={18} className="mr-2 text-blue-600" />
                            <span>{file.name}</span>
                          </div>
                        ) : (
                          <span>No file selected</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={submitting || !file || !studentId}
                      className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300"
                    >
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </form>
                </div>
                
                {submissions.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Submissions</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {submissions.map((submission, index) => (
                            <tr key={submission.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(submission.submissionTime).toLocaleString()}</td>
                              <td className="px-6 py-4">{submission.comment || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <a 
                                  href={`http://localhost:8080/api/submissions/download/${submission.id}`} 
                                  className="text-blue-600 hover:text-blue-800"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
              <h2 className="text-xl font-medium mb-2">Select an assignment</h2>
              <p>Choose an assignment from the list to view details and submit your work.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;