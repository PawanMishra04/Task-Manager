import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Login from './Login';
import Register from './Register';
import UpdateTask from './UpdateTask';

const App = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the token is present in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Empty array ensures this runs only once when the component mounts

  return (
    <Router>
      {/* Render Navbar only if user is logged in */}
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Login Route */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/create-task" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Register Route */}
        <Route path="/register" element={<Register />} />

        {/* Create Task Route */}
        <Route
          path="/create-task"
          element={isLoggedIn ? <TaskForm /> : <Navigate to="/login" />}
        />

        {/* All Tasks Route */}
        <Route
          path="/tasks"
          element={isLoggedIn ? <TaskList /> : <Navigate to="/login" />}
        />

        <Route
          path="/update-task/:id"
          element={isLoggedIn ? <UpdateTask /> : <Navigate to="/login" />}
        />

        {/* Default route: redirect to create-task if logged in */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/create-task" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;