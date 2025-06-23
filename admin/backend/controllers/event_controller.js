// controllers/eventsController.js
import Event from "../models/events.js";
export const addEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      organizer,
      tags,
      isPublished,
      bannerImage
    } = req.body;

    const event = new Event({
      title,
      description,
      location,
      date,
      organizer,
      tags,
      isPublished,
      bannerImage
    });

    const savedEvent = await event.save();

    // ✅ Console log the saved event
    console.log("🎉 New Event Added:", savedEvent);

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("AddEvent error:", err);
    res.status(400).json({ message: err.message });
  }
};


export const DeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ message: err.message });
  }
};
