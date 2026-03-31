import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (!currentUser.avatar)
      return `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`;
    if (currentUser.avatar.startsWith("/"))
      return `http://localhost:5000${currentUser.avatar}`;
    return currentUser.avatar;
  };

  const navLinks = [
    { name: "Recipes", path: "/" },
    { name: "Meal Planner", path: "/planner" },
    { name: "Shopping List", path: "/shopping" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo"> SmartMeal</h1>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? "active" : ""}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {currentUser && (
            <li>
              <Link to="/share-recipe" className="share-recipe-link">
                Share Recipe 🍳
              </Link>
            </li>
          )}
        </ul>

        <div className="auth-section">
          {currentUser ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <div
                className="auth-user"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={getAvatarUrl()} alt="Avatar" className="avatar" />
                <span>{currentUser.username}</span>
              </div>
              <div
                className={`user-dropdown ${dropdownOpen ? "show" : ""}`}
              >
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                  ⚙️ Profile
                </Link>
                <Link to="/saved-recipes" onClick={() => setDropdownOpen(false)}>
                  🔖 Saved Recipes
                </Link>
                {currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🛡️ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn-nav">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
