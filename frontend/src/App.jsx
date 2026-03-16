import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Shopping from './pages/Shopping';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageRecipes from './pages/ManageRecipes';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/manage-recipes" element={<ManageRecipes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
