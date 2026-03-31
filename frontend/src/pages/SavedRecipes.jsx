import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import { AuthContext } from "../context/AuthContext";

function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateCurrentUser } = useContext(AuthContext);

  const fetchSavedRecipes = async () => {
    try {
      const res = await api.get("/user/saved-recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const handleHeartClick = async (recipeId) => {
    try {
      const res = await api.post(`/user/save-recipe/${recipeId}`);
      updateCurrentUser({ savedRecipes: res.data });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    // Refresh to reflect if any recipes were unsaved while modal was open
    fetchSavedRecipes();
  };

  return (
    <main className="container">
      <div className="page-header">
        <h2>🔖 Saved Recipes</h2>
        <p>Your favorite hand-picked recipes.</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your saved recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state" style={{ display: "block", textAlign: "center", padding: "3rem" }}>
          <h3>No saved recipes yet!</h3>
          <p style={{ marginTop: "1rem", color: "var(--color-text-light)" }}>
            Explore recipes on the home page and click the save icon to bookmark them here.
          </p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.filter(Boolean).map((recipe) => (
            <RecipeCard
              key={recipe.id || recipe._id}
              recipe={recipe}
              isSaved={true}
              onCardClick={() => openModal(recipe)}
              onHeartClick={() => handleHeartClick(recipe.id || recipe._id)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </main>
  );
}

export default SavedRecipes;
