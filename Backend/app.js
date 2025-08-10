const express = require("express");
const path = require("path");
const cors = require('cors');
const taskRoutes = require("./task-manager/routes/taskRoutes");
const userRoutes = require("./task-manager/routes/userRoutes");
const errorHandler = require("./middlewares/errorHandling"); 

const app = express();

// Middleware
app.use(express.json());

// This list contains all the URLs that are allowed to make requests to your backend.
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://al-together.netlify.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


// Routes
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handling Middleware
app.use(errorHandler); // Use the global error handler

module.exports = app;
