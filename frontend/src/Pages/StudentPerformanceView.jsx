// Pages/StudentPerformanceView.jsx
import React, { useEffect, useState } from 'react';

const mockResults = [
  { id: 1, studentName: 'A Silva', quizId: 'QZ001', score: 8, total: 10 },
  { id: 2, studentName: 'I Perera', quizId: 'QZ001', score: 7, total: 10 },
  { id: 3, studentName: 'M Fernando', quizId: 'QZ002', score: 9, total: 10 },
];

const StudentPerformanceView = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(mockResults); // Replace with API call once backend is ready
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Student Quiz Performances</h2>

      <table className="w-full border text-left">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-3">Student Name</th>
            <th className="p-3">Quiz ID</th>
            <th className="p-3">Score</th>
            <th className="p-3">Out Of</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-t">
              <td className="p-3">{result.studentName}</td>
              <td className="p-3">{result.quizId}</td>
              <td className="p-3">{result.score}</td>
              <td className="p-3">{result.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPerformanceView;
