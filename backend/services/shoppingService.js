const ShoppingList = require("../models/ShoppingList");

async function getShoppingList(userId) {
  let list = await ShoppingList.findOne({ user: userId });
  if (!list) {
    list = await ShoppingList.create({ items: [], user: userId });
  }
  return list.items;
}

// Accepts either { items: [...] } to replace entire list
// or { item: {...} } to append a single item
async function postShoppingList(userId, payload) {
  let list = await ShoppingList.findOne({ user: userId });
  if (!list) list = await ShoppingList.create({ items: [], user: userId });

  if (payload.items) {
    list.items = payload.items;
  } else if (payload.item) {
    list.items.push(payload.item);
  }
  await list.save();
  return list.items;
}

module.exports = { getShoppingList, postShoppingList };
