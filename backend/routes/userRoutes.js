import express from "express";
import {
  authUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserProfile,
  registerUser,
  updateUserProfile,
  updateUserProfileById,
} from "./../controllers/userController.js";
import protect from "./../middleware/authMiddleware.js";

const router = express.Router();
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/login", authUsers);
router.delete("/:id", protect, deleteUserById);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUserProfileById);
router.post("/", registerUser);
router.get("/", protect, getAllUsers);

export default router;
