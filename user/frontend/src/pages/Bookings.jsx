import { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setMessage("");
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setMessage("You must be logged in to view bookings.");
          setBookings([]);
          setLoading(false);
          return;
        }
        // Fetch user profile to get bookings
        const res = await axios.get("/api/v1/users/profile", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (res.data && res.data.data && res.data.data.bookings) {
          setBookings(res.data.data.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setMessage("Failed to fetch bookings.");
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "24px", minHeight: "60vh" }}>
      <h2>Your Bookings</h2>
      {loading ? (
        <div>Loading...</div>
      ) : message ? (
        <div style={{ color: "#ffbaba" }}>{message}</div>
      ) : bookings.length === 0 ? (
        <div style={{ color: "#a7bfe8", marginTop: "24px" }}>
          No bookings for now.
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: "auto" }}>
          {bookings.map((b, idx) => (
            <div
              key={b._id || idx}
              style={{
                background: "rgba(34,40,49,0.92)",
                color: "#f3f6fa",
                borderRadius: "12px",
                margin: "16px 0",
                padding: "18px",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)"
              }}
            >
              <div>
                <strong>Event:</strong> {b.eventId?.title || b.eventId || "N/A"}
              </div>
              <div>
                <strong>Tickets:</strong> {b.ticketsCount}
              </div>
              <div>
                <strong>Date:</strong> {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A"}
              </div>
              <div>
                <strong>Status:</strong> {b.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
