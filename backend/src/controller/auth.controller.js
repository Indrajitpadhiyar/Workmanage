import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role, designation, adminKey } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check for admin special key if role is admin
        if (role === "admin") {
            if (!adminKey || adminKey !== process.env.ADMIN_SPECIAL_KEY) {
                return res.status(403).json({ message: "Invalid Admin Special Key" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "member",
            designation: designation || ""
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            message: "Login successful",
            token, // Keep sending token in body for backward compatibility
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                designation: user.designation,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });
    res.status(200).json({ message: "Logout successful" });
};
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, designation, githubUsername } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (designation !== undefined) user.designation = designation;
        if (githubUsername !== undefined) user.githubUsername = githubUsername;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, designation: user.designation, githubUsername: user.githubUsername } });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Store the Cloudinary secure URL
        user.avatar = req.file.path;
        await user.save();

        res.status(200).json({ message: "Avatar uploaded successfully", avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload avatar", error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "name email role avatar designation");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
};

export const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, designation } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (designation !== undefined) user.designation = designation;

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};
