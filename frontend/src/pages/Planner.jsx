import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RecipeModal from '../components/RecipeModal';
import './Planner.css';

function Planner() {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, savedRes, planRes] = await Promise.all([
          api.get('/recipes'),
          api.get('/user/saved-recipes'),
          api.get('/user/meal-plan'),
        ]);
        setRecipes(recipesRes.data);
        if (Array.isArray(savedRes.data)) setSavedRecipes(savedRes.data.map(r => r.id));
        setMealPlan(planRes.data || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const updateMealPlan = async (newPlan) => {
    try {
      const res = await api.post('/user/meal-plan', newPlan);
      setMealPlan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, recipeId, sourceSlotKey = null) => {
    e.dataTransfer.setData('recipeId', recipeId);
    if (sourceSlotKey) {
      e.dataTransfer.setData('sourceSlotKey', sourceSlotKey);
    }
  };

  const handleDrop = (e, slotKey) => {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData('recipeId');
    const sourceSlotKey = e.dataTransfer.getData('sourceSlotKey');
    if (recipeId) {
      const newPlan = { ...mealPlan, [slotKey]: { recipeId: parseInt(recipeId, 10) } };
      if (sourceSlotKey && sourceSlotKey !== slotKey) {
        delete newPlan[sourceSlotKey];
      }
      updateMealPlan(newPlan);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveMeal = (slotKey) => {
    const newPlan = { ...mealPlan };
    delete newPlan[slotKey];
    updateMealPlan(newPlan);
  };

  const handleClearWeek = () => {
    if (window.confirm("Clear entire weekly meal plan?")) {
      updateMealPlan({});
    }
  };

  const handleGenerateList = async () => {
    let allIngredients = [];
    Object.values(mealPlan).forEach(slot => {
      const recipe = recipes.find(r => r.id === slot.recipeId);
      if (recipe?.ingredients) allIngredients = allIngredients.concat(recipe.ingredients);
    });

    const mergedIngredients = allIngredients.reduce((acc, ingredient) => {
      const existing = acc.find(item => item.name.toLowerCase() === ingredient.name.toLowerCase());
      if (!existing) {
        acc.push({ ...ingredient, purchased: false });
      } else {
        const match1 = String(existing.quantity).match(/^([\d.]+)\s*(.*)$/);
        const match2 = String(ingredient.quantity).match(/^([\d.]+)\s*(.*)$/);
        
        if (match1 && match2 && match1[2].toLowerCase() === match2[2].toLowerCase()) {
           const sum = parseFloat(match1[1]) + parseFloat(match2[1]);
           // Format to remove trailing zeros (e.g., 2 instead of 2.0)
           existing.quantity = `${Number(sum.toFixed(2))} ${match1[2]}`.trim();
        } else {
           existing.quantity = `${existing.quantity} + ${ingredient.quantity}`;
        }
      }
      return acc;
    }, []);

    try {
      await api.post('/shopping-list', { items: mergedIngredients });
      navigate('/shopping');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <h2>📅 Weekly Meal Planner</h2>
        <p>Drag and drop recipes to plan your week</p>
      </div>

      <div className="planner-actions">
        <button className="btn btn-secondary" onClick={handleClearWeek}>🗑️ Clear Week</button>
        <button className="btn btn-primary" onClick={handleGenerateList}>🛒 Generate Shopping List</button>
      </div>

      <div className="planner-layout">
        <aside className="recipe-sidebar">
          <h3>💝 Saved Recipes</h3>
          <div className="saved-recipes-list">
            {savedRecipes.length === 0 ? (
              <p className="no-saved-msg">No saved recipes yet. <Link to="/">Browse recipes</Link></p>
            ) : (
              recipes.filter(r => savedRecipes.includes(r.id)).map(recipe => (
                <div 
                  key={recipe.id} 
                  className="sidebar-recipe-item"
                  draggable 
                  onDragStart={(e) => handleDragStart(e, recipe.id)}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <h4>{recipe.name}</h4>
                  <p>⏱️ {recipe.cookingTime} min • {recipe.category}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        <div className="planner-grid">
          {days.map(day => (
            <div key={day} className="day-column">
              <div className="day-header">{day}</div>
              {mealTypes.map(mealType => {
                const slotKey = `${day}-${mealType}`;
                const slotData = mealPlan[slotKey];
                const recipe = slotData ? recipes.find(r => r.id === slotData.recipeId) : null;

                return (
                  <div 
                    key={slotKey} 
                    className="meal-slot"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slotKey)}
                  >
                    <div className="meal-slot-label">{mealType}</div>
                    {slotData ? (
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStart(e, slotData.recipeId, slotKey)}
                        className="draggable-recipe-slot"
                      >
                        <h4>{recipe ? recipe.name : "Not found"}</h4>
                        <button className="remove-btn" onClick={() => handleRemoveMeal(slotKey)}>Remove</button>
                      </div>
                    ) : (
                      <p style={{ color: '#999', fontSize: '0.9rem' }}>Drag recipe here</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <RecipeModal 
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </main>
  );
}

export default Planner;
