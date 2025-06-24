import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "32px", minHeight: "60vh" }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={{ color: "#a7bfe8", marginTop: "24px" }}>
          Cart is empty.
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: "auto" }}>
          {cart.map((item) => (
            <div
              key={item._id}
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
              }}
            >
              {item.bannerImage && (
                <img
                  src={item.bannerImage}
                  alt={item.title}
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
                  <strong>{item.title || "N/A"}</strong>
                </div>
                <div style={{ color: "#a7bfe8" }}>
                  {item.date
                    ? new Date(item.date).toLocaleString()
                    : "N/A"}
                </div>
              </div>
              <Link
                to={`/events/${item._id}`}
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
                onClick={() => removeFromCart(item._id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
