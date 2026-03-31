const Recipe = require("../models/Recipe");
const User = require("../models/User");
const ShoppingList = require("../models/ShoppingList");
const Review = require("../models/Review");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const [totalRecipes, totalUsers, totalShoppingLists] = await Promise.all([
      Recipe.countDocuments(),
      User.countDocuments(),
      ShoppingList.countDocuments(),
    ]);

    res.json({
      totalRecipes,
      totalUsers,
      totalShoppingLists,
      totalReviews,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username email avatar")
      .populate("recipe", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    res.status(500).json({ message: "Error fetching all reviews" });
  }
};
