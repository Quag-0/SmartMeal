import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  return (
    <div className="admin-sub-page">
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>💬 Manage Reviews</h3>
        <p style={{ margin: 0, marginTop: '5px' }}>Monitor and moderate user comments.</p>
      </div>

      <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by recipe, username, or comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
        />
      </div>

      {isLoading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="recipe-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem' }}>Recipe</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Rating</th>
                <th style={{ padding: '1rem' }}>Comment</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.filter(review => {
                const term = searchTerm.toLowerCase();
                const matchComment = review.comment.toLowerCase().includes(term);
                const matchUser = review.user && review.user.username.toLowerCase().includes(term);
                const matchRecipe = review.recipe && review.recipe.name.toLowerCase().includes(term);
                return matchComment || matchUser || matchRecipe;
              }).map(review => (
                <tr key={review._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{review.recipe?.name || 'Deleted Recipe'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={review.user.avatar ? `http://localhost:5000${review.user.avatar}` : 'https://via.placeholder.com/24'}
                        alt={review.user.username}
                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      />
                      <span>{review.user.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#ffcc00' }}>{'★'.repeat(review.rating)}</td>
                  <td style={{ padding: '1rem', color: '#666', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {review.comment}
                  </td>
                  <td style={{ padding: '1rem', color: '#999', fontSize: '0.85rem' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleDelete(review._id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.filter(review => {
                const term = searchTerm.toLowerCase();
                const matchComment = review.comment.toLowerCase().includes(term);
                const matchUser = review.user && review.user.username.toLowerCase().includes(term);
                const matchRecipe = review.recipe && review.recipe.name.toLowerCase().includes(term);
                return matchComment || matchUser || matchRecipe;
              }).length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No reviews found.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageReviews;
