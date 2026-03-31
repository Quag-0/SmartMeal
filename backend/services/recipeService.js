const Recipe = require("../models/Recipe");

async function getAllRecipes() {
  return Recipe.find()
    .populate("author", "username avatar")
    .lean();
}

async function createRecipe(recipeData) {
  // Auto-generate numeric id for legacy system compatibility
  const lastRecipe = await Recipe.findOne().sort({ id: -1 });
  const nextId = lastRecipe && lastRecipe.id ? lastRecipe.id + 1 : 1;
  
  const newRecipe = new Recipe({
    ...recipeData,
    id: nextId
  });
  return newRecipe.save();
}

async function updateRecipe(id, recipeData) {
  return Recipe.findByIdAndUpdate(id, recipeData, { new: true });
}

async function deleteRecipe(id) {
  return Recipe.findByIdAndDelete(id);
}

async function searchRecipes(query) {
  return Recipe.find({ name: { $regex: query, $options: "i" } })
    .limit(10)
    .populate("author", "username avatar")
    .select("name id author averageRating numReviews")
    .lean();
}

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes
};
