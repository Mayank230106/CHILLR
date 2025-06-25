// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      default: "Online",
    },

    date: {
      type: Date,
      required: true,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },

    bannerImage: {
      type: String, // URL to event banner image
      default: "",
    },

    numberOfTickets: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ── NEW ── ticketsSold ──
    ticketsSold: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    eventType: {
      type: String,
      enum: [
        "conference",
        "workshop",
        "webinar",
        "meetup",
        "seminar",
        "networking",
        "hackathon",
        "competition",
        "concert",
        "festival",
        "movie",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
