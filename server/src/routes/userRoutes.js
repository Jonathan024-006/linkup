const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile, getAllUsers, getUserById  } = require("../controllers/userController");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

module.exports = router;