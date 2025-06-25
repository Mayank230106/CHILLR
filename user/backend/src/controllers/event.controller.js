import { Event } from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find(); // <-- No isPublished filter
  if(events.length === 0)
  {
    throw new ApiError(401, "No events found");
  }
  return res.status(200).json(new ApiResponse(200, events, "Events fetched"));
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, isPublished: true });
  if (!event) throw new ApiError(404, "Event not found");
  return res.status(200).json(new ApiResponse(200, event, "Event fetched"));
});


/*

export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isPublished: true });

  if(events.length === 0)
  {
    throw new ApiError(401, "No events found");
  }
  return res.status(200).json(new ApiResponse(200, events, "Events fetched"));
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, isPublished: true });
  if (!event) throw new ApiError(404, "Event not found");
  return res.status(200).json(new ApiResponse(200, event, "Event fetched"));
});

*/
