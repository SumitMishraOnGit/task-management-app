import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; 
import HeroNavbar from "./components/HeroNavbar";
import HeroSection from "./components/HeroSection";   
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/profile";
import Logout from "./pages/logout";

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

        {/* All other routes that use the dashboard layout */}
        <Route path="/home" element={<Layout />}>
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
