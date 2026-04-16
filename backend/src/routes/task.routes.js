import express from "express";
import { 
    createTask, 
    getAllTasks, 
    getMemberTasks, 
    updateTask, 
    deleteTask 
} from "../controller/task.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin only: create a task
router.post("/", verifyToken, isAdmin, createTask);

// Admin only: delete a task
router.delete("/:id", verifyToken, isAdmin, deleteTask);

// Admin only: see all tasks
router.get("/all", verifyToken, isAdmin, getAllTasks);

// Member/Admin: get tasks assigned to user
router.get("/my", verifyToken, getMemberTasks);

// Member/Admin: update task (full or status)
router.put("/:id", verifyToken, updateTask);
router.patch("/:id/status", verifyToken, updateTask);

export default router;
