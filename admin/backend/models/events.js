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
      ref: "User", // assuming you have a User model
      required: true,
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
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
