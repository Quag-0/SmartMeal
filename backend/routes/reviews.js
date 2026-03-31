const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:recipeId", reviewController.getReviewsByRecipe);
router.post("/", protect, reviewController.addReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
