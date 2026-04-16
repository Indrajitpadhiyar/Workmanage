import { Task } from "../model/task.model.js";
import { User } from "../model/User.model.js";
import { Notification } from "../model/notification.model.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, assignee } = req.body;

        // Verify assignee exists if provided
        if (assignee) {
            const user = await User.findById(assignee);
            if (!user) {
                return res.status(404).json({ message: "Assignee user not found" });
            }
        }

        const newTask = new Task({
            title,
            description,
            assignee,
            status: "pending"
        });

        await newTask.save();

        // Create notification for assignee
        if (assignee) {
            const notification = new Notification({
                recipient: assignee,
                title: "New Task Assigned",
                message: `You have been assigned a new task: ${title}`,
                type: "task_assigned"
            });
            await notification.save();
        }

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Task creation failed", error: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        // Populate assignee details
        const tasks = await Task.find().populate("assignee", "name email role");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

export const getMemberTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignee: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user tasks", error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, remarks, assignee } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // --- Permissions ---
        const isAdminUser = req.user.role === "admin";
        const isAssignee = task.assignee?.toString() === req.user.id;

        if (!isAdminUser && !isAssignee) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        // --- Selective Updates ---
        // Members can ONLY update status and remarks
        if (!isAdminUser) {
            if (status !== undefined) {
                if (!["pending", "in-progress", "completed"].includes(status)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }
                task.status = status;
            }
            if (remarks !== undefined) task.remarks = remarks;
        } 
        
        // Admins can update EVERYTHING
        else {
            if (title) task.title = title;
            if (description) task.description = description;
            if (status) {
                if (!["pending", "in-progress", "completed"].includes(status)) {
                    return res.status(400).json({ message: "Invalid status" });
                }
                task.status = status;
            }
            if (remarks !== undefined) task.remarks = remarks;

            // Handle Assignee Change
            if (assignee !== undefined && assignee !== task.assignee?.toString()) {
                // Verify new assignee exists
                if (assignee) {
                    const user = await User.findById(assignee);
                    if (!user) return res.status(404).json({ message: "New assignee not found" });
                    
                    // Create notification for NEW assignee
                    const notification = new Notification({
                        recipient: assignee,
                        title: "Task Reassigned to You",
                        message: `Task "${task.title}" has been reassigned to you.`,
                        type: "task_assigned"
                    });
                    await notification.save();
                }
                task.assignee = assignee || null;
            }
        }

        await task.save();
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};
