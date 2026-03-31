const User = require("../models/User");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

// Removed getOrCreateUser as we now rely on the authenticated user context

async function getSavedRecipes(userId) {
  const user = await User.findById(userId);
  await user.populate({
    path: "savedRecipes",
    populate: { path: "author", select: "username avatar" }
  });
  return user.savedRecipes;
}

async function toggleSavedRecipe(userId, recipeIdentifier) {
  const user = await User.findById(userId);

  // find recipe by numeric `id` field or by ObjectId
  let recipe = null;
  if (mongoose.Types.ObjectId.isValid(recipeIdentifier)) {
    recipe = await Recipe.findById(recipeIdentifier);
  }
  if (!recipe) {
    recipe = await Recipe.findOne({ id: Number(recipeIdentifier) });
  }
  if (!recipe) throw new Error("Recipe not found");

  const idx = user.savedRecipes.findIndex(
    (r) => String(r) === String(recipe._id),
  );
  if (idx === -1) {
    user.savedRecipes.push(recipe._id);
  } else {
    user.savedRecipes.splice(idx, 1);
  }
  await user.save();
  await user.populate({
    path: "savedRecipes",
    populate: { path: "author", select: "username avatar" }
  });
  return user.savedRecipes;
}

async function getMealPlan(userId) {
  const user = await User.findById(userId);
  return user.mealPlan || {};
}

async function setMealPlan(userId, mealPlanObj) {
  const user = await User.findById(userId);
  user.mealPlan = mealPlanObj || {};
  await user.save();
  return user.mealPlan;
}

module.exports = {
  getSavedRecipes,
  toggleSavedRecipe,
  getMealPlan,
  setMealPlan,
};
