const Recipe = require("../models/Recipe");

async function getAllRecipes() {
  return Recipe.find().lean();
}

async function createRecipe(recipeData) {
  const newRecipe = new Recipe(recipeData);
  return newRecipe.save();
}

async function updateRecipe(id, recipeData) {
  return Recipe.findByIdAndUpdate(id, recipeData, { new: true });
}

async function deleteRecipe(id) {
  return Recipe.findByIdAndDelete(id);
}

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
