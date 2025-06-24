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
      ref: "User",
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
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);