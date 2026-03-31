import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Shopping from './pages/Shopping';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageRecipes from './pages/ManageRecipes';
import AdminDashboard from './pages/AdminDashboard';
import CreateRecipe from './pages/CreateRecipe';
import SavedRecipes from './pages/SavedRecipes';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/planner" element={<Planner />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/share-recipe" element={<CreateRecipe />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-recipes" element={<ManageRecipes />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
