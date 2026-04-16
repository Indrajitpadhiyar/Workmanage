import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import dns from "dns";
import cors from "cors";

dns.setServers(['8.8.8.8', '8.8.4.4']);

import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
