import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../styles/Events.css";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/events/listed")
      .then(res => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="events-container" style={{ minHeight: "80vh", paddingTop: "40px", width: "100%" }}>
      <h2
        className="events-heading"
        style={{
          color: "#00c6fb",
          fontWeight: 700,
          fontSize: "2.5rem",
          letterSpacing: "1px",
          marginBottom: "32px",
          textAlign: "left",
          textShadow: "0 2px 16px #23252688",
          marginLeft: "48px",
          marginTop: "48px",
          position: "absolute",
          left: 0,
          top: 0,
          padding: "40px 0 0 48px",
        }}
      >
        Upcoming Events
      </h2>
      <div style={{ height: "80px" }} /> {/* Spacer for the fixed heading */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className="events-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            gap: "32px",
          }}
        >
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
