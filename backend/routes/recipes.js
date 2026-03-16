const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// GET /api/recipes
router.get("/", recipeController.getAll);

// Admin Routes
router.post("/", protect, admin, upload.single("image"), recipeController.createRecipe);
router.put("/:id", protect, admin, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", protect, admin, recipeController.deleteRecipe);

module.exports = router;
