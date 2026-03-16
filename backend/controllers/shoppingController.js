const shoppingService = require("../services/shoppingService");

exports.getList = async (req, res) => {
  try {
    const items = await shoppingService.getShoppingList(req.user.id);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shopping list" });
  }
};

exports.postList = async (req, res) => {
  try {
    const payload = req.body;
    const updated = await shoppingService.postShoppingList(req.user.id, payload);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: err.message || "Error updating shopping list" });
  }
};
