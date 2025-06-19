import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  
  const event = {
    id,
    title: "Sample Event",
    date: "2025-07-01",
    description: "This is a demo event page.",
    image: "/event1.jpg",
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>{event.title}</h2>
      <img src={event.image} alt={event.title} style={{ width: "100%", maxWidth: "600px" }} />
      <p><strong>Date:</strong> {event.date}</p>
      <p>{event.description}</p>
      <button style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
        Buy Ticket
      </button>
    </div>
  );
}
