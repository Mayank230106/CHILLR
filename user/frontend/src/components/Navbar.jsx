import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const syncLoginState = () => setIsLoggedIn(!!localStorage.getItem("user"));
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("user-auth-changed", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("user-auth-changed", syncLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("user-auth-changed"));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="logo" to="/">Ticketify</Link>
      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/cart">Cart</Link>
        {isLoggedIn && <Link to="/bookings">Bookings</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary-color)",
              font: "inherit",
              cursor: "pointer",
              marginLeft: "20px",
              padding: "6px 12px",
              borderRadius: "4px"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
