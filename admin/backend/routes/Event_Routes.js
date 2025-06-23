import express from "express";
import {
    addEvent,
    DeleteEvent,
    getEvents
} from "../controllers/event_controller.js";

const event_router = express.Router();

// GET all events
event_router.get("/", getEvents);

// GET event by ID

event_router.post("/add", addEvent);

// DELETE event by ID
event_router.delete("/:id", DeleteEvent);

export default event_router;
