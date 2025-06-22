import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("user"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <nav className="navbar">
      <Link className="logo" to="/">Ticketify</Link>
      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/cart">Cart</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
      </div>
    </nav>
  );
}
