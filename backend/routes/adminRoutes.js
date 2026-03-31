const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET /api/admin/stats
router.get("/stats", protect, admin, adminController.getDashboardStats);

// GET /api/admin/reviews
router.get("/reviews", protect, admin, adminController.getAllReviews);

module.exports = router;
