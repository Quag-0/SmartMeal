import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [recipesRes, savedRes] = await Promise.all([
          api.get('/recipes'),
          currentUser ? api.get('/user/saved-recipes') : Promise.resolve({ data: [] }),
        ]);
        setRecipes(recipesRes.data);
        if (currentUser && Array.isArray(savedRes.data)) {
          setSavedRecipeIds(savedRes.data.map((r) => r.id));
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      }
    };
    fetchInitialData();
  }, [currentUser]);

  const handleHeartClick = async (recipeId) => {
    if (!currentUser) return alert('Please log in to save recipes');
    try {
      const res = await api.post(`/user/save-recipe/${recipeId}`);
      if (Array.isArray(res.data)) {
        setSavedRecipeIds(res.data.map((r) => r.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'vegetarian' && recipe.category === 'vegetarian') ||
      (currentFilter === 'quick' && recipe.cookingTime <= 30) ||
      (currentFilter === 'asian' && recipe.type === 'asian') ||
      (currentFilter === 'western' && recipe.type === 'western');
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="container">
      <div className="page-header">
        <h2>🍳 Discover Recipes</h2>
        <p>Find your favorite meals and save them for planning</p>
      </div>

      <div className="search-filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes..."
          className="search-bar"
        />
        <div className="filters">
          {[
            { id: 'all', label: 'All' },
            { id: 'vegetarian', label: '🥬 Vegetarian' },
            { id: 'quick', label: '⚡ Under 30 min' },
            { id: 'asian', label: '🍜 Asian' },
            { id: 'western', label: '🍔 Western' },
          ].map((btn) => (
            <button
              key={btn.id}
              className={`filter-btn ${currentFilter === btn.id ? 'active' : ''}`}
              onClick={() => setCurrentFilter(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-grid">
        {filteredRecipes.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', fontSize: '1.2rem' }}>
            No recipes found.
          </p>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onCardClick={(id) => setSelectedRecipe(recipes.find((r) => r.id === id))}
              onHeartClick={handleHeartClick}
            />
          ))
        )}
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </main>
  );
}

export default Home;
