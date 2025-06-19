import "../styles/EventCard.css";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.image} alt={event.title} />
      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
        <Link to={`/events/${event.id}`}>View Details</Link>
      </div>
    </div>
  );
}
