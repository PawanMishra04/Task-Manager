<!-- Task Management Application:-

This is a Task Management Application that allows users to authenticate, create, manage tasks, and export them to Excel. The application includes a backend built with Node.js for authentication and a frontend using React.js and vite with TailwindCSS for styling. The task data is stored in an SQLite database, and the task management is integrated with a Django REST Framework backend for handling CRUD operations and task export to Excel. -->

<!-- Features:- -->

Authentication using Node.js backend.
Frontend built React.js and vite tool.
TailwindCSS for styling.
Task creation and storage in an SQLite database.
Integration with a Django REST Framework backend for handling:
Tasks CRUD operations (Create, Read, Update, Delete).
Export tasks to Excel functionality, which is downloadable from the frontend

<!-- Technologies Used:- -->

<!-- Backend:- -->

Node.js (for handling authentication and task management)
SQLite (for storing task data)
Express.js (for creating the API)
JWT (for user authentication)
Django REST Framework (for CRUD operations and Excel export)

<!-- Frontend:- -->

React.js and vite (for building the user interface)
TailwindCSS (for responsive styling)
Axios (for making HTTP requests to the backend)

<!-- Application Functionalities:- -->

<!-- 1. User Authentication:- -->
Registration and login forms for users to create an account and log in.
Upon successful login, users are redirected to the task creation page.
<!-- 2. Task Management -->
<!-- Task Creation Form:- -->
Fields: Task Title, Description, Effort to Complete (in Days), and Due Date.
Input validation (ensures non-empty title, valid date, etc.)
Task List View:
Displays all tasks created by the logged-in user.
Task Update View:
Allows users to edit task details.
Task Delete Button:
Users can delete tasks. -->
<!-- 3. Export Tasks to Excel -->
A button labeled "Export to Excel" is added.
Clicking the button triggers an API call to the backend to download an Excel file containing the user's tasks.

 <!-- Project Setup:- -->

Set Up the Backend:-

Install Backend Dependencies
Navigate to the backend directory and install the necessary dependencies

cd backend
npm install

<!-- Create .env File for Environment Variables
In the backend directory, create a .env file and add the following environment variables: -->

PORT=5000
JWT_SECRET=your-secret-key

<!-- Run the Backend
To start the backend server -->
node server.js
<!-- 
Set Up the Frontend:-
Install Frontend Dependencies
Navigate to the frontend directory and install the required dependencies: -->
cd frontend
npm install

<!-- Create vite app with react:- -->
npm ceate vite@latest

<!-- Run the Frontend
To start the frontend development server: -->
npm run dev

The frontend will be running on http://localhost:5173

<!-- Database Setup -->
<!-- The application uses SQLite3 to interact with the database, and the database schema is automatically created when the backend starts. -->

<!-- Backend Routes:- -->

The backend exposes the following routes:

POST /api/register: Registers a new user.
POST /api/login: Logs in a user and provides a JWT.
GET /api/tasks: Retrieves all tasks created by the logged-in user.
POST /api/tasks: Creates a new task for the logged-in user.
PUT /api/tasks/:id: Updates an existing task.
DELETE /api/tasks/:id: Deletes a task.
GET /api/tasks/export: Exports all tasks to an Excel file.

<!-- Frontend Components -->
Login Component: Allows users to log in and access tasks.
Task Form: Allows users to create a new task with title, description, effort, and due date.
Task List: Displays a list of tasks created by the logged-in user.
Task Edit and Delete: Allows users to update or delete tasks.
Export Button: Triggers the export of tasks to an Excel file.


<!-- Usage Instructions:- -->

<!-- Register a User -->

Visit the login page.
Click on the Register link and fill out the registration form with your details.
After successful registration, you will be redirected to the login page.

<!-- Login to the Application -->
Visit the login page and enter your credentials (email and password).
Upon successful login, you will be redirected to the task creation page.

<!-- Manage Tasks -->
Create a Task: Fill out the form to create a new task with the title, description, effort (in days), and due date.
View Tasks: All tasks created by the logged-in user will be displayed.
Update Task: Click on a task to edit its details.
Delete Task: Click on the delete button next to any task to remove it.

<!-- Export Tasks to Excel -->
Click on the Export to Excel button.
The tasks will be exported and downloaded as an Excel file. 