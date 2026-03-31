import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageRecipes({ isEmbedded = false }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', category: 'vegetables' }]);
  const [instructions, setInstructions] = useState(['']);

  const categories = ['vegetables', 'meat-fish', 'dry-goods'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes');
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCookingTime('');
    setCategory('');
    setType('');
    setImageFile(null);
    setIngredients([{ name: '', quantity: '', category: 'vegetables' }]);
    setInstructions(['']);
    setEditingRecipe(null);
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (recipe) => {
    resetForm();
    setEditingRecipe(recipe);
    setName(recipe.name);
    setCookingTime(recipe.cookingTime);
    setCategory(recipe.category);
    setType(recipe.type);
    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '', category: 'vegetables' }]);
    setInstructions(recipe.instructions.length > 0 ? recipe.instructions : ['']);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      fetchRecipes();
    } catch (err) {
      alert("Failed to delete recipe");
      console.error(err);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', category: 'vegetables' }]);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('cookingTime', cookingTime);
      formData.append('category', category);
      formData.append('type', type);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Filter out empty ingredients and instructions
      const validIngredients = ingredients.filter(i => i.name.trim() !== '');
      const validInstructions = instructions.filter(i => i.trim() !== '');
      
      formData.append('ingredients', JSON.stringify(validIngredients));
      formData.append('instructions', JSON.stringify(validInstructions));

      if (editingRecipe) {
        await api.put(`/recipes/${editingRecipe._id || editingRecipe.id}`, formData);
      } else {
        await api.post('/recipes', formData);
      }
      
      setIsModalOpen(false);
      fetchRecipes();
    } catch (err) {
      console.error(err);
      setError('Failed to save recipe. Please check your inputs.');
    }
  };

  return (
    <div className={isEmbedded ? "" : "container"}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>🛡️ Manage Recipes</h2>
          {!isEmbedded && <p style={{ margin: 0, marginTop: '5px' }}>Admin dashboard to create, edit, and delete global recipes.</p>}
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add New Recipe</button>
      </div>

      <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="🔍 Search recipes by name or author..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
        />
      </div>

      {isLoading ? (
        <p>Loading recipes...</p>
      ) : (
        <div className="recipe-table-container" style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem' }}>Image</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Author</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Rating</th>
                <th style={{ padding: '1rem' }}>Time</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.filter(recipe => {
                const term = searchTerm.toLowerCase();
                const matchName = recipe.name.toLowerCase().includes(term);
                const matchAuthor = recipe.author && recipe.author.username.toLowerCase().includes(term);
                return matchName || matchAuthor;
              }).map(recipe => (
                <tr key={recipe._id || recipe.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <img 
                      src={recipe.image?.startsWith('/') ? `http://localhost:5000${recipe.image}` : recipe.image || 'https://via.placeholder.com/50'} 
                      alt={recipe.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{recipe.name}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {recipe.author ? recipe.author.username : <span style={{ fontStyle: 'italic', opacity: 0.6 }}>System</span>}
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>{recipe.category}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {recipe.averageRating > 0 ? `⭐ ${recipe.averageRating.toFixed(1)}` : '-'}
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>{recipe.cookingTime} min</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', marginRight: '0.5rem', fontSize: '0.9rem' }} onClick={() => openEditModal(recipe)}>Edit</button>
                    <button onClick={() => handleDelete(recipe._id || recipe.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {recipes.filter(recipe => {
                const term = searchTerm.toLowerCase();
                const matchName = recipe.name.toLowerCase().includes(term);
                const matchAuthor = recipe.author && recipe.author.username.toLowerCase().includes(term);
                return matchName || matchAuthor;
              }).length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No recipes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', opacity: 1 }}>
          <div className="modal-container" style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', display: 'block', padding: '2.5rem' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Recipe Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cooking Time (mins)</label>
                    <input type="number" value={cookingTime} onChange={e => setCookingTime(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                </div>
                <div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Italian, Asian, Western" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                    <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="e.g. Vegetarian, Non-Vegetarian" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Recipe Image (Optional)</label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Ingredients</h3>
                  <button type="button" onClick={addIngredient} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>+ Add Ingredient</button>
                </div>
                {ingredients.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="Name (e.g. Tomato)" value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} required style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <input type="text" placeholder="Qty (e.g. 2 pcs)" value={ing.quantity} onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)} required style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <select value={ing.category} onChange={e => handleIngredientChange(idx, 'category', e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
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
                    <button type="button" onClick={() => removeIngredient(idx)} style={{ padding: '0.5rem 0.8rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Instructions</h3>
                  <button type="button" onClick={addInstruction} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>+ Add Step</button>
                </div>
                {instructions.map((inst, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.5rem', fontWeight: 'bold', color: '#666' }}>{idx + 1}.</span>
                    <input type="text" placeholder="Describe this step..." value={inst} onChange={e => handleInstructionChange(idx, e.target.value)} required style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <button type="button" onClick={() => removeInstruction(idx)} style={{ padding: '0.5rem 0.8rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>{editingRecipe ? 'Save Changes' : 'Create Recipe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRecipes;
