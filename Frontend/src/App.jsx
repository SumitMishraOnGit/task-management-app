// Frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./Signup.jsx";
import { TaskProvider } from "./Context/TaskContext.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <TaskProvider>
              <Layout />
            </TaskProvider>
          }
        >
          <Route path="/home/dashboard" element={<Dashboard />} />
          <Route path="/home/tasks" element={<Tasks />} />
          <Route path="/home/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;