# Task Manager Application

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication (Login/Signup)
- Task Management (Create, Read, Update, Delete)
- Task Analytics Dashboard
- Weekly and Monthly Task Statistics
- Task Status Tracking
- File Upload Support
- Responsive Design

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn


## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-codebase
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

## Running the Application

1. **Start Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Run Both (from root directory)**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
task-manager-codebase/
├── Backend/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── index.html
└── package.json
```

## API Endpoints

### Authentication
- POST `/users/signup` - Register new user
- POST `/users/login` - User login
- POST `/users/refresh-token` - Refresh access token

### Tasks
- GET `/tasks/paginated` - Get paginated tasks
- POST `/tasks` - Create new task
- PUT `/tasks/:id` - Update task
- DELETE `/tasks/:id` - Delete task
- GET `/tasks/stats` - Get task statistics
- GET `/tasks/analytics` - Get task analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
