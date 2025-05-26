import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userRole: 'STUDENT',
    address: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          setError('No user found. Please login.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/auth/profile/${storedUser.id}`
        );
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(
        `http://localhost:8080/api/auth/profile/${storedUser.id}`,
        user,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:8080/api/auth/profile/${storedUser.id}`);
      localStorage.removeItem('user');
      navigate('/signup');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
        <p className="text-lg">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Profile' : 'My Profile'}</h2>

        {error && <div className="bg-red-600 text-white px-4 py-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-600 text-white px-4 py-2 mb-4 rounded">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" value={user.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" value={user.lastName} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={user.email} onChange={handleChange} />
            <InputField label="Address" name="address" value={user.address} onChange={handleChange} />
            <InputField label="Phone Number" name="phoneNumber" type="tel" value={user.phoneNumber} onChange={handleChange} />

            <div className="mt-8 flex justify-end gap-4 col-span-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileItem label="First Name" value={user.firstName} />
              <ProfileItem label="Last Name" value={user.lastName} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="User ID" value={user.userId} />
              <ProfileItem label="Phone Number" value={user.phoneNumber} />
              <ProfileItem label="Address" value={user.address} />
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Role</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user.userRole === 'TEACHER' ? 'bg-purple-600' : 'bg-green-600'
                  }`}
                >
                  {user.userRole}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
              >
                Edit Profile
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                onClick={() => setShowConfirmModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">Are you sure you want to delete your account?</h3>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmModal(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <span className="block text-sm font-semibold text-gray-400 mb-1">{label}</span>
    <span className="block text-lg text-white">{value || 'N/A'}</span>
  </div>
);

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm text-gray-300 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default ProfilePage;