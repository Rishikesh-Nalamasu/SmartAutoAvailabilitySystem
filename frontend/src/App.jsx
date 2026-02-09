import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Locations from "./pages/Locations/Locations";
import Checkpoints from "./pages/Checkpoints/Checkpoints";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Locations />} />
        <Route path="/checkpoints" element={<Checkpoints />} />
      </Routes>
    </Router>
  );
}

export default App;
