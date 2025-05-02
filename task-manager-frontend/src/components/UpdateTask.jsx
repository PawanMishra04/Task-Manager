import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateTask = () => {
  const { id } = useParams(); // Get task ID from URL params
  const navigate = useNavigate(); // React Router v6 replacement for useHistory
  const [task, setTask] = useState({
    title: '',
    description: '',
    effort: '',
    due_date: '', // Match the backend's `due_date` field name
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit a task');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { title, description, effort, due_date } = response.data.task;
        setTask({
          title,
          description,
          effort,
          due_date: due_date.split('T')[0], // Format date for input type="date"
        });
      } catch (err) {
        console.error(err);
        setError('Error fetching task details');
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to update a task');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${id}`,
        {
          title: task.title,
          description: task.description,
          effort: task.effort,
          due_date: task.due_date, // Ensure consistency with the backend's field names
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage('Task updated successfully');
      setTimeout(() => navigate('/tasks'), 2000); // Redirect to task list after success
    } catch (err) {
      console.error(err);
      setError('Error updating task');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Task</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Task Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Effort to Complete (in days)</label>
          <input
            type="number"
            name="effort"
            value={task.effort}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter effort in days"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="due_date" // Match backend field name
            value={task.due_date}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;