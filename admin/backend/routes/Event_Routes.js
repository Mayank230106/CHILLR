import express from "express";
import { addEvent, DeleteEvent, getClientDashboardStats, getEvents } from "../controllers/event_controller.js";


const event_router = express.Router();


// ✅ Get events created by a specific client
event_router.get("/client/:clientId",getEvents);

// ✅ Add new event
event_router.post("/add", addEvent);

// ✅ Delete event by ID
event_router.delete("/:id", DeleteEvent);
event_router.get("/stats", getClientDashboardStats);


export default event_router;
