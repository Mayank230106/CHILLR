import dotenv from 'dotenv'

import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

import { app } from './app.js';
import eventRoutes from "./routes/event.routes.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.error("Error: ", err);
})

app.use("/api/v1/events", eventRoutes);
