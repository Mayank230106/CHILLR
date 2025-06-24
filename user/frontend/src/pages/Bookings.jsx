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
        const res = await axios.get("/api/v1/users/bookings", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (res.data && Array.isArray(res.data.data)) {
          setBookings(res.data.data);
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

  // Split bookings into upcoming and past based on event date
  const now = new Date();
  const upcoming = [];
  const past = [];
  bookings.forEach(b => {
    const eventDate = b.eventId?.date ? new Date(b.eventId.date) : null;
    if (eventDate && eventDate > now) {
      upcoming.push(b);
    } else {
      past.push(b);
    }
  });

  return (
    <div
      style={{
        padding: "32px 0 0 0",
        minHeight: "60vh",
        background: "transparent",
        marginTop: "64px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingLeft: "32px", paddingRight: "16px" }}>
        <h2 style={{ marginBottom: "32px", textAlign: "left", color: "#005bea", fontSize: "2.4rem", fontWeight: 700 }}>
          Your Bookings
        </h2>
        {loading ? (
          <div style={{ textAlign: "center" }}>Loading...</div>
        ) : message ? (
          <div style={{ color: "#ffbaba", textAlign: "center" }}>{message}</div>
        ) : bookings.length === 0 ? (
          <div style={{ color: "#a7bfe8", marginTop: "24px", textAlign: "center" }}>
            No bookings for now.
          </div>
        ) : (
          <div>
            <div>
              <h3 style={{ margin: "32px 0 16px 0", color: "#00c6fb", textAlign: "left", fontSize: "1.5rem", fontWeight: 600 }}>
                Upcoming Events
              </h3>
              <div style={{ paddingBottom: "8px" }}>
                {upcoming.length === 0 ? (
                  <div style={{ color: "#a7bfe8", margin: "12px 0" }}>No upcoming events.</div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "18px",
                    }}
                  >
                    {upcoming.map((b, idx) => (
                      <div
                        key={b._id || "upcoming-" + idx}
                        style={{
                          background: "rgba(34,40,49,0.92)",
                          color: "#f3f6fa",
                          borderRadius: "12px",
                          padding: "18px",
                          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
                          minWidth: "260px",
                          maxWidth: "320px",
                          flex: "1 1 260px",
                          marginBottom: "8px"
                        }}
                      >
                        <div>
                          <strong>Event:</strong> {b.eventId?.title || b.eventId || "N/A"}
                        </div>
                        <div>
                          <strong>Tickets:</strong> {b.ticketsCount}
                        </div>
                        <div>
                          <strong>Date:</strong> {b.eventId?.date ? new Date(b.eventId.date).toLocaleString() : "N/A"}
                        </div>
                        <div>
                          <strong>Status:</strong> {b.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 style={{ margin: "40px 0 16px 0", color: "#888", textAlign: "left", fontSize: "1.5rem", fontWeight: 600 }}>
                Past Events
              </h3>
              <div style={{ paddingBottom: "8px" }}>
                {past.length === 0 ? (
                  <div style={{ color: "#a7bfe8", margin: "12px 0" }}>No past events.</div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "18px",
                    }}
                  >
                    {past.map((b, idx) => (
                      <div
                        key={b._id || "past-" + idx}
                        style={{
                          background: "rgba(34,40,49,0.92)",
                          color: "#f3f6fa",
                          borderRadius: "12px",
                          padding: "18px",
                          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
                          minWidth: "260px",
                          maxWidth: "320px",
                          flex: "1 1 260px",
                          marginBottom: "8px"
                        }}
                      >
                        <div>
                          <strong>Event:</strong> {b.eventId?.title || b.eventId || "N/A"}
                        </div>
                        <div>
                          <strong>Tickets:</strong> {b.ticketsCount}
                        </div>
                        <div>
                          <strong>Date:</strong> {b.eventId?.date ? new Date(b.eventId.date).toLocaleString() : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}