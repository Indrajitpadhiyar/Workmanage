import express from "express";
import { register, login, logout, getAllUsers, getUserById, getProfile, updateProfile, uploadAvatar, updateUserByAdmin } from "../controller/auth.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/users/:id", verifyToken, isAdmin, getUserById);
router.put("/users/:id", verifyToken, isAdmin, updateUserByAdmin);

// Profile routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/profile/avatar", verifyToken, upload.single("avatar"), uploadAvatar);

export default router;
