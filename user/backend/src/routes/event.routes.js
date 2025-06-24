import { Router } from "express";
import { getAllEvents, getEventById } from "../controllers/event.controller.js";

const event_router = Router();

event_router.get("/listed", getAllEvents);
event_router.get("/:id", getEventById);

export default event_router;
