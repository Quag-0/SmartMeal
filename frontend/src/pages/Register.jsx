import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="container auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Join SmartMeal today</p>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            placeholder="Username"
            id="registerUsername" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-full"
            required 
          />
          <input 
            type="email" 
            placeholder="Email"
            id="registerEmail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-full"
            required 
          />
          <input 
            type="password" 
            placeholder="Password"
            id="registerPassword" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-full"
            required 
          />
          <button type="submit" className="btn btn-primary btn-full">Sign Up</button>
        </form>

        <div className="auth-divider"><span>OR</span></div>
        <button type="button" className="btn btn-secondary btn-full btn-google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20210618182605%21Google_%22G%22_Logo.svg" alt="Google Logo" className="google-icon" />
          Sign up with Google
        </button>

        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </main>
  );
}

export default Register;
