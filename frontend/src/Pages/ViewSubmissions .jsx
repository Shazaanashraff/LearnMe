import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Search, FileText, User, Clock, X, ChevronDown, ChevronRight, CheckCircle, XCircle, Filter } from 'lucide-react';

const ViewSubmissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('submissionTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', or 'closed'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all assignments
        const assignmentsResponse = await axios.get('http://localhost:8080/api/assignments');
        setAssignments(assignmentsResponse.data);
        
        // Initialize expanded state for all assignments (collapsed by default)
        const expandedState = {};
        assignmentsResponse.data.forEach(assignment => {
          expandedState[assignment.id] = false;
        });
        setExpandedAssignments(expandedState);
        
        // Fetch all submissions
        const allSubmissions = [];
        for (const assignment of assignmentsResponse.data) {
          try {
            const submissionsResponse = await axios.get(`http://localhost:8080/api/submissions/assignment/${assignment.id}`);
            allSubmissions.push(...submissionsResponse.data);
          } catch (submissionError) {
            console.error(`Failed to fetch submissions for assignment ${assignment.id}:`, submissionError);
          }
        }
        setSubmissions(allSubmissions);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  const handleDownload = async (submissionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/submissions/download/${submissionId}`, {
        responseType: 'blob'
      });
      
      // Get the filename from Content-Disposition header if available
      let filename = '';
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        filename = submission.fileName;
      } else {
        filename = 'download';
      }
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download file:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter assignments based on status and search term
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(filter.toLowerCase()) ||
                          (assignment.description && assignment.description.toLowerCase().includes(filter.toLowerCase()));
    
    if (filterStatus === 'all') {
      return matchesSearch;
    } else if (filterStatus === 'active') {
      return matchesSearch && new Date(assignment.dueDate) > new Date();
    } else if (filterStatus === 'closed') {
      return matchesSearch && new Date(assignment.dueDate) <= new Date();
    }
    return matchesSearch;
  });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      default:
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Function to get submissions for a specific assignment
  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions
      .filter(submission => submission.assignmentId === assignmentId)
      .sort((a, b) => {
        // Sort by submission time, newest first
        return new Date(b.submissionTime) - new Date(a.submissionTime);
      });
  };

  // Calculate time remaining for an assignment
  const calculateTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (now > due) {
      return "Past due";
    }
    
    const diffMs = due - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs} hours ${diffMins} mins`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Assignments & Submissions
        </h1>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filter && (
              <button 
                onClick={() => setFilter('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Filter controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Assignments</option>
                <option value="active">Active Assignments</option>
                <option value="closed">Closed Assignments</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="ml-2 p-1 rounded hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
        
        {sortedAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No assignments found
          </div>
        ) : (
          <div className="space-y-6">
            {sortedAssignments.map((assignment) => {
              const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
              const isExpanded = expandedAssignments[assignment.id];
              const isPastDue = new Date(assignment.dueDate) < new Date();
              
              return (
                <div key={assignment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Assignment header - always visible */}
                  <div 
                    className={`p-4 ${isPastDue ? 'bg-red-50' : 'bg-blue-50'} cursor-pointer`}
                    onClick={() => toggleAssignment(assignment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronDown size={20} className="text-gray-600 mr-2" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-600 mr-2" />
                        )}
                        <h2 className="text-xl font-semibold">{assignment.title}</h2>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          {isPastDue ? (
                            <span className="inline-flex items-center text-red-600">
                              <XCircle size={16} className="mr-1" />
                              Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" />
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm">
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </div>
                        <div className="text-sm font-medium">
                          {calculateTimeRemaining(assignment.dueDate)}
                        </div>
                      </div>
                    </div>
                    {assignment.description && (
                      <p className="text-gray-600 mt-2">{assignment.description}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      Submissions: {assignmentSubmissions.length}
                    </div>
                  </div>
                  
                  {/* Submissions table - visible when expanded */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      {assignmentSubmissions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50">
                          No submissions for this assignment
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                  <User size={14} className="mr-1" />
                                  Student ID
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Attempt
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  Submitted
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {assignmentSubmissions.map((submission) => (
                              <tr key={submission.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{submission.studentId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{submission.attemptNumber || 1}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <FileText size={16} className="mr-2 text-blue-600" />
                                    <div className="text-sm text-gray-900 truncate max-w-xs">
                                      {submission.fileName}
                                    </div>
                                  </div>
                                  {submission.comment && (
                                    <div className="text-xs text-gray-500 mt-1 italic">
                                      "{submission.comment}"
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {new Date(submission.submissionTime).toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    submission.gradingStatus === 'Graded' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {submission.gradingStatus || 'Not graded'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <button
                                    onClick={() => handleDownload(submission.id)}
                                    className="flex items-center text-blue-600 hover:text-blue-900"
                                  >
                                    <Download size={16} className="mr-1" />
                                    Download
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubmissions;