
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HeroNavbar from "./components/layout/Navbar/HeroNavbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Profile from "./pages/profile.jsx";
import Logout from "./pages/logout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { TaskProvider } from "./Context/TaskContext.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (no layout) */}
        <Route
          path="/"
          element={
            <>
              <HeroNavbar />
              <HeroSection />
            </>
          }
        />

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
          <Route path="/home/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;