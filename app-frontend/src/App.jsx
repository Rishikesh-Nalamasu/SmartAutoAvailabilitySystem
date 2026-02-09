import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import AboutUs from "./pages/AboutUs/AboutUs";
import Prediction from "./pages/Prediction/Prediction";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
