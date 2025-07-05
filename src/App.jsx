import Navbar from "./components/Navbar";
import Silk from "./components/Silk";
import HeroSection from "./components/HeroSection";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <>
    <div className="fixed top-0 left-0 w-full h-full -z-10">
    <Silk
      speed={5}
      scale={1}
      color="#7B7481"
      noiseIntensity={1.5}
      rotation={0}
    />
  </div>
      {/* <Navbar /> */}
      <Layout />
      <Dashboard />
      {/* <HeroSection /> */}
    </>
  );
}

export default App;
