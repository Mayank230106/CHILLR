// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../models/client.js";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check email uniqueness
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3. Create user
    const client = await Client.create({
      name,
      email,
      password: hash,
      role,
    });

    const token = createToken(user._id);
    res.status(201).json({
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: client.role,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const client = await Client.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token and respond
    const token = createToken(user._id);
    res.json({
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: client.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
