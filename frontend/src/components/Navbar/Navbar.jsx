import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🗺️ Admin Panel</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/locations" className={({ isActive }) => isActive ? "active" : ""}>
            📍 Locations
          </NavLink>
        </li>
        <li>
          <NavLink to="/checkpoints" className={({ isActive }) => isActive ? "active" : ""}>
            🎯 Checkpoints
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
