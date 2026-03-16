import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="container auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Login to your SmartMeal account</p>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            placeholder="Email"
            id="loginEmail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-full"
            required 
          />
          <input 
            type="password" 
            placeholder="Password"
            id="loginPassword" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-full"
            required 
          />
          <button type="submit" className="btn btn-primary btn-full">Login</button>
        </form>

        <div className="auth-divider"><span>OR</span></div>
        <button type="button" className="btn btn-secondary btn-full btn-google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20210618182605%21Google_%22G%22_Logo.svg" alt="Google Logo" className="google-icon" />
          Sign in with Google
        </button>

        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  );
}

export default Login;
