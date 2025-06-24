// routes/event_router.js
import express from "express";
import { upload } from "../features/mul.js";   // your multer.memoryStorage()
import {
  addEvent,
  DeleteEvent,
  getClientDashboardStats,
  getEvents
} from "../controllers/event_controller.js";

const event_router = express.Router();

// Get events created by a specific client
event_router.get("/client/:clientId", getEvents);

// Add new event (multipart/form-data); multer populates req.file & req.body
event_router.post("/add", upload.single('bannerImage'), addEvent);

// Delete event by ID
event_router.delete("/:id", DeleteEvent);

// Stats endpoint
event_router.get("/stats", getClientDashboardStats);

export default event_router;
