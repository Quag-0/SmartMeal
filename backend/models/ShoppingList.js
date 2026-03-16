const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
  purchased: { type: Boolean, default: false },
});

const ShoppingListSchema = new mongoose.Schema(
  {
    items: [ItemSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
