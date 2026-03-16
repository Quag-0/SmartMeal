const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Profile
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, upload.single("avatar"), userController.updateUserProfile);

// Saved recipes
router.get("/saved-recipes", protect, userController.getSavedRecipes);
router.post("/save-recipe/:id", protect, userController.toggleSaveRecipe);

// Meal plan
router.get("/meal-plan", protect, userController.getMealPlan);
router.post("/meal-plan", protect, userController.setMealPlan);

module.exports = router;
