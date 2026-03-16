import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);
  const [customItem, setCustomItem] = useState({ name: '', quantity: '', category: 'vegetables' });

  const fetchList = async () => {
    try {
      const res = await api.get('/shopping-list');
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
      await api.post('/shopping-list', { items: newList });
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
        quantity: customItem.quantity.trim() || '1',
        category: customItem.category,
        purchased: false,
      };
      
      const res = await api.post('/shopping-list', { item: newItem });
      setShoppingList(res.data);
      setCustomItem({ ...customItem, name: '', quantity: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearPurchased = () => {
    const newList = shoppingList.filter(item => !item.purchased);
    updateList(newList);
  };

  const handleClearAll = () => {
    if (window.confirm("Clear entire shopping list?")) {
      updateList([]);
    }
  };

  const categories = {
    vegetables: '🥬 Vegetables',
    'meat-fish': '🥩 Meat & Fish',
    'dry-goods': '🧂 Dry Goods / Spices'
  };

  return (
    <main className="container">
      <div className="page-header">
        <h2>🛒 Shopping List</h2>
        <p>Your auto-generated ingredients list for the week</p>
      </div>

      <div className="shopping-actions">
        <button className="btn btn-secondary" onClick={handleClearPurchased}>✅ Clear Purchased</button>
        <button className="btn btn-secondary" onClick={handleClearAll}>🗑️ Clear All</button>
      </div>

      <div className="add-item-form">
        <input 
          type="text" 
          placeholder="Item name" 
          value={customItem.name}
          onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleAddItem()}
          className="input-small"
        />
        <input 
          type="text" 
          placeholder="Quantity" 
          value={customItem.quantity}
          onChange={e => setCustomItem({ ...customItem, quantity: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleAddItem()}
          className="input-small"
        />
        <select 
          value={customItem.category}
          onChange={e => setCustomItem({ ...customItem, category: e.target.value })}
          className="input-small"
        >
          <option value="vegetables">🥬 Vegetables</option>
          <option value="meat-fish">🥩 Meat & Fish</option>
          <option value="dry-goods">🧂 Dry Goods / Spices</option>
        </select>
        <button className="btn btn-primary" onClick={handleAddItem}>Add</button>
      </div>

      {!shoppingList.length ? (
        <div className="empty-state" style={{ display: 'block' }}>
          <p>📋 Your shopping list is empty.</p>
          <p>Generate a list from your meal planner or add items manually above.</p>
        </div>
      ) : (
        <div className="shopping-list-container">
          {Object.keys(categories).map(catKey => {
            const items = shoppingList.filter(item => item.category === catKey);
            return (
              <div key={catKey} className="category-section">
                <h3>{categories[catKey]}</h3>
                <div className="shopping-list-items">
                  {items.map((item, idx) => {
                    const trueIdx = shoppingList.indexOf(item);
                    return (
                      <div key={trueIdx} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={item.purchased} 
                          onChange={() => handleToggle(trueIdx)} 
                        />
                        <span className="shopping-item-name">{item.name}</span>
                        <span className="shopping-item-quantity">{item.quantity}</span>
                        <button className="delete-item-btn" onClick={() => handleDelete(trueIdx)}>Delete</button>
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
