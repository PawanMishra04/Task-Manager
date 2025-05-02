// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Specify the path to the database
const dbPath = path.resolve(__dirname, 'db', 'task_manager.db');

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT
      )`,
      (err) => {
        if (err) {
          console.error('Error creating users table', err);
        }
      }
    );

    // Create task table
    db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        effort INTEGER NOT NULL,
        due_date TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      (err) => {
        if (err) {
          console.error('Error creating tasks table', err);
        }
      }
    );
  }
});

module.exports = db;
