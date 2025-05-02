import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = () => {
    // Clear the token from localStorage on logout
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Task Manager</div>
        <div>
          <Link to="/create-task" className="text-white px-4 py-2 hover:bg-blue-500 rounded">
            Create Task
          </Link>
          <Link to="/tasks" className="text-white px-4 py-2 hover:bg-blue-500 rounded">
            All Tasks
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-white px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
