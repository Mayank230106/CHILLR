// models/Client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      trim: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "prospect", "archived"],
      default: "prospect",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
