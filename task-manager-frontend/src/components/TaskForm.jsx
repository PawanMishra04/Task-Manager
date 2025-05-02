import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State to track success message

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !effort || !dueDate) {
      setError('All fields are required');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      setError('You must be logged in to create a task');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/tasks', {
        title,
        description,
        effort,
        dueDate,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to Authorization header
        }
      });

      // Show success message
      setSuccessMessage('Task Created Successfully');
      setError(''); // Reset error message if task is created successfully

      // Reset form fields
      setTitle('');
      setDescription('');
      setEffort('');
      setDueDate('');

      // Optionally, you can call onSubmit if needed
      onSubmit();
      // Automatically hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Task</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded">
          {successMessage}
        </div>
      )}  

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Effort to Complete (in days)</label>
          <input
            type="number"
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter effort in days"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;