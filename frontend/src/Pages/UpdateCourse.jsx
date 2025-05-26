import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/course");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/course/${id}`);
      setMessage(res.data);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      image: null, // Reset the image field
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const courseDetails = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
    };

    const formPayload = new FormData();
    formPayload.append("courseDetails", JSON.stringify(courseDetails));
    if (formData.image) {
      formPayload.append("file", formData.image);
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/course/${selectedCourse.id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Course updated successfully!");
      setSelectedCourse(null);
      fetchCourses(); // Refresh the course list
    } catch (err) {
      console.error("Failed to update course:", err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Update Course</h2>

      {message && (
        <div className="text-green-400 mb-4 font-medium">{message}</div>
      )}

      {selectedCourse ? (
        <form
          onSubmit={handleUpdate}
          className="bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-purple-300 mb-4">
            Update Course: {selectedCourse.title}
          </h3>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          {courses.length === 0 ? (
            <p className="text-gray-300">No courses found.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-semibold text-purple-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-300">{course.description}</p>
                  <p className="text-gray-400">Price: ${course.price}</p>

                  {course.imageUrl && (
                    <img
                      src={`http://localhost:8080/uploads/${course.imageUrl}`}
                      alt={course.title}
                      className="w-full max-w-xs mt-3 rounded"
                    />
                  )}

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default UpdateCourse;