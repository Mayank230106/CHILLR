import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bookings from "./pages/Bookings";

function FooterConditional() {
  const location = useLocation();
  const hideFooter =
    (location.pathname.startsWith("/events") && (location.pathname === "/events" || /^\/events\/[^/]+$/.test(location.pathname)))
    || location.pathname === "/bookings";
  return hideFooter ? null : <Footer />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<h2 style={{ padding: "24px" }}>404 - Page Not Found</h2>} />
      </Routes>
      <FooterConditional />
    </Router>
  );
}

export default App;
