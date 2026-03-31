const Review = require("../models/Review");
const Recipe = require("../models/Recipe");

exports.addReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;
    const userId = req.user._id;

    // Optional: Check if user already reviewed
    const existingReview = await Review.findOne({ recipe: recipeId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this recipe" });
    }

    const review = new Review({
      recipe: recipeId,
      user: userId,
      rating,
      comment
    });

    await review.save();

    // Update Recipe stats
    const recipe = await Recipe.findById(recipeId);
    if (recipe) {
      const totalRating = recipe.averageRating * recipe.numReviews + rating;
      recipe.numReviews += 1;
      recipe.averageRating = totalRating / recipe.numReviews;
      await recipe.save();
    }

    res.status(201).json(review);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.getReviewsByRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only author or admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const recipeId = review.recipe;
    const rating = review.rating;

    await Review.findByIdAndDelete(req.params.id);

    // Update Recipe stats
    const recipe = await Recipe.findById(recipeId);
    if (recipe && recipe.numReviews > 0) {
      if (recipe.numReviews === 1) {
        recipe.numReviews = 0;
        recipe.averageRating = 0;
      } else {
        const totalRating = recipe.averageRating * recipe.numReviews - rating;
        recipe.numReviews -= 1;
        recipe.averageRating = totalRating / recipe.numReviews;
      }
      await recipe.save();
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
