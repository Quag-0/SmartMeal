import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import html2pdf from "html2pdf.js";
import "./Shopping.css";

function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);
  const [customItem, setCustomItem] = useState({
    name: "",
    quantity: "",
    category: "vegetables",
  });
  const listRef = useRef();

  const fetchList = async () => {
    try {
      const res = await api.get("/shopping-list");
      setShoppingList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const updateList = async (newList) => {
    try {
      await api.post("/shopping-list", { items: newList });
      setShoppingList(newList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (index) => {
    const newList = [...shoppingList];
    newList[index].purchased = !newList[index].purchased;
    updateList(newList);
  };

  const handleDelete = (index) => {
    const newList = shoppingList.filter((_, i) => i !== index);
    updateList(newList);
  };

  const handleAddItem = async () => {
    if (!customItem.name.trim()) return;
    try {
      const newItem = {
        name: customItem.name.trim(),
        quantity: customItem.quantity.trim() || "1",
        category: customItem.category,
        purchased: false,
      };

      const res = await api.post("/shopping-list", { item: newItem });
      setShoppingList(res.data);
      setCustomItem({ ...customItem, name: "", quantity: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearPurchased = () => {
    const newList = shoppingList.filter((item) => !item.purchased);
    updateList(newList);
  };

  const handleClearAll = () => {
    if (window.confirm("Clear entire shopping list?")) {
      updateList([]);
    }
  };

  const handleExportPDF = () => {
    if (!listRef.current) return;
    const opt = {
      margin:       0.5,
      filename:     'shopping-list.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(listRef.current).save();
  };

  const categories = {
    vegetables: "🥬 Vegetables",
    fruits: "🍎 Fruits",
    "meat-fish": "🥩 Meat & Seafood",
    "dairy-eggs": "🥚 Dairy & Eggs",
    bakery: "🍞 Bakery",
    "dry-goods": "🧂 Pantry & Spices",
    frozen: "🧊 Frozen Foods",
    beverages: "🧃 Beverages",
    others: "🛒 Others",
  };

  return (
    <main className="container">
      <div className="page-header">
        <h2> Shopping List</h2>
        <p>Your auto-generated ingredients list for the week</p>
      </div>

      <div className="shopping-actions">
        <button className="btn btn-secondary" onClick={handleExportPDF}>
          Export to PDF
        </button>
        <button className="btn btn-secondary" onClick={handleClearPurchased}>
          Clear Purchased
        </button>
        <button className="btn btn-secondary" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      <div className="add-item-form">
        <input
          type="text"
          placeholder="Item name"
          value={customItem.name}
          onChange={(e) =>
            setCustomItem({ ...customItem, name: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="input-small"
        />
        <input
          type="text"
          placeholder="Quantity"
          value={customItem.quantity}
          onChange={(e) =>
            setCustomItem({ ...customItem, quantity: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="input-small"
        />
        <select
          value={customItem.category}
          onChange={(e) =>
            setCustomItem({ ...customItem, category: e.target.value })
          }
          className="input-small"
        >
          <option value="vegetables">🥬 Vegetables</option>
          <option value="fruits">🍎 Fruits</option>
          <option value="meat-fish">🥩 Meat & Seafood</option>
          <option value="dairy-eggs">🥚 Dairy & Eggs</option>
          <option value="bakery">🍞 Bakery</option>
          <option value="dry-goods">🧂 Pantry & Spices</option>
          <option value="frozen">🧊 Frozen Foods</option>
          <option value="beverages">🧃 Beverages</option>
          <option value="others">🛒 Others</option>
        </select>
        <button className="btn btn-primary" onClick={handleAddItem}>
          Add
        </button>
      </div>

      {!shoppingList.length ? (
        <div className="empty-state" style={{ display: "block" }}>
          <p> Your shopping list is empty.</p>
          <p>
            Generate a list from your meal planner or add items manually above.
          </p>
        </div>
      ) : (
        <div className="shopping-list-container" ref={listRef}>
          {Object.keys(categories).map((catKey) => {
            const items = shoppingList.filter(
              (item) => item.category === catKey,
            );
            if (items.length === 0) return null;
            
            return (
              <div key={catKey} className="category-section">
                <h3>{categories[catKey]}</h3>
                <div className="shopping-list-items">
                  {items.map((item, idx) => {
                    const trueIdx = shoppingList.indexOf(item);
                    return (
                      <div
                        key={trueIdx}
                        className={`shopping-item ${item.purchased ? "purchased" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={() => handleToggle(trueIdx)}
                        />
                        <span className="shopping-item-name">{item.name}</span>
                        <span className="shopping-item-quantity">
                          {item.quantity}
                        </span>
                        <button
                          className="delete-item-btn"
                          onClick={() => handleDelete(trueIdx)}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Shopping;
