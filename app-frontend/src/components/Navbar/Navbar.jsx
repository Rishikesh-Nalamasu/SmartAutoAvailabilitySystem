import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/services">Services</Link>
            <Link to="/about-us">About Us</Link>
            <button onClick={() => setShowLogin(true)}>Login</button>
          </>
        ) : (
          <>
            <Link to="/prediction">Prediction</Link>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </>
        )}
      </nav>

      {showLogin && (
        <div className="login-popup">
          <div className="login-box">
            <h3>Login</h3>
            <button onClick={() => { setIsLoggedIn(true); setShowLogin(false); }}>
              Login
            </button>
            <button onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
