const userService = require("../services/userService");
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    
    if (req.body.dob) {
      user.dob = req.body.dob;
    } else if (req.body.dob === "") {
      user.dob = null;
    }

    user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    
    // Convert to object and omit password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSavedRecipes = async (req, res) => {
  try {
    const saved = await userService.getSavedRecipes(req.user.id);
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching saved recipes" });
  }
};

exports.toggleSaveRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await userService.toggleSavedRecipe(req.user.id, id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Error saving recipe" });
  }
};

exports.getMealPlan = async (req, res) => {
  try {
    const plan = await userService.getMealPlan(req.user.id);
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching meal plan" });
  }
};

exports.setMealPlan = async (req, res) => {
  try {
    const mealPlan = req.body;
    const updated = await userService.setMealPlan(req.user.id, mealPlan);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: err.message || "Error updating meal plan" });
  }
};
