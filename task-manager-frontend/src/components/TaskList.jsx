import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import the XLSX library

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        setError('You must be logged in to view tasks');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          },
        });
        setTasks(response.data.tasks); // Set the tasks from the response
      } catch (err) {
        setError('Error fetching tasks. Please try again.');
      }
    };

    fetchTasks();
  }, []); // Run this effect on component mount

  

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');const handleExportToExcel = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
  
      if (!token) {
        setError('You must be logged in to export tasks');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:3000/api/tasks/export', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Ensure the response is treated as a blob
        });
  
        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tasks.xlsx'); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error('Error exporting tasks:', err);
        setError('Error exporting tasks. Please try again.');
      }
    };

    
    if (!token) {
      setError('You must be logged in to delete a task');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the task list after successful deletion
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Error deleting task. Please try again.');
    }
  }; 
  
   // Function to export tasks to Excel
   const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks); // Convert tasks data to a worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'tasks.xlsx'); // Trigger download of the Excel file
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={handleExportToExcel}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Excel
      </button>


      {tasks.length === 0 ? (
        <div className="text-gray-500">No tasks found.</div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p><strong>Effort:</strong> {task.effort} days</p>
                <p><strong>Due Date:</strong> {task.due_date}</p>
              </div>
              <div>
                <Link to={`/update-task/${task.id}`} className="text-blue-500 hover:underline px-4 py-2">Edit</Link>
                <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:underline px-4 py-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
