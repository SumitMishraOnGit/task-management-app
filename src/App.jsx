import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HeroNavbar from "./components/HeroNavbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import Dashboard from "./pages/dashboard.jsx";
import HomePage from "./pages/HomePage.jsx"; // Import the HomePage component
import Profile from "./pages/profile.jsx";
import Logout from "./pages/logout.jsx";

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
