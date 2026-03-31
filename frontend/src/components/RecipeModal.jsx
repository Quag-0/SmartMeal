import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { getImageUrl, api } from '../services/api';
import './RecipeModal.css';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);


function RecipeModal({ recipe, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser, updateCurrentUser } = useContext(AuthContext);

  const isSaved = currentUser?.savedRecipes?.some(
    (item) => {
      if (!item) return false;
      const itemId = typeof item === 'object' ? item._id : item;
      return String(itemId) === String(recipe?._id);
    }
  );

  const handleToggleSave = async () => {
    if (!currentUser) {
      setErrorMsg("Please log in to save recipes.");
      return;
    }
    try {
      const response = await api.post(`/user/save-recipe/${recipe._id}`);
      updateCurrentUser({ savedRecipes: response.data });
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/${recipe._id}`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      fetchReviews();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, recipe]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/reviews", {
        recipeId: recipe._id,
        rating,
        comment
      });
      setReviews([response.data, ...reviews]);
      setComment("");
      setRating(5);
      // Optional: Update recipe stats locally or re-fetch
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("Not authorized") || msg.includes("no token")) {
        setErrorMsg("Please log in to post a review.");
      } else {
        setErrorMsg(msg || "Failed to post review.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <motion.button 
          className="modal-close" 
          onClick={onClose}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <CloseIcon />
        </motion.button>
        <div className="modal-content">
          <div className="modal-header">
            <img src={getImageUrl(recipe.image)} alt={recipe.name} className="modal-image" />
          </div>
          
          <div className="modal-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>{recipe.name}</h2>
              {currentUser && (
                <button 
                  onClick={handleToggleSave} 
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "var(--color-primary)" : "none"} stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                  </svg>
                  {isSaved ? "Saved" : "Save"}
                </button>
              )}
            </div>
            
            {recipe.author && (
              <div className="modal-author">
                <img 
                  src={recipe.author.avatar ? getImageUrl(recipe.author.avatar) : 'https://via.placeholder.com/30'} 
                  alt={recipe.author.username} 
                  className="author-avatar" 
                />
                <span className="author-name">Shared by <strong>{recipe.author.username}</strong></span>
              </div>
            )}

            <div className="modal-meta">
              {recipe.averageRating > 0 && (
                <span className="rating-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#666', border: 'none', padding: 0 }}>
                  <svg viewBox="0 0 24 24" fill="#666" width="18" height="18">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {recipe.averageRating.toFixed(1)} ({recipe.numReviews} reviews)
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontWeight: '500' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ color: 'var(--color-secondary)' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
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

            <div className="modal-section reviews-section">
              <h3>⭐ Reviews ({reviews.length})</h3>
              
              {errorMsg && (
                <div style={{ color: '#e53e3e', background: '#fff0f0', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️</span> {errorMsg}
                </div>
              )}

              <form className="review-form" onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={star <= rating ? "star filled" : "star"}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea 
                  placeholder="Share your thoughts on this recipe..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Posting..." : "Post Review"}
                </button>
              </form>

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to try it!</p>
                ) : (
                  reviews.map((rev) => (
                    <div className="review-item" key={rev._id}>
                      <div className="review-header">
                        <img 
                          src={rev.user.avatar ? getImageUrl(rev.user.avatar) : 'https://via.placeholder.com/24'} 
                          alt={rev.user.username} 
                          className="review-avatar" 
                        />
                        <span className="review-user">{rev.user.username}</span>
                        <div className="review-rating">
                          {Array(rev.rating).fill("★").join("")}
                        </div>
                      </div>
                      <p className="review-comment">{rev.comment}</p>
                      <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;
