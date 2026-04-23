import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://workmanage-33e9.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some(
        (o) => o.toLowerCase() === origin.toLowerCase(),
      );

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
