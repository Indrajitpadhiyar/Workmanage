import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/mark-all", verifyToken, markAllAsRead);
router.put("/:id/read", verifyToken, markAsRead);

export default router;
