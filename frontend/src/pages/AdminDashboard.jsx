import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ManageRecipes from './ManageRecipes';
import ManageReviews from './ManageReviews';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalShoppingLists: 0,
    totalReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <h2>🛡️ Admin Dashboard</h2>
        <p>Monitor system activity and manage content.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          🍳 Manage Recipes
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          💬 Manage Reviews
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-icon">👨‍💻</div>
              <div className="stats-info">
                <h3>{isLoading ? '...' : stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-icon">🥘</div>
              <div className="stats-info">
                <h3>{isLoading ? '...' : stats.totalRecipes}</h3>
                <p>Total Recipes</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-icon">💬</div>
              <div className="stats-info">
                <h3>{isLoading ? '...' : stats.totalReviews}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-icon">🛒</div>
              <div className="stats-info">
                <h3>{isLoading ? '...' : stats.totalShoppingLists}</h3>
                <p>Total Shopping Lists</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="admin-sub-page">
             <ManageRecipes isEmbedded={true} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <ManageReviews />
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
