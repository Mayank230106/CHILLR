import EventCard from "../components/EventCard";
import "../styles/Events.css";

const mockEvents = [
  {
    id: 1,
    title: "Rock Concert",
    date: "2025-07-01",
    image: "/event1.jpg"
  },
  {
    id: 2,
    title: "Tech Conference",
    date: "2025-07-10",
    image: "/event2.jpg"
  }
];

export default function Events() {
  return (
    <div className="events-container">
      <h2 className="events-heading">Upcoming Events</h2>
      <div className="events-grid">
        {mockEvents.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
