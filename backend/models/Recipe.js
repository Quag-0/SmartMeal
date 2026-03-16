const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
});

const RecipeSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String },
    cookingTime: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: [IngredientSchema],
    instructions: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", RecipeSchema);
