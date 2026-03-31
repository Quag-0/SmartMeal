import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateRecipe() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Non-Vegetarian');
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', category: 'vegetables' }]);
  const [instructions, setInstructions] = useState(['']);

  const categories = ['Asian', 'Western', 'Italian', 'Vietnamese', 'Healthy', 'Breakfast', 'Dessert'];
  const types = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Chicken', 'Beef', 'Seafood'];

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
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('cookingTime', Number(cookingTime));
      formData.append('category', category);
      formData.append('type', type);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const validIngredients = ingredients
        .filter(i => i.name.trim() !== '')
        .map(i => ({ ...i, category: i.category || 'vegetables' }));
      const validInstructions = instructions.filter(i => i.trim() !== '');
      
      formData.append('ingredients', JSON.stringify(validIngredients));
      formData.append('instructions', JSON.stringify(validInstructions));

      await api.post('/recipes', formData);
      navigate('/');
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err);
      setError(`Failed to share recipe: ${err.response?.data?.message || err.response?.data?.error || 'Check inputs.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>🍳 Share Your Recipe</h2>
        <p>Post your cooking creation and share it with the community!</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border-light)' }}>
        {error && <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Recipe Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Classic Carbonara" required style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #eee', borderRadius: '10px' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Cooking Time (mins)</label>
              <input type="number" value={cookingTime} onChange={e => setCookingTime(e.target.value)} placeholder="30" required style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #eee', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} required style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #eee', borderRadius: '10px' }}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #eee', borderRadius: '10px' }}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Recipe Image</label>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #eee', borderRadius: '10px' }} />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🥘 Ingredients</h3>
              <button type="button" onClick={addIngredient} style={{ background: '#f0f4ff', color: 'var(--color-primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>+ Add</button>
            </div>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <input type="text" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} required style={{ flex: 2, padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }} />
                <input type="text" placeholder="Qty" value={ing.quantity} onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)} required style={{ flex: 1, padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }} />
                <select value={ing.category || 'vegetables'} onChange={e => handleIngredientChange(idx, 'category', e.target.value)} style={{ flex: 1.5, padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }}>
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
                <button type="button" onClick={() => removeIngredient(idx)} style={{ background: '#fff0f0', color: '#e53e3e', border: 'none', padding: '0.6rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📋 Instructions</h3>
              <button type="button" onClick={addInstruction} style={{ background: '#f0f4ff', color: 'var(--color-primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>+ Add Step</button>
            </div>
            {instructions.map((inst, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                <span style={{ minWidth: '24px', fontWeight: 'bold', color: '#ccc' }}>{idx + 1}</span>
                <input type="text" placeholder="Describe this step..." value={inst} onChange={e => handleInstructionChange(idx, e.target.value)} required style={{ flex: 1, padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }} />
                <button type="button" onClick={() => removeInstruction(idx)} style={{ background: '#fff0f0', color: '#e53e3e', border: 'none', padding: '0.6rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flex: 2, padding: '1rem' }}>
              {isLoading ? 'Posting...' : '🚀 Share Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipe;
