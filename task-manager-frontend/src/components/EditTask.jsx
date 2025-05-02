import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const EditTask = () => {
  const { taskId } = useParams();
  const history = useHistory();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to edit tasks');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTask(response.data.task);
      } catch (err) {
        setError('Error fetching task details. Please try again.');
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to update tasks');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${taskId}`,
        task,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      history.push('/tasks'); // Redirect to Task List after successful update
    } catch (err) {
      setError('Error updating task. Please try again.');
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700">Task Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Effort to Complete (in days)</label>
          <input
            type="number"
            value={task.effort}
            onChange={(e) => setTask({ ...task, effort: e.target.value })}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter effort in days"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={task.due_date}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            className="w-full mt-2 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default EditTask;
