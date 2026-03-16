const express = require("express");
const router = express.Router();
const shoppingController = require("../controllers/shoppingController");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/shopping-list
router.get("/", protect, shoppingController.getList);
// POST /api/shopping-list
router.post("/", protect, shoppingController.postList);

module.exports = router;
