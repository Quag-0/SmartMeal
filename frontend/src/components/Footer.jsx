import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>SmartMeal</h3>
          <p>Your intelligent companion for meal planning, recipe discovery, and shopping lists. Cook smart, eat healthy.</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/planner">Meal Planner</Link>
            <Link to="/shopping">Shopping List</Link>
          </div>
          <div className="link-group">
            <h4>Connect</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SmartMeal. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
