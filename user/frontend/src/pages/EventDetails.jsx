import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedTickets, setBookedTickets] = useState(0);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMessage("");
    axios.get(`/api/v1/events/${id}`)
      .then(res => setEvent(res.data.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Check if this event is already booked by the user and how many tickets
    const checkBooking = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setIsBooked(false);
        setBookedTickets(0);
        return;
      }
      try {
        const res = await axios.get("/api/v1/users/profile", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        if (
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data.bookings)
        ) {
          const booking = res.data.data.bookings.find(
            (b) => b.eventId && (b.eventId._id === id || b.eventId === id)
          );
          if (booking) {
            setIsBooked(true);
            setBookedTickets(booking.ticketsCount || 1);
          } else {
            setIsBooked(false);
            setBookedTickets(0);
          }
        } else {
          setIsBooked(false);
          setBookedTickets(0);
        }
      } catch {
        setIsBooked(false);
        setBookedTickets(0);
      }
    };
    checkBooking();
    // Expose for reuse after booking
    EventDetails.checkBooking = checkBooking;
  }, [id]);

  useEffect(() => {
    // Check if in cart from backend
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setInCart(false);
          return;
        }
        const res = await axios.get("/api/v1/users/cart", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        });
        if (res.data && Array.isArray(res.data.data)) {
          setInCart(res.data.data.some(item =>
            (item.eventId?._id || item.eventId) === id
          ));
        } else {
          setInCart(false);
        }
      } catch {
        setInCart(false);
      }
    };
    fetchCart();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "/api/v1/users/cart",
        { eventId: event._id },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setInCart(true);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to add to cart."
      );
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await axios.delete(`/api/v1/users/cart/${event._id}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setInCart(false);
      setMessage("Removed from cart!");
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to remove from cart."
      );
    }
  };

  const handleBuyTicket = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setMessage("Please login to book tickets.");
      return;
    }
    const ticketsCountRaw = prompt("Enter number of tickets to book:", "1");
    // Strictly check for positive integer
    if (
      !ticketsCountRaw ||
      !/^\d+$/.test(ticketsCountRaw) ||
      Number(ticketsCountRaw) < 1
    ) {
      setMessage("Invalid ticket count.");
      return;
    }
    const ticketsCount = Number(ticketsCountRaw);

    // Check ticket availability before making API call
    if (
      event &&
      typeof event.ticketsSold === "number" &&
      typeof event.numberOfTickets === "number" &&
      event.ticketsSold + ticketsCount > event.numberOfTickets
    ) {
      setMessage("These tickets are not available.");
      return;
    }

    setBookingLoading(true);
    setMessage("");
    try {
      await axios.post(
        "/api/v1/users/bookings",
        { eventId: id, ticketsCount },
        { withCredentials: true }
      );
      // Fetch latest booking info from backend after booking
      if (typeof EventDetails.checkBooking === "function") {
        await EventDetails.checkBooking();
      }
      setMessage("Booking successful!");
    } catch (err) {
      // If booking already exists, try PATCH to update ticket count
      if (err?.response?.status === 409 || (err?.response?.data?.message || "").toLowerCase().includes("already booked")) {
        try {
          await axios.patch(
            "/api/v1/users/bookings",
            { eventId: id, ticketsCount },
            { withCredentials: true }
          );
          if (typeof EventDetails.checkBooking === "function") {
            await EventDetails.checkBooking();
          }
          setMessage("Booking updated successfully!");
        } catch (patchErr) {
          setMessage(
            patchErr?.response?.data?.message || "Booking update failed. Please try again."
          );
        }
      } else if (
        err?.response?.data?.message &&
        err.response.data.message.toLowerCase().includes("not available")
      ) {
        setMessage("These tickets are not available.");
      } else {
        setMessage(
          err?.response?.data?.message || "Booking failed. Please try again."
        );
      }
    }
    setBookingLoading(false);
  };

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;
  if (!event) return <div style={{ padding: "24px" }}>Event not found.</div>;

  return (
    <div style={{
      padding: "32px",
      maxWidth: "600px",
      margin: "40px auto 40px 60px",
      background: "rgba(34,40,49,0.92)",
      borderRadius: "18px",
      color: "#f3f6fa",
      boxShadow: "0 8px 40px 0 rgba(0,0,0,0.35)"
    }}>
      {/* Banner image as a wide banner */}
      {event.bannerImage ? (
        <div style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto 24px auto",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)"
        }}>
          <img
            src={event.bannerImage}
            alt={event.title}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              display: "block"
            }}
          />
        </div>
      ) : (
        <div style={{ marginBottom: "18px", color: "#a7bfe8" }}>No image available</div>
      )}
      <h2 style={{ marginBottom: "18px" }}>{event.title || "N/A"}</h2>
      <p><strong>Type:</strong> {event.eventType || "N/A"}</p>
      <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleString() : "N/A"}</p>
      <p><strong>Location:</strong> {event.location || "N/A"}</p>
      <p><strong>Description:</strong> {event.description || "N/A"}</p>
      <p><strong>Tags:</strong> {event.tags && event.tags.length > 0 ? event.tags.join(", ") : "N/A"}</p>
      <p><strong>Organizer:</strong> {event.organizer || "N/A"}</p>
      {/* Do NOT show ticketsSold or numberOfTickets */}
      {isBooked && (
        <div style={{ color: "#a7bfe8", margin: "12px 0" }}>
          Booked ({bookedTickets} ticket{bookedTickets > 1 ? "s" : ""})
        </div>
      )}
      {message && (
        <div style={{ color: "#a7bfe8", margin: "12px 0" }}>{message}</div>
      )}
      {!isBooked && (
        inCart ? (
          <button
            onClick={handleRemoveFromCart}
            style={{
              padding: "10px 20px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "16px",
              marginTop: "18px",
              marginRight: "12px"
            }}
          >
            Remove from Cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            style={{
              padding: "10px 20px",
              background: "#005bea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "16px",
              marginTop: "18px",
              marginRight: "12px"
            }}
          >
            Add to Cart
          </button>
        )
      )}
      <button
        onClick={handleBuyTicket}
        disabled={bookingLoading}
        style={{
          padding: "10px 20px",
          background: isBooked ? "#888" : "#00c6fb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: 600,
          fontSize: "16px",
          marginTop: "18px"
        }}
      >
        {isBooked
          ? `Booked (${bookedTickets} ticket${bookedTickets > 1 ? "s" : ""})`
          : bookingLoading
            ? "Booking..."
            : "Buy Ticket"}
      </button>
    </div>
  );
}