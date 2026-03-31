import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const heroImage = 'https://image.qwenlm.ai/public_source/65c45fb4-ba4b-474d-b629-f7c7c4702bbf/12120b360-4eaa-492f-bb2f-1ae8f7bae50a.png';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterDropdown = ({ label, icon, options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${selectedValue ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {icon && <span className="filter-icon">{icon}</span>}
        {selectedValue || label}
        <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="filter-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={`filter-option ${!selectedValue ? 'selected' : ''}`}
              onClick={() => { onChange(null); setIsOpen(false); }}
            >
              All {label}
            </div>
            {options.map((opt) => (
              <div 
                key={opt}
                className={`filter-option ${selectedValue === opt ? 'selected' : ''}`}
                onClick={() => { onChange(opt); setIsOpen(false); }}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Home() {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    time: null,
    category: null,
    type: null,
    sort: null
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/recipes/search?q=${searchTerm}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [recipesRes, savedRes] = await Promise.all([
          api.get('/recipes'),
          currentUser ? api.get('/user/saved-recipes') : Promise.resolve({ data: [] }),
        ]);
        setRecipes(recipesRes.data);
        if (currentUser && Array.isArray(savedRes.data)) {
          setSavedRecipeIds(savedRes.data.map((r) => r.id || r._id));
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
        setSavedRecipeIds(res.data.map((r) => r.id || r._id));
        updateCurrentUser({ savedRecipes: res.data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  let result = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTime = !filters.time || 
      (filters.time === 'Under 30 min' && recipe.cookingTime <= 30) ||
      (filters.time === 'Over 30 min' && recipe.cookingTime > 30);
      
    const matchesCategory = !filters.category || 
      (recipe.category && recipe.category.toLowerCase() === filters.category.toLowerCase()) ||
      (recipe.type && recipe.type.toLowerCase() === filters.category.toLowerCase());
      
    const matchesType = !filters.type || 
      (recipe.type && recipe.type.toLowerCase() === filters.type.toLowerCase()) ||
      (recipe.category && recipe.category.toLowerCase() === filters.type.toLowerCase());

    return matchesSearch && matchesTime && matchesCategory && matchesType;
  });

  if (filters.sort === 'Most star') {
    result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  } else if (filters.sort === 'Most comment') {
    result.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
  } else if (filters.sort === 'Newest') {
    result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  const filteredRecipes = result;

  const categoryOptions = ['Asian', 'Western', 'Italian', 'Vietnamese', 'Healthy', 'Breakfast', 'Dessert'];
  const typeOptions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Chicken', 'Beef', 'Seafood'];


  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-background">
          <img src={heroImage} alt="Hero Banner" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            🍳 Discover Recipes
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Find your favorite meals and save them for planning
          </motion.p>
        </div>
      </motion.section>

      <main className="main-content container">
        {/* Search & Filters */}
        <motion.div
          className="search-filters"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="search-container">
            <div className="search-wrapper">
              <SearchIcon />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search recipes..."
                className="search-bar"
              />
            </div>
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  className="suggestions-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {suggestions.map((s) => (
                    <motion.div
                      key={s.id || s._id}
                      className="suggestion-item"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setSearchTerm(s.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <span>{s.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="filters">
            <FilterDropdown 
              label="Time" 
              icon="⏱️"
              options={['Under 30 min', 'Over 30 min']} 
              selectedValue={filters.time} 
              onChange={(val) => setFilters({ ...filters, time: val })} 
            />
            <FilterDropdown 
              label="Category" 
              icon="🥗"
              options={categoryOptions} 
              selectedValue={filters.category} 
              onChange={(val) => setFilters({ ...filters, category: val })} 
            />
            <FilterDropdown 
              label="Type" 
              icon="🍜"
              options={typeOptions} 
              selectedValue={filters.type} 
              onChange={(val) => setFilters({ ...filters, type: val })} 
            />
            <FilterDropdown 
              label="Sort By" 
              icon="⭐"
              options={['Most star', 'Most comment', 'Newest']} 
              selectedValue={filters.sort} 
              onChange={(val) => setFilters({ ...filters, sort: val })} 
            />
          </div>
        </motion.div>

        {/* Recipe Grid */}
        <div className="recipe-grid">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.length === 0 ? (
              <motion.p
                style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', fontSize: '1.2rem', padding: '40px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No recipes found.
              </motion.p>
            ) : (
              filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id || recipe._id}
                  recipe={recipe}
                  isSaved={savedRecipeIds.includes(recipe.id || recipe._id)}
                  onCardClick={(id) => setSelectedRecipe(recipes.find((r) => (r.id || r._id) === id))}
                  onHeartClick={handleHeartClick}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}

export default Home;
