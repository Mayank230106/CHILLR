import jwt from "jsonwebtoken";
import Event from "../models/events.js";
import cloudinary from '../features/config.js';
import { v4 as uuidv4 } from 'uuid';

// Utility to extract user ID from Authorization header
const getUserIdFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// Add new event
export const addEvent = async (req, res) => {
  try {
    // 1) Read text fields from multer’s req.body
    const {
      title,
      description = '',
      location = 'Online',
      date,
      tags: rawTags,
      isPublished = 'false',
      numberOfTickets = '0'
    } = req.body;

    // 2) Validate required
    if (!title || !date) {
      return res.status(400).json({ message: "title and date are required." });
    }

    // 3) Parse tags (JSON array or comma string)
    let tags = [];
    if (rawTags) {
      try {
        tags = JSON.parse(rawTags);
      } catch {
        tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    // 4) Upload bannerImage if present
    let bannerImageUrl = '';
    if (req.file?.buffer) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'events_banners',
        public_id: uuidv4(),
      });
      bannerImageUrl = result.secure_url;
    }

    // 5) Build + save
    const organizer = getUserIdFromHeader(req);
    const event = new Event({
      title,
      description,
      location,
      date,
      tags,
      isPublished: isPublished === 'true',
      numberOfTickets: parseInt(numberOfTickets, 10),
      organizer,
      bannerImage: bannerImageUrl,
    });

    const savedEvent = await event.save();
    console.log("🎉 New Event Added:", savedEvent);
    return res.status(201).json(savedEvent);

  } catch (err) {
    console.error("AddEvent error:", err);
    const status = err.name === 'ValidationError' ? 400
                  : err.name === 'JsonWebTokenError'  ? 401
                  : 500;
    return res.status(status).json({ message: err.message });
  }
};

// Delete event (only by organizer)
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
    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get all events by logged-in client
export const getEvents = async (req, res) => {
  try {
    const clientId = getUserIdFromHeader(req);
    const events = await Event.find({ organizer: clientId }).sort({ date: -1 });
    return res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Dashboard stats for client
export const getClientDashboardStats = async (req, res) => {
  try {
    const clientId = getUserIdFromHeader(req);
    const totalEvents = await Event.countDocuments({ organizer: clientId });
    return res.json({
      totalEvents,
      totalTicketsSold: 0,
      revenue: 0,
      newAttendees: 0,
    });
  } catch (err) {
    console.error("getClientDashboardStats error:", err);
    return res.status(500).json({ message: err.message });
  }
};
