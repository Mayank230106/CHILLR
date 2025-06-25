import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setCart([]);
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/v1/users/cart", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setCart(res.data.data);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`/api/v1/users/cart/${id}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const updated = cart.filter(
        (item) => (item.eventId?._id || item.eventId) !== id
      );
      setCart(updated);
    } catch {
      // Optionally show error message
    }
  };

  return (
    <div style={{ padding: "32px", minHeight: "60vh" }}>
      <h2>Your Cart</h2>
      {loading ? (
        <div>Loading...</div>
      ) : cart.length === 0 ? (
        <div style={{ color: "#a7bfe8", marginTop: "24px" }}>Cart is empty.</div>
      ) : (
        <div style={{ maxWidth: 600, margin: "auto" }}>
          {cart.map((item) => {
            const event = item.eventId || {};
            const eventDate = event.date ? new Date(event.date) : null;
            const isExpired = eventDate && eventDate < new Date();
            return (
              <div
                key={event._id || item._id}
                style={{
                  background: "rgba(34,40,49,0.92)",
                  color: "#f3f6fa",
                  borderRadius: "12px",
                  margin: "16px 0",
                  padding: "18px",
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  opacity: isExpired ? 0.6 : 1,
                  border: isExpired ? "2px solid #e74c3c" : undefined,
                }}
              >
                {event.bannerImage && (
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div>
                    <strong>{event.title || "N/A"}</strong>
                  </div>
                  <div style={{ color: "#a7bfe8" }}>
                    {event.date
                      ? new Date(event.date).toLocaleString()
                      : "N/A"}
                  </div>
                  {isExpired && (
                    <div style={{ color: "#e74c3c", fontWeight: 600 }}>
                      Expired Event
                    </div>
                  )}
                </div>
                <Link
                  to={`/events/${event._id || item._id}`}
                  style={{
                    color: "#00c6fb",
                    textDecoration: "underline",
                    fontWeight: 500,
                    marginRight: "12px",
                  }}
                >
                  Details
                </Link>
                <button
                  onClick={() => removeFromCart(event._id || item._id)}
                  style={{
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
