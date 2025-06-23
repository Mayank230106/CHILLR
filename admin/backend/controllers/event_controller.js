import jwt from "jsonwebtoken";
import Event from "../models/events.js";

// ✅ Utility to extract user ID from Authorization header
const getUserIdFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// ✅ Add new event
export const addEvent = async (req, res) => {
  try {
    const { title, description, location, date, tags, isPublished, bannerImage } = req.body;

    const organizer = getUserIdFromHeader(req);

    const event = new Event({
      title,
      description,
      location,
      date,
      organizer,
      tags,
      isPublished,
      bannerImage,
    });

    const savedEvent = await event.save();

    console.log("🎉 New Event Added:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("AddEvent error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete event (only by organizer)
export const DeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = getUserIdFromHeader(req);

    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: You cannot delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all events by logged-in client
export const getEvents = async (req, res) => {
  try {
    const clientId = getUserIdFromHeader(req);

    const events = await Event.find({ organizer: clientId }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Dashboard stats for client (number of events etc.)



export const getClientDashboardStats = async (req, res) => {
  try {
    let clientId;
    try {
      clientId = getUserIdFromHeader(req);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: " + err.message });
    }

    const totalEvents = await Event.countDocuments({ organizer: clientId });

    // ❗ TODO: Implement real logic to get tickets/revenue/attendees
    const totalTicketsSold = 0;
    const revenue = 0;
    const newAttendees = 0;

    return res.json({
      totalEvents,
      totalTicketsSold,
      revenue,
      newAttendees,
    });
  } catch (err) {
    console.error("getClientDashboardStats error:", err);
    return res.status(500).json({ message: err.message || 'Failed to fetch dashboard stats' });
  }
};