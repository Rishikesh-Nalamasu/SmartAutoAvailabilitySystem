import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar/Navbar";
import Locations from "./pages/Locations/Locations";
import Checkpoints from "./pages/Checkpoints/Checkpoints";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/locations" replace />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/checkpoints" element={<Checkpoints />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
