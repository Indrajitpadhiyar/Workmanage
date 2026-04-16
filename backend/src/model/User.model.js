import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    },
    avatar: {
        type: String,
        default: ""
    },
    designation: {
        type: String,
        default: ""
    },
    githubUsername: {
        type: String,
        default: ""
    }
}, { timestamps: true, collection: "users" })

export const User = mongoose.model("User", UserSchema);