import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    remarks: {
        type: String,
        default: ""
    }
}, { timestamps: true, collection: "tasks" })

export const Task = mongoose.model("Task", TaskSchema);