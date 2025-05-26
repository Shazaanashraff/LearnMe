import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import './payment.css';

export default function PaymentInterface() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        studentId: "",
        studentName: "",
        amount: "",
        paidOn: "",
        month: "",
        status: "Pending",
        courseId: "",
        courseName: "",
    });

    // Load students and courses
    useEffect(() => {
        // Fetch students
        fetch("http://localhost:8080/api/auth/users")
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
            })
            .catch((err) => console.error("Failed to load students", err));

        // Fetch courses
        fetch("http://localhost:8080/api/course")
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
            })
            .catch((err) => console.error("Failed to load courses", err));
    }, []);



    // Map students to options
    const studentOptions = students.map((s) => ({
        value: s.id,
        label: s.name || `${s.firstName} ${s.lastName}`,
    }));


    // Map courses to options
    const courseOptions = courses.map((c) => ({
        value: c.id.toString(),
        label: c.title, // Changed from name to title
    }));


    const handleStudentChange = (selectedOption) => {
        if (selectedOption) {
            console.log("option", selectedOption)

            setForm((f) => ({
                ...f,
                studentId: selectedOption.value,
                studentName: selectedOption.label || selectedOption.value,
            }));
        } else {
            setForm((f) => ({
                ...f,
                studentId: "",
                studentName: "",
            }));
        }
    };

    const handleCourseChange = (selectedOption) => {
        if (selectedOption) {
            if (selectedOption.__isNew__) {
                // New course name
                setForm((f) => ({
                    ...f,
                    courseId: "",
                    courseName: selectedOption.label,
                }));
            } else {
                // Existing course
                setForm((f) => ({
                    ...f,
                    courseId: selectedOption.value,
                    courseName: selectedOption.label,
                }));
            }
        } else {
            setForm((f) => ({
                ...f,
                courseId: "",
                courseName: "",
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.studentId) {
            alert("Please select or enter a valid student.");
            return;
        }
        if (!form.amount || !form.paidOn || !form.month) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!form.courseId && !form.courseName) {
            alert("Please select or enter a course.");
            return;
        }

        const payload = {
            student: { id: form.studentId },
            amount: parseFloat(form.amount),
            month: form.month,
            status: form.status.toLowerCase(),
            paidOn: form.paidOn,
            course: form.courseId ? { id: form.courseId } : { name: form.courseName },
        };

        try {
            const res = await fetch("http://localhost:8080/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to save payment: ${errorText}`);
            }

            alert("Payment saved successfully!");

            // Reset form
            setForm({
                studentId: "",
                studentName: "",
                amount: "",
                paidOn: "",
                month: "",
                status: "Pending",
                courseId: "",
                courseName: "",
            });
        } catch (err) {
            alert("Error saving payment. Please try again.");
            console.error("Error saving payment:", err);
        }
    };

    return (
        <div className="container">
            <h2 className="text-xl font-semibold mb-4">Add New Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Student Select */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Student</label>
                    <CreatableSelect
                        options={studentOptions}
                        onChange={handleStudentChange}
                        placeholder="Select or type student"
                        isClearable
                        value={
                            form.studentId
                                ? { value: form.studentId, label: form.studentName }
                                : null
                        }
                    />
                </div>

                {/* Course Select */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Course</label>
                    <CreatableSelect
                        options={courseOptions}
                        onChange={handleCourseChange}
                        placeholder="Select or type course"
                        isClearable
                        value={
                            form.courseId
                                ? { value: form.courseId, label: form.courseName }
                                : form.courseName
                                    ? { value: form.courseName, label: form.courseName }
                                    : null
                        }
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Paid On */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="paidOn">Paid On</label>
                    <input
                        id="paidOn"
                        name="paidOn"
                        type="date"
                        value={form.paidOn}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Month */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="month">Month</label>
                    <input
                        id="month"
                        name="month"
                        type="text"
                        placeholder="E.g., May 2025"
                        value={form.month}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Payment
                </button>
            </form>
        </div>
    );
}