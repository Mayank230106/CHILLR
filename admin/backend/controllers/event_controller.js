// controllers/eventController.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
    let {
      title,
      description = '',
      location = 'Online',
      date,
      tags: rawTags,
      isPublished = 'false',
      numberOfTickets = '0',
      eventType,
    } = req.body;

    // Normalize array -> single string
    if (Array.isArray(eventType)) eventType = eventType[0];

    if (!title || !date || !eventType) {
      return res.status(400).json({ message: "title, date, and eventType are required." });
    }

    // Parse tags
    let tags = [];
    if (rawTags) {
      try {
        tags = JSON.parse(rawTags);
      } catch {
        tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    // Upload banner image
    let bannerImageUrl = '';
    if (req.file?.buffer) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'events_banners',
        public_id: uuidv4(),
      });
      bannerImageUrl = result.secure_url;
    }

    const organizer = getUserIdFromHeader(req);
    const event = new Event({
      title,
      description,
      location,
      date,
      tags,
      isPublished: isPublished === 'true',
      numberOfTickets: parseInt(numberOfTickets, 10),
      ticketsSold: 0,                  // initialize to zero
      organizer,
      bannerImage: bannerImageUrl,
      eventType,
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

// Record ticket sale: decrement available, increment sold
export const recordTicketSale = async (req, res) => {
  try {
    const { id } = req.params;
    const soldCount = parseInt(req.body.count, 10) || 1;

    const updated = await Event.findOneAndUpdate(
      { _id: id, numberOfTickets: { $gte: soldCount } },
      {
        $inc: {
          numberOfTickets: -soldCount,
          ticketsSold: soldCount,
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }
    return res.json(updated);

  } catch (err) {
    console.error("recordTicketSale error:", err);
    return res.status(500).json({ message: err.message });
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

// Dashboard stats for client (includes totalTicketsSold)
export const getClientDashboardStats = async (req, res) => {
  try {
    const clientId = getUserIdFromHeader(req);
    const totalEvents = await Event.countDocuments({ organizer: clientId });

    const soldAgg = await Event.aggregate([
      { $match: { organizer: new mongoose.Types.ObjectId(clientId) } },
      { $group: { _id: null, totalSold: { $sum: "$ticketsSold" } } }
    ]);
    const totalTicketsSold = soldAgg[0]?.totalSold || 0;

    return res.json({
      totalEvents,
      totalTicketsSold,
      revenue: 0,
      newAttendees: 0,
    });
  } catch (err) {
    console.error("getClientDashboardStats error:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Get event counts grouped by eventType
export const getClientEventCategoryStats = async (req, res) => {
  try {
    const clientId = getUserIdFromHeader(req);

    const categoryStats = await Event.aggregate([
      {
        $match: {
          organizer: new mongoose.Types.ObjectId(clientId),
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          eventType: "$_id",
          count: 1,
        },
      },
    ]);

    return res.json({ categoryStats });
  } catch (err) {
    console.error("getClientEventCategoryStats error:", err);
    return res.status(500).json({ message: err.message });
  }
};
