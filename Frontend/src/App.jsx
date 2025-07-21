import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HeroNavbar from "./components/layout/Navbar/HeroNavbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import Dashboard from "./pages/dashboard.jsx";
import HomePage from "./pages/HomePage.jsx"; 
import Profile from "./pages/profile.jsx";
import Logout from "./pages/logout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

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

        {/* All other routes that use the dashboard layout */}
        <Route path="/home" element={<Layout />}>
          <Route path="/home/dashboard" element={<Dashboard />} />
          {/* Use the HomePage component for the /home/tasks route */}
          <Route path="/home/tasks" element={<HomePage />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
