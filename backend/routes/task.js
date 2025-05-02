const express = require('express');
const exceljs = require('exceljs');
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

// Create task
router.post('/tasks', verifyToken, (req, res) => {
  const { title, description, effort, dueDate } = req.body;
  const userId = req.user.id; // Get the user ID from the token (from the authMiddleware)

  // Validate input fields
  if (!title || !description || !effort || !dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert task into the database
  db.run(
    `INSERT INTO tasks (title, description, effort, due_date, user_id) VALUES (?, ?, ?, ?, ?)`,
    [title, description, effort, dueDate, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error while creating task' });
      }
      res.status(201).json({ message: 'Task created successfully', taskId: this.lastID });
    }
  );
});

// Fetch tasks for the logged-in user
router.get('/tasks', verifyToken, (req, res) => {
  const userId = req.user.id; // Get the user ID from the token

  // Query the database to get tasks for the user
  db.all(
    `SELECT * FROM tasks WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while fetching tasks' });
      }
      res.status(200).json({ tasks: rows });
    }
  );
});

// Fetch a single task by ID
router.get('/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the user ID from the token

  // Query the database to get the task for the user
  const query = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;

  db.get(query, [id, userId], (err, task) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error while fetching task' });
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ task });
  });
});


// Export tasks to Excel
router.get('/tasks/export', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch tasks created by the logged-in user
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM tasks WHERE user_id = ?`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err); // Reject if error occurs
          } else {
            resolve(rows); // Resolve with the fetched rows
          }
        }
      );
    });

    // Create a new workbook and worksheet
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Tasks');

    // Add headers to the worksheet
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Effort (Days)', key: 'effort', width: 15 },
      { header: 'Due Date', key: 'due_date', width: 20 },
    ];

    // Add task rows
    rows.forEach((task) => {
      worksheet.addRow(task);
    });

    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.xlsx"');

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting tasks:', error);
    res.status(500).json({ error: 'Error generating Excel file' });
  }
});

// Update Task
router.put('/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, description, effort, due_date } = req.body;
  const userId = req.user.id;

  const query = `
        UPDATE tasks
        SET title = ?, description = ?, effort = ?, due_date = ?
        WHERE id = ? AND user_id = ?`;

  db.run(query, [title, description, effort, due_date, id, userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error while updating task' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  });
});

// Delete task by ID
router.delete('/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the user ID from the token

  // SQL query to delete the task
  const query = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;

  db.run(query, [id, userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error while deleting task' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
