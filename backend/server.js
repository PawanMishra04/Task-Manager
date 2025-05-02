// server.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();



const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for requests from localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (if needed)
}));

app.use(bodyParser.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});