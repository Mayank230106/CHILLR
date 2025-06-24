import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        color: "#f3f6fa",
        borderRadius: "18px",
        boxShadow: "0 6px 32px 0 rgba(0,0,0,0.22)",
        padding: "32px 28px 28px 28px",
        minWidth: "260px",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        transition: "transform 0.18s, box-shadow 0.18s",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        {event.title || "N/A"}
      </div>
      <div
        style={{
          fontSize: "1.05rem",
          color: "#a7bfe8",
          marginBottom: "24px",
        }}
      >
        {event.date ? new Date(event.date).toLocaleString() : "N/A"}
      </div>
      <Link
        to={`/events/${event._id}`}
        style={{
          display: "inline-block",
          padding: "10px 28px",
          background: "linear-gradient(90deg, #00c6fb 0%, #005bea 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "1rem",
          textDecoration: "none",
          boxShadow: "0 2px 12px 0 #00c6fb44",
          transition: "background 0.2s, box-shadow 0.2s",
          marginTop: "auto",
          letterSpacing: "0.5px",
        }}
      >
        Details
      </Link>
    </div>
  );
}
