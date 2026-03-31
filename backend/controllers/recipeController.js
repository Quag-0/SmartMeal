const recipeService = require("../services/recipeService");

exports.getAll = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipeData = { ...req.body };
    if (req.file) {
      recipeData.image = `/uploads/${req.file.filename}`;
    }
    // Parse JSON strings back to arrays/objects if sent via FormData
    if (typeof recipeData.ingredients === 'string') recipeData.ingredients = JSON.parse(recipeData.ingredients);
    if (typeof recipeData.instructions === 'string') recipeData.instructions = JSON.parse(recipeData.instructions);

    if (req.user) {
      recipeData.author = req.user.id;
    }

    const newRecipe = await recipeService.createRecipe(recipeData);
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Full error creating recipe:", err);
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipeData = { ...req.body };
    if (req.file) {
      recipeData.image = `/uploads/${req.file.filename}`;
    }
    if (typeof recipeData.ingredients === 'string') recipeData.ingredients = JSON.parse(recipeData.ingredients);
    if (typeof recipeData.instructions === 'string') recipeData.instructions = JSON.parse(recipeData.instructions);
    
    const updatedRecipe = await recipeService.updateRecipe(req.params.id, recipeData);
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    
    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await recipeService.deleteRecipe(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const suggestions = await recipeService.searchRecipes(q);
    res.json(suggestions);
  } catch (err) {
    console.error("Error searching recipes:", err);
    res.status(500).json({ message: "Error searching recipes" });
  }
};
