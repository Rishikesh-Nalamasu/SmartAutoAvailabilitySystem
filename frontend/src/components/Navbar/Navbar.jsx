import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>🗺️ Admin Dashboard</h1>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Locations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/checkpoints" className="nav-link">
              Checkpoints
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
