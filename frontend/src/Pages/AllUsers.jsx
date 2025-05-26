import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/users')
      .then(response => setUsers(response.data))
      .catch(() => setError('Failed to fetch users.'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">All Users</h2>

        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 uppercase text-xs text-gray-300">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.userId}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.firstName}</td>
                  <td className="px-6 py-4">{user.lastName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.userRole === 'TEACHER' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {user.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
