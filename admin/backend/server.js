// server.js
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import Db_connection from "./features/Db_connection.js";
import client_router from "./routes/Client_Routes.js";
import event_router from "./routes/Event_Routes.js";

dotenv.config();
await Db_connection();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for your frontend (http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // set to true if using cookies/sessions
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Mount routes
app.use("/clients", client_router);
app.use("/events", event_router);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
