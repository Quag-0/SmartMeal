import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/api';
import './RecipeCard.css';

function RecipeCard({ recipe, isSaved, onCardClick, onHeartClick }) {
  const handleHeartClick = (e) => {
    e.stopPropagation();
    onHeartClick(recipe.id || recipe._id);
  };

  return (
    <div className="recipe-card" onClick={() => onCardClick(recipe.id || recipe._id)}>
      <div className="recipe-image-container">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.name}
          className="recipe-image"
          onError={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }}
        />
        <button
          className={`heart-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleHeartClick}
          aria-label={isSaved ? "Remove from saved" : "Save recipe"}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="heart-svg"
            fill={isSaved ? "var(--color-primary)" : "none"}
            stroke={isSaved ? "var(--color-primary)" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </button>
      </div>

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.name}</h3>
        <div className="recipe-meta">
          {recipe.averageRating > 0 && (
            <span className="rating-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontWeight: '500' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#666" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {recipe.averageRating.toFixed(1)}
            </span>
          )}
          <span className="cooking-time">
            <span className="clock-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="clock-svg">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            {recipe.cookingTime} min
          </span>
          {[
            ...new Set([
              recipe.category?.toLowerCase(),
              recipe.type?.toLowerCase()
            ].filter(tag => tag && tag !== 'non-vegetarian'))
          ].map(tag => (
            <span key={tag} className="recipe-tag">
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </span>
          ))}
        </div>
        
        {recipe.author && (
          <div className="recipe-author">
            <img 
              src={recipe.author.avatar ? getImageUrl(recipe.author.avatar) : 'https://via.placeholder.com/30'} 
              alt={recipe.author.username} 
              className="author-avatar" 
            />
            <span className="author-name">by {recipe.author.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
