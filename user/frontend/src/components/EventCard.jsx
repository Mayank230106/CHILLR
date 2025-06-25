import { Link } from "react-router-dom";

export default function EventCard({ event, showDetailsButton }) {
  if (!event) return null;
  return (
    <div
      style={{
        background: "#222831",
        borderRadius: "12px",
        color: "#f3f6fa",
        padding: "18px",
        minWidth: "260px",
        maxWidth: "320px",
        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {event.bannerImage && (
        <img
          src={event.bannerImage}
          alt={event.title}
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
      )}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.2rem",
          marginBottom: "8px",
        }}
      >
        {event.title}
      </div>
      <div
        style={{
          color: "#a7bfe8",
          marginBottom: "6px",
        }}
      >
        {event.date ? new Date(event.date).toLocaleString() : "N/A"}
      </div>
      <div
        style={{
          color: "#a7bfe8",
          marginBottom: "6px",
        }}
      >
        {event.location || "N/A"}
      </div>
      <div
        style={{
          color: "#00c6fb",
          fontWeight: 600,
        }}
      >
        {event.eventType || "N/A"}
      </div>
      {showDetailsButton && (
        <Link
          to={`/events/${event._id}`}
          style={{
            marginTop: "16px",
            background: "#00c6fb",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          Event Details
        </Link>
      )}
    </div>
  );
}
