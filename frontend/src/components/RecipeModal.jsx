import React, { useEffect } from 'react';
import { getImageUrl } from '../services/api';

function RecipeModal({ recipe, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <div className="modal-left">
            <img src={getImageUrl(recipe.image)} alt="Recipe" className="modal-image" />
          </div>
          <div className="modal-right">
            <h2 className="modal-title">{recipe.name}</h2>
            <div className="modal-meta">
              <span>⏱️ {recipe.cookingTime} min</span>
              <span className="recipe-tag">{recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}</span>
              <span className="recipe-tag">{recipe.type.charAt(0).toUpperCase() + recipe.type.slice(1)}</span>
            </div>

            <div className="modal-section">
              <h3>🥘 Ingredients</h3>
              <ul className="modal-ingredients">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    <span>{ing.name}</span>
                    <span>{ing.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>📋 Instructions</h3>
              <ol className="modal-instructions">
                {recipe.instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;
