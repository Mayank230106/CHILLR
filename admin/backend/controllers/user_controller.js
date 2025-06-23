import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../models/client.js";

// Token generator
const createToken = (clientId) => {
  return jwt.sign({ id: clientId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// ✅ Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check uniqueness
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create client
    const client = await Client.create({ name, email, password: hash });

    // Generate token
    const token = createToken(client._id);

    res.status(201).json({
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find client and include password hash
    const client = await Client.findOne({ email }).select("+password");
    if (!client) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(client._id);
    res.json({
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout Controller (stateless)
export const logout = (req, res) => {
  res.clearCookie('token'); // optional if using cookies
  return res.json({ message: "Logged out successfully" });
};
