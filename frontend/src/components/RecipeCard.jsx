import React from 'react';
import { getImageUrl } from '../services/api';

function RecipeCard({ recipe, isSaved, onCardClick, onHeartClick }) {
  const handleHeartClick = (e) => {
    e.stopPropagation();
    onHeartClick(recipe.id);
  };

  return (
    <div className="recipe-card" onClick={() => onCardClick(recipe.id)}>
      <img
        src={getImageUrl(recipe.image)}
        alt={recipe.name}
        className="recipe-image"
        onError={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }}
      />
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.name}</h3>
        <div className="recipe-meta">
          <span>⏱️ {recipe.cookingTime} min</span>
          <span className="recipe-tag">{recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}</span>
          <span className="recipe-tag">{recipe.type.charAt(0).toUpperCase() + recipe.type.slice(1)}</span>
        </div>
        <button
          className={`heart-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleHeartClick}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;
