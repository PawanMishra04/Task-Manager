// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Hardcoded secret key for the assessment
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key';

// Registration route
router.post('/register', async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  // Validate inputs
  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  db.run(
    `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`,
    [email, username, hashedPassword],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res
            .status(400)
            .json({ error: 'Email or username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate inputs
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Retrieve the user from the database
  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', token });
    }
  );
});

router.get('/profile', verifyToken, (req, res) => {
  const { username } = req.user; // Extracted from the token
  res.status(200).json({ username });
});

module.exports = router;